import { addActionHandler, getGlobal, setGlobal } from '../../index';
import { callApi } from '../../../api/gramjs';
import { ActionReturnType, IWallet } from '../../types';
import { getCurrentTabId } from '../../../util/establishMultitabRole';
import { t } from 'i18next';

addActionHandler(
  'createWallet',
  (global, actions, payload): ActionReturnType => {
    void callApi('requestCreateWallet', payload!);

    actions.getWallets(payload);
    actions.showNotification({
      message: t('Wallet.wallet_successfully_created'),
      tabId: getCurrentTabId(),
    });
  }
);

addActionHandler('getAssetsList', (global): ActionReturnType => {
  void callApi('requestAssetsList');

  global = getGlobal();
  global = {
    ...global,
  };
  setGlobal(global);
});

addActionHandler('getLimitsAndFees', async (global): Promise<void> => {
  const result = await callApi('requestLimitsAndFees');
  if (result) {
    global = getGlobal();
    global = {
      ...global,
      limitsAndFee: { ...global.limitsAndFee, ...result },
    };
    setGlobal(global);
  }
});

addActionHandler('getAvailablePaymentSystem', async (global): Promise<void> => {
  const result = await callApi('requestAvailablePaymentMethods');

  global = getGlobal();
  global = {
    ...global,
    availablePaymentSystem: result || [],
  };
  setGlobal(global);
});

addActionHandler(
  'getUserWallet',
  (global, actions, payload): ActionReturnType => {
    void callApi('requestGetUserWallet', payload!);

    // actions.showNotification({
    //   message: t('ForgotPassword.Changed'),
    //   tabId: getCurrentTabId(),
    // });

    global = getGlobal();
    global = {
      ...global,
    };
    setGlobal(global);
  }
);

addActionHandler(
  'getWallets',
  async (global, actions, payload): Promise<void> => {
    const result = await callApi('requestGetWallets', payload!);
    global = getGlobal();

    global = {
      ...global,
      walletLoading: true,
      wallets: result || [],
    };
    setGlobal(global);

    if (result) {
      const earn = result?.find((el) => el.type === 'earning');
      if (earn) actions.getWalletEarn({ wallet_id: earn?.id });
    }
  }
);

addActionHandler(
  'getWalletEarn',
  async (global, actions, payload): Promise<void> => {
    const result: { available_balance: number } = await callApi(
      'requestWalletEarn',
      payload
    );
    global = getGlobal();
    if (result) {
      global = {
        ...global,
        wallets: [
          ...global.wallets.filter((wallet) => wallet.id !== payload.wallet_id),
          {
            ...global.wallets.find(
              (wallet) => wallet.id === payload.wallet_id
            )!,
            available_balance: result.available_balance,
          },
        ],
      };
    }

    setGlobal(global);
  }
);

addActionHandler(
  'getWalletPayments',
  (global, actions, payload): ActionReturnType => {
    void callApi('requestGetWalletPayments', payload!);
    global = getGlobal();
    global = {
      ...global,
    };
    setGlobal(global);
  }
);

addActionHandler(
  'withdrawApprovePayment',
  (global, actions, payload): ActionReturnType => {
    void callApi('requestWithdrawApprovePayment', payload!);

    global = getGlobal();
    global = {
      ...global,
    };
    setGlobal(global);
  }
);

addActionHandler(
  'earnStatistic',
  (global, actions, payload): ActionReturnType => {
    void callApi('requestEarnStatistic', payload!);

    global = getGlobal();
    global = {
      ...global,
    };
    setGlobal(global);
  }
);

addActionHandler(
  'getEarnStatisticGraphic',
  async (global, actions, payload): Promise<void> => {
    const result = await callApi('requestEarnStatisticGraphic', payload!);
    global = getGlobal();
    global = {
      ...global,
    };
    setGlobal(global);
  }
);

addActionHandler(
  'getTransferGraphic',
  async (global, actions, payload): Promise<void> => {
    const result = await callApi('requestTransferGraphic', payload);
    global = getGlobal();
    if (result) {
      global = {
        ...global,
        statistic: {
          ...global.statistic!,
          transfer: result,
        },
      };
    }
    setGlobal(global);
  }
);

addActionHandler(
  'getLastMonthActivityGraphic',
  async (global, actions, payload): Promise<void> => {
    const result = await callApi('requestLastMonthActivityGraphic', payload!);
    global = getGlobal();
    if (result) {
      const { amount, data } = result;
      global = {
        ...global,
        statistic: {
          ...global.statistic!,
          lastMonth: { amount, data: data || undefined },
        },
      };
    }

    setGlobal(global);
  }
);

addActionHandler(
  'getWalletTransaction',
  (global, actions, payload): ActionReturnType => {
    void callApi('requestGetWalletTransaction', payload!);

    global = getGlobal();
    global = {
      ...global,
    };
    setGlobal(global);
  }
);

addActionHandler(
  'getWalletTransactions',
  async (global, actions, payload): Promise<void> => {
    const result = await callApi('requestTransactions', payload);
    global = getGlobal();
    if (result) {
      global = {
        ...global,
        transactionsHistory: result.transactions || [],
      };
    }
    setGlobal(global);
  }
);

addActionHandler(
  'channelsEarnStatistics',
  async (global, actions, payload): Promise<void> => {
    const result = await callApi('requestChannelsEarnStatistics', payload);
    const { reward, last_month_reward, data } = result;

    global = getGlobal();
    global = {
      ...global,
      earnStatistics: {
        reward,
        last_month_reward,
        data: data || [],
      },
    };
    setGlobal(global);
  }
);

addActionHandler(
  'makeTransfer',
  (global, actions, payload): ActionReturnType => {
    void callApi('requestMakeTransfer', payload!);

    global = getGlobal();
    global = {
      ...global,
    };
    setGlobal(global);
  }
);

addActionHandler(
  'searchUserWallet',
  (global, actions, payload): ActionReturnType => {
    void callApi('requestSearchUserWallet', payload!);

    global = getGlobal();
    global = {
      ...global,
    };
    setGlobal(global);
  }
);
