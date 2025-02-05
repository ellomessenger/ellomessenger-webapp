import React, { memo, useCallback, useEffect } from 'react';
import { getActions } from '../../global';

import type { FC } from 'react';

import { TME_LINK_PREFIX } from '../../config';
import useLang from '../../hooks/useLang';

import './ConfirmPayment.scss';

export type OwnProps = {
  url: string;
  noRedirect?: boolean;
  onClose: NoneToVoidFunction;
};

interface IframeCallbackEvent {
  eventType: string;
  eventData: {
    path_full: string;
  };
}

const ConfirmPayment: FC<OwnProps> = ({ url, noRedirect, onClose }) => {
  const { openElloLink } = getActions();

  const lang = useLang();

  const handleMessage = useCallback(
    (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as IframeCallbackEvent;
        const { eventType, eventData } = data;

        if (eventType !== 'web_app_open_tg_link') {
          return;
        }

        if (!noRedirect) {
          const linkUrl = TME_LINK_PREFIX + eventData.path_full;
          openElloLink({ url: linkUrl });
        }

        onClose();
      } catch (err) {
        // Ignore other messages
      }
    },
    [onClose, noRedirect, openElloLink]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  return (
    <div className='ConfirmPayment'>
      <iframe
        src={url}
        title={lang('Checkout.WebConfirmation.Title')}
        allow='payment'
        sandbox='allow-modals allow-forms allow-scripts allow-same-origin allow-top-navigation'
        className='ConfirmPayment__content'
      />
    </div>
  );
};

export default memo(ConfirmPayment);
