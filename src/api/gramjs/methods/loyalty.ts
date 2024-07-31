import { buildBizRaw } from '../gramjsBuilders';
import { invokeRequest } from './client';
import { Api as GramJs } from '../../../lib/gramjs';

export async function requestLoyaltyPackage(payload: {
  is_business?: boolean;
  is_default?: boolean;
}) {
  const sendData = {
    service: 101100,
    method: 100500,
    data: payload,
  };
}

export async function generationCodeRequest(payload: { user_id: number }) {
  const sendData = {
    service: 101100,
    method: 100300,
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

export async function refCodeRequest(payload: {
  is_business?: boolean;
  is_default?: boolean;
}) {
  const sendData = {
    service: 101100,
    method: 100600,
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
  }
}

export async function checkReferralCode(payload: {
  code: string;
  user_id: number;
}) {
  const sendData = {
    service: 101100,
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
  if (result.data) {
    //void appendCode(payload);
  }
  return undefined;
}

export async function saveReferralCode(payload: {
  code: string;
  user_id: number;
}) {
  const sendData = {
    service: 101100,
    method: 100800,
    data: payload,
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    }),
    {
      shouldReturnTrue: true,
    }
  );
}

export async function activateReferralCode(payload: { id: number }) {
  const sendData = {
    service: 101100,
    method: 100900,
    data: payload,
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    }),
    {
      shouldReturnTrue: true,
      shouldIgnoreErrors: true,
    }
  );
}

export async function appendCode(payload: { user_id: number; code: string }) {
  const sendData = {
    service: 101100,
    method: 100100,
    data: payload,
  };
  const buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    }),
    {
      shouldReturnTrue: true,
    }
  );
}

export async function requestRefUsers(payload: {
  id: number;
  pagination?: { page: number; per_page: number };
}) {
  const sendData = {
    service: 101100,
    method: 100400,
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

export async function requestCalcPercents(payload: {
  user_id: number;
  code: string;
}) {
  const sendData = {
    service: 101100,
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
    const parsResult = JSON.parse(result.data);
    //console.log(parsResult);
  }
}

export async function requestUserReferralProgram(payload: { id: number }) {
  const sendData = {
    service: 101100,
    method: 101000,
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

export async function requestLoyaltyBonusDataWithSum(payload: { id: number }) {
  const sendData = {
    service: 101100,
    method: 101100,
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
