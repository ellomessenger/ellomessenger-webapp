import {
  ApiUpdateAiPurchases,
  ApiUpdateWithdrawTemplate,
} from './../../../api/types/updates';
import { addActionHandler, getGlobal, setGlobal } from '../../index';

import { IS_PRODUCTION_HOST } from '../../../util/windowEnvironment';
import { closeInvoice } from '../../reducers';
import * as langProvider from '../../../util/langProvider';
import { formatCurrency } from '../../../util/formatCurrency';
import { selectChatMessage, selectTabState } from '../../selectors';
import { updateTabState } from '../../reducers/tabs';
import type { ActionReturnType, GlobalState } from '../../types';
import { ApiUpdatePaymentState } from '../../../api/types';

addActionHandler('apiUpdate', (global, actions, update): ActionReturnType => {
  switch (update['@type']) {
    case 'updatePaymentStateCompleted':
      {
        Object.values(global.byTabId).forEach(({ id: tabId }) => {
          const { inputInvoice } = selectTabState(global, tabId).payment;

          if (
            inputInvoice &&
            'chatId' in inputInvoice &&
            'messageId' in inputInvoice
          ) {
            const message = selectChatMessage(
              global,
              inputInvoice.chatId,
              inputInvoice.messageId
            );

            if (message && message.content.invoice) {
              const { amount, currency, title } = message.content.invoice;

              actions.showNotification({
                tabId,
                message: langProvider.translate('PaymentInfoHint', [
                  formatCurrency(
                    amount,
                    currency,
                    langProvider.getTranslationFn().code
                  ),
                  title,
                ]),
              });
            }
          }

          // On the production host, the payment frame receives a message with the payment event,
          // after which the payment form closes. In other cases, the payment form must be closed manually.
          // Closing the invoice will cause the closing of the Payment Modal dialog and then closing the payment.
          if (!IS_PRODUCTION_HOST) {
            global = closeInvoice(global, tabId);
          }

          if (
            update.slug &&
            inputInvoice &&
            'slug' in inputInvoice &&
            inputInvoice.slug !== update.slug
          ) {
            return;
          }

          global = updateTabState(
            global,
            {
              payment: {
                ...selectTabState(global, tabId).payment,
                status: 'paid',
              },
            },
            tabId
          );
        });
      }
      return;
    case 'updatePaymentState':
      onUpdatePaymentState(global, update);
      return;
    case 'updateWithdrawTemplate':
      onUpdateWithdrawTemplate(global, update);
      break;
    case 'updateAiPurchases':
      onUpdateAiPurchases(global, update);
      break;
  }

  return undefined;
});

function onUpdatePaymentState<T extends GlobalState>(
  global: T,
  update: ApiUpdatePaymentState
) {
  global = getGlobal();
  global = {
    ...global,
    payment: update.payment,
  };
  setGlobal(global);
}

function onUpdateWithdrawTemplate<T extends GlobalState>(
  global: T,
  update: ApiUpdateWithdrawTemplate | undefined
) {
  global = getGlobal();

  global = {
    ...global,
    withdrawTemplate: update
      ? { ...global.withdrawTemplate, ...update.template }
      : undefined,
  };
  setGlobal(global);
}

function onUpdateAiPurchases<T extends GlobalState>(
  global: T,
  update: ApiUpdateAiPurchases | undefined
) {
  global = getGlobal();
  global = {
    ...global,
    aiPurchases: update?.purchases,
  };
  setGlobal(global);
}
