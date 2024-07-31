import { number } from 'card-validator';
import BigInt from 'big-integer';
import { Api as GramJs } from '../../../lib/gramjs';
import { invokeRequest } from './client';
import {
  buildBizRaw,
  buildInputInvoice,
  buildInputPeer,
  buildShippingInfo,
} from '../gramjsBuilders';
import {
  buildApiInvoiceFromForm,
  buildApiPremiumPromo,
  buildApiPaymentForm,
  buildApiReceipt,
  buildShippingOptions,
} from '../apiBuilders/payments';
import type { ApiChat, OnApiUpdate, ApiRequestInputInvoice } from '../../types';
import localDb from '../localDb';
import {
  addEntitiesWithPhotosToLocalDb,
  deserializeBytes,
  serializeBytes,
} from '../helpers';
import { buildApiUser } from '../apiBuilders/users';
import { getTemporaryPaymentPassword } from './twoFaSettings';
import {
  IEreateBankWithdrawRequisites,
  IRequestMakePayment,
  IRequestPaymentLink,
  IWithdrawCreatePayment,
} from '../../../global/types';
import { AiPurchaseType } from '../../../components/payment/PaymentAi';
import { ConfirmEmailType } from '../../../types';

let onUpdate: OnApiUpdate;

export function init(_onUpdate: OnApiUpdate) {
  onUpdate = _onUpdate;
}

export async function validateRequestedInfo({
  inputInvoice,
  requestInfo,
  shouldSave,
}: {
  inputInvoice: ApiRequestInputInvoice;
  requestInfo: GramJs.TypePaymentRequestedInfo;
  shouldSave?: boolean;
}): Promise<
  | {
      id: string;
      shippingOptions: any;
    }
  | undefined
> {
  const result = await invokeRequest(
    new GramJs.payments.ValidateRequestedInfo({
      invoice: buildInputInvoice(inputInvoice),
      save: shouldSave || undefined,
      info: buildShippingInfo(requestInfo),
    })
  );
  if (!result) {
    return undefined;
  }

  const { id, shippingOptions } = result;
  if (!id) {
    return undefined;
  }

  return {
    id,
    shippingOptions: buildShippingOptions(shippingOptions),
  };
}

export async function sendPaymentForm({
  inputInvoice,
  formId,
  requestedInfoId,
  shippingOptionId,
  credentials,
  savedCredentialId,
  temporaryPassword,
  tipAmount,
}: {
  inputInvoice: ApiRequestInputInvoice;
  formId: string;
  credentials: any;
  requestedInfoId?: string;
  shippingOptionId?: string;
  savedCredentialId?: string;
  temporaryPassword?: string;
  tipAmount?: number;
}) {
  const inputCredentials =
    temporaryPassword && savedCredentialId
      ? new GramJs.InputPaymentCredentialsSaved({
          id: savedCredentialId,
          tmpPassword: deserializeBytes(temporaryPassword),
        })
      : new GramJs.InputPaymentCredentials({
          save: credentials.save,
          data: new GramJs.DataJSON({ data: JSON.stringify(credentials.data) }),
        });
  const result = await invokeRequest(
    new GramJs.payments.SendPaymentForm({
      formId: BigInt(formId),
      invoice: buildInputInvoice(inputInvoice),
      requestedInfoId,
      shippingOptionId,
      credentials: inputCredentials,
      ...(tipAmount && { tipAmount: BigInt(tipAmount) }),
    })
  );

  if (result instanceof GramJs.payments.PaymentVerificationNeeded) {
    onUpdate({
      '@type': 'updatePaymentVerificationNeeded',
      url: result.url,
    });

    return undefined;
  }

  return Boolean(result);
}

export async function getPaymentForm(inputInvoice: ApiRequestInputInvoice) {
  const result = await invokeRequest(
    new GramJs.payments.GetPaymentForm({
      invoice: buildInputInvoice(inputInvoice),
    })
  );

  if (!result) {
    return undefined;
  }

  if (result.photo) {
    localDb.webDocuments[result.photo.url] = result.photo;
  }

  addEntitiesWithPhotosToLocalDb(result.users);

  return {
    form: buildApiPaymentForm(result),
    invoice: buildApiInvoiceFromForm(result),
    users: result.users.map(buildApiUser).filter(Boolean),
  };
}

export async function getReceipt(chat: ApiChat, msgId: number) {
  const result = await invokeRequest(
    new GramJs.payments.GetPaymentReceipt({
      peer: buildInputPeer(chat.id, chat.accessHash),
      msgId,
    })
  );

  if (!result) {
    return undefined;
  }

  addEntitiesWithPhotosToLocalDb(result.users);

  return {
    receipt: buildApiReceipt(result),
    users: result.users.map(buildApiUser).filter(Boolean),
  };
}

export async function fetchPremiumPromo() {
  const result = await invokeRequest(new GramJs.help.GetPremiumPromo());
  if (!result) return undefined;

  addEntitiesWithPhotosToLocalDb(result.users);

  const users = result.users.map(buildApiUser).filter(Boolean);
  result.videos.forEach((video) => {
    if (video instanceof GramJs.Document) {
      localDb.documents[video.id.toString()] = video;
    }
  });

  return {
    promo: buildApiPremiumPromo(result),
    users,
  };
}

export async function fetchTemporaryPaymentPassword(password: string) {
  const result = await getTemporaryPaymentPassword(password);

  if (!result) {
    return undefined;
  }

  if ('error' in result) {
    return result;
  }

  return {
    value: serializeBytes(result.tmpPassword),
    validUntil: result.validUntil,
  };
}

export async function requestGetPayPalPaymentLink(
  payload: IRequestPaymentLink
) {
  let sendData = {
    service: 100500,
    method: 100700,
    data: payload,
  };

  onUpdate({
    '@type': 'updatePaymentState',
    payment: { status: 'connecting' },
  });

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) return;
  const parsResult = JSON.parse(result.data);

  onUpdate({
    '@type': 'updatePaymentState',
    payment: { status: 'compl', ...parsResult },
  });
  return parsResult;
}

export async function requestStripePaymentLink(payload: IRequestPaymentLink) {
  let sendData = {
    service: 100500,
    method: 102500,
    data: payload,
  };

  onUpdate({
    '@type': 'updatePaymentState',
    payment: { status: 'connecting' },
  });

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (result) {
    const parsResult = JSON.parse(result.data);

    onUpdate({
      '@type': 'updatePaymentState',
      payment: parsResult,
    });
    return parsResult;
  }
}

export async function requestGetWalletPaymentById(payload: {
  payment_id: number;
  wallet_id: number;
}) {
  let sendData = {
    service: 100500,
    method: 102000,
    data: payload,
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) return;
  const parsResult = JSON.parse(result.data);
  onUpdate({
    '@type': 'updatePaymentState',
    payment: { ...parsResult.payment, payment_id: parsResult.payment.id },
  });
  return parsResult;
}

export async function requestMakePayment(payload: IRequestMakePayment) {
  let sendData = {
    service: 100500,
    method: 100500,
    data: payload,
  };

  onUpdate({
    '@type': 'updatePaymentState',
    payment: { status: 'connecting' },
  });

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }
  const parsResult = JSON.parse(result.data);
  onUpdate({
    '@type': 'updatePaymentState',
    payment: parsResult,
  });
  return parsResult;
}

export async function requestWithdrawPaymentTemplate(
  payload: IWithdrawCreatePayment
) {
  let sendData = {
    service: 100500,
    method: 100800,
    data: payload,
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }
  return JSON.parse(result.data);
}

export async function approveWithdrawPayment(payload: {
  wallet_id: number;
  payment_id: string;
  approve_code: string;
  paypal_email?: string;
  bank_withdraw_requisites_id?: number;
  initial_amount?: number;
}) {
  const { wallet_id, payment_id, initial_amount } = payload;
  const sendData = {
    service: 100500,
    method: 101000,
    data: payload,
  };
  onUpdate({
    '@type': 'updatePaymentState',
    payment: { status: 'connecting' },
  });

  const buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }

  const parsResult = JSON.parse(result.data);
  onUpdate({
    '@type': 'updatePaymentState',
    payment: { status: 'completed', amount: String(initial_amount) },
  });
  void cancelWithdrawTemplate({
    wallet_id,
    payment_id,
  });
  return parsResult;
}

export async function transferBetweenWallets(payload: {
  from_wallet_id: number;
  to_wallet_id: number;
  currency?: string;
  message?: string;
  amount: number;
}) {
  const sendData = {
    service: 100500,
    method: 102300,
    data: payload,
  };

  onUpdate({
    '@type': 'updatePaymentState',
    payment: { status: 'connecting' },
  });

  const buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (result) {
    const parsResult = JSON.parse(result.data);
    onUpdate({
      '@type': 'updatePaymentState',
      payment: { status: 'completed', amount: parsResult.amount },
    });
    return parsResult;
  }
}

export async function requestFeeForInternalTransactions(payload: {
  from_wallet_id: number;
  to_wallet_id: number;
  currency?: string;
  message?: string;
  amount: number;
}) {
  const sendData = {
    service: 100500,
    method: 102800,
    data: payload,
  };

  const buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }
  return JSON.parse(result.data);
}

export async function sendCodeToEmail(payload: {
  payment_id: string;
  wallet_id: number;
  email?: string;
  bank_requisites_id?: number;
  tabId?: number;
}) {
  const { payment_id, wallet_id, email } = payload;
  const sendData = {
    service: 100500,
    method: 102100,
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }
  const parsResult = JSON.parse(result.data);
  onUpdate({
    '@type': 'updateConfirmEmailState',
    type: ConfirmEmailType.confirmWithdrawal,
    expire: parsResult.confirmation_expire,
    payment_id,
    wallet_id,
    email,
    params: payload,
  });
}

export async function cancelWithdrawTemplate(payload: {
  wallet_id: number;
  payment_id: string;
}) {
  let sendData = {
    service: 100500,
    method: 100900,
    data: payload,
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }
  return JSON.parse(result.data);
}

export async function requestCreateBankWithdrawRequisites(
  payload: IEreateBankWithdrawRequisites
) {
  let sendData = {
    service: 100500,
    method: 101300,
    data: payload,
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (result) {
    return JSON.parse(result.data);
  }
}

export async function requestGetBankWithdrawRequisites(payload: {
  requisite_id: number;
}) {
  const sendData = {
    service: 100500,
    method: 101400,
    data: payload,
  };

  const buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (result) {
    const parsResult = JSON.parse(result.data);
    return parsResult;
  }
}

export async function requestGetBankWithdrawsRequisites(payload: {
  limit?: number;
  offset?: number;
  is_template?: boolean;
}) {
  const { limit = 999, offset, is_template } = payload;
  let sendData = {
    service: 100500,
    method: 101500,
    data: { limit, offset, is_template },
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );

  const parsResult = JSON.parse(result.data);

  return parsResult;
}

export async function setWithdrawTemplate(payload: {
  template_id: number;
  data: IEreateBankWithdrawRequisites;
}) {
  const { template_id, data } = payload;

  let sendData = {
    service: 100500,
    method: 102900,
    data: { template_id, ...data },
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    }),
    { shouldReturnTrue: true }
  );

  return result;
}

export async function requestAiPurchases() {
  const sendData = {
    service: 100700,
    method: 100100,
    data: { bot_id: 776999 },
  };
  const buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );

  if (result) {
    const purchases = JSON.parse(result.data);
    onUpdate({ '@type': 'updateAiPurchases', purchases });
  }
}

export async function subscribeAi(payload: {
  sub_type: AiPurchaseType;
  quantity?: number | undefined;
}) {
  const sendData = {
    service: 100700,
    method: 100500,
    data: payload,
  };

  const buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (result) {
    const purchases = JSON.parse(result.data);

    onUpdate({ '@type': 'updateAiPurchases', purchases });
    onUpdate({
      '@type': 'updatePaymentState',
      payment: {
        status: 'completed',
        amount: String(payload.quantity),
        payment_type: String(payload.sub_type),
      },
    });
  }
}
