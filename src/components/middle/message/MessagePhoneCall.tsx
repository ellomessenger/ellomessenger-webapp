import React, { FC, memo, useCallback, useMemo } from 'react';

import { getActions } from '../../../global';
import type { ApiMessage, PhoneCallAction } from '../../../api/types';
import { formatTimeDuration, formatTime } from '../../../util/dateFormat';
import { ARE_CALLS_SUPPORTED } from '../../../util/windowEnvironment';
import Button from '../../ui/Button';
import styles from './MessagePhoneCall.module.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';

type OwnProps = {
  isOwn?: boolean;
  phoneCall: PhoneCallAction;
  message: ApiMessage;
  chatId: string;
};

const MessagePhoneCall: FC<OwnProps> = ({
  phoneCall,
  message,
  chatId,
  isOwn,
}) => {
  const { requestMasterAndRequestCall } = getActions();

  const { t } = useTranslation();
  const { isOutgoing, isVideo, reason } = phoneCall;
  const isMissed = reason === 'missed';
  const isCancelled = reason === 'busy' && !isOutgoing;

  const handleCall = useCallback(() => {
    requestMasterAndRequestCall({ isVideo, userId: chatId });
  }, [chatId, isVideo, requestMasterAndRequestCall]);

  const reasonText = useMemo(() => {
    if (isVideo) {
      if (isCancelled) return 'Call.Video.IncomingDeclined';
      if (isMissed)
        return isOutgoing
          ? 'Call.Video.OutgoingMissed'
          : 'Call.Video.IncomingMissed';

      return isOutgoing ? 'Call.Video.Outgoing' : 'Call.Video.Incoming';
    } else {
      if (isCancelled) return 'Call.IncomingDeclined';
      if (isMissed)
        return isOutgoing ? 'Call.OutgoingMissed' : 'Call.IncomingMissed';

      return isOutgoing ? 'Call.Outgoing' : 'Call.Incoming';
    }
  }, [isCancelled, isMissed, isOutgoing, isVideo]);

  const duration = useMemo(() => {
    return phoneCall.duration
      ? formatTimeDuration(t, phoneCall.duration)
      : undefined;
  }, [phoneCall.duration]);

  const timeFormatted = formatTime(t, message.date * 1000);

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <div className={styles.reason}>{t(reasonText)}</div>
        <div className={styles.meta}>
          <i
            className={classNames(
              'icon-svg',
              styles.arrow,
              isMissed && styles.missed,
              !isOutgoing && styles.incoming
            )}
          >
            <IconSvg name='rotate-arrow' />
          </i>
          <span className={styles.duration}>
            {duration
              ? t('CallMessageWithDuration', { timeFormatted, duration })
              : timeFormatted}
          </span>
        </div>
      </div>
      {/* <Button
        size='smaller'
        color={isOwn ? 'primary' : 'translucent'}
        round
        ripple
        onClick={handleCall}
        className={classNames(
          styles.button,
          isOwn ? styles.primary : styles.translucent
        )}
        disabled={!ARE_CALLS_SUPPORTED}
        ariaLabel={t(isOutgoing ? 'Call.Again' : 'Call.Back')}
      >
        <i className='icon-svg'>
          <IconSvg name={isVideo ? 'video-call' : 'phone'} />
        </i>
      </Button> */}
    </div>
  );
};

export default memo(MessagePhoneCall);
