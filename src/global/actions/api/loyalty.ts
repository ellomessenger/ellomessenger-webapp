import { callApi } from '../../../api/gramjs';
import { addActionHandler, getGlobal, setGlobal } from '../../index';
import { setLoyaltyData } from '../../reducers';
import { ActionReturnType, ILoyalty } from '../../types';

addActionHandler(
  'getReferralCode',
  async (global, actions, payload): Promise<void> => {
    const { currentUserId } = global;
    if (currentUserId) {
      const result = await callApi('generationCodeRequest', {
        user_id: Number(currentUserId),
      });

      if (!result) return;
      global = getGlobal();
      global = setLoyaltyData(global, {
        ...result.package_data,
        code: result.code,
      });
      setGlobal(global);
      //actions.getReferralUsers();
    }
  }
);

addActionHandler('checkReferralCode', (global): ActionReturnType => {
  const { currentUserId, authRefCode } = global;
  if (currentUserId && authRefCode) {
    callApi('checkReferralCode', {
      user_id: Number(currentUserId),
      code: authRefCode,
    });
  }
});

addActionHandler('saveReferralCode', (global): ActionReturnType => {
  const { currentUserId, authRefCode } = global;
  if (currentUserId && authRefCode) {
    void callApi('saveReferralCode', {
      user_id: Number(currentUserId),
      code: authRefCode,
    });
  }
});

addActionHandler('activateReferralCode', (global): ActionReturnType => {
  const { currentUserId } = global;
  void callApi('activateReferralCode', { id: Number(currentUserId) });
});

addActionHandler(
  'getReferralUsers',
  async (global, actions, payload): Promise<void> => {
    const { currentUserId, loyalty } = global;

    const result = await callApi('requestRefUsers', {
      id: Number(currentUserId),
      ...payload,
    });

    if (!result || !result.users) return;
    global = getGlobal();
    global = setLoyaltyData(global, {
      total: result.total,
      users:
        loyalty?.users && payload.pagination?.page! > 1
          ? [...loyalty?.users, ...result.users]
          : result.users,
    });
    setGlobal(global);
  }
);

addActionHandler('getUserReferralProgram', async (global): Promise<void> => {
  const { currentUserId } = global;
  const result = await callApi('requestUserReferralProgram', {
    id: Number(currentUserId),
  });

  if (!result) return;
  global = getGlobal();
  global = setLoyaltyData(global, result);
  setGlobal(global);
});

addActionHandler(
  'getLoyaltyBonusDataWithSum',
  async (global): Promise<void> => {
    const { currentUserId } = global;
    const result: ILoyalty = await callApi('requestLoyaltyBonusDataWithSum', {
      id: Number(currentUserId),
    });

    if (!result) return;
    const { count_users, sum } = result;
    global = getGlobal();
    global = setLoyaltyData(global, { count_users, sum });
    setGlobal(global);
  }
);
