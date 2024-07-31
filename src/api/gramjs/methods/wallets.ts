import {
  IRequestWalletPayments,
  IWithdrawApprovePayment,
  IGetLastMonthActivityGraphic,
  IRequestTransactions,
  IChannelsEarnStatistics,
  IMakeTransfer,
  ISearchUserWallet,
  IWallet,
  IGetStatisticGraphic,
} from '../../../global/types';
import { buildBizRaw } from '../gramjsBuilders';
import { invokeRequest } from './client';
import { Api as GramJs } from '../../../lib/gramjs';

export async function requestCreateWallet(payload: { asset_id: number }) {
  let sendData = {
    service: 100500,
    method: 100100,
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
  return parsResult;
}

export async function requestAssetsList() {
  let sendData = {
    service: 100500,
    method: 100300,
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
  return parsResult;
}

export async function requestLimitsAndFees() {
  const sendData = {
    service: 100500,
    method: 102600,
  };
  const buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (result) {
    return JSON.parse(result.data);
  }
}

export async function requestAvailablePaymentMethods() {
  const sendData = {
    service: 100500,
    method: 103000,
    data: {},
  };
  const buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );

  if (result) {
    return JSON.parse(result.data);
  }
}

export async function requestGetUserWallet(payload: { asset_id: string }) {
  let sendData = {
    service: 100500,
    method: 100400,
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
  const parsResult = JSON.parse(result.data);
  return parsResult;
}

export async function requestGetWallets(payload: { asset_id: number }) {
  let sendData = {
    service: 100500,
    method: 100200,
    data: payload,
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) return;
  const parsResult: { wallets: Array<IWallet> } = JSON.parse(result.data);
  return parsResult.wallets;
}

export async function requestWalletEarn(payload: { wallet_id: number }) {
  let sendData = {
    service: 100500,
    method: 101100,
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

export async function requestGetWalletPayments(
  payload: IRequestWalletPayments
) {
  let sendData = {
    service: 100500,
    method: 100600,
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
  const parsResult = JSON.parse(result.data);
  return parsResult;
}

export async function requestWithdrawApprovePayment(
  payload: IWithdrawApprovePayment
) {
  let sendData = {
    service: 100500,
    method: 101000,
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
  const parsResult = JSON.parse(result.data);
  return parsResult;
}

export async function requestEarnStatistic(payload: { wallet_id: number }) {
  let sendData = {
    service: 100500,
    method: 101000,
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
  const parsResult = JSON.parse(result.data);
  return parsResult;
}

export async function requestEarnStatisticGraphic(payload: {
  wallet_id: number;
  period: string;
}) {
  let sendData = {
    service: 100500,
    method: 101200,
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

export async function requestTransferGraphic(payload: IGetStatisticGraphic) {
  let sendData = {
    service: 100500,
    method: 101600,
    data: payload,
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (result) {
    return JSON.parse(result.data).data || undefined;
  }
}

export async function requestLastMonthActivityGraphic(
  payload: IGetLastMonthActivityGraphic
) {
  const sendData = {
    service: 100500,
    method: 101700,
    data: payload,
  };

  const buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (result) {
    return JSON.parse(result.data);
  }
}

export async function requestGetWalletTransaction(payload: {
  transaction_id: number;
  transaction_uuid: string;
}) {
  let sendData = {
    service: 100500,
    method: 101800,
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
  const parsResult = JSON.parse(result.data);
  return parsResult;
}

export async function requestTransactions(payload: IRequestTransactions) {
  let sendData = {
    service: 100500,
    method: 101900,
    data: { offset: 0, limit: 999, ...payload },
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

export async function requestWithdrawSendApproveCode(payload: {}) {
  let sendData = {
    service: 100500,
    method: 102100,
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
  const parsResult = JSON.parse(result.data);
  return parsResult;
}

export async function requestChannelsEarnStatistics(
  payload: IChannelsEarnStatistics
) {
  let sendData = {
    service: 100500,
    method: 102200,
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

export async function requestMakeTransfer(payload: IMakeTransfer) {
  let sendData = {
    service: 100500,
    method: 102300,
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
  const parsResult = JSON.parse(result.data);
  return parsResult;
}

export async function requestSearchUserWallet(payload: ISearchUserWallet) {
  let sendData = {
    service: 100500,
    method: 102400,
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
  const parsResult = JSON.parse(result.data);
  return parsResult;
}
