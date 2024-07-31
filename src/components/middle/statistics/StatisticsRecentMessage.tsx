import React, { FC, memo, useCallback } from 'react';

import type { LangFn } from '../../../hooks/useLang';
import { getActions } from '../../../global';

import type {
  ApiMessage,
  StatisticsRecentMessage as StatisticsRecentMessageType,
} from '../../../api/types';

import { formatDateTimeToString } from '../../../util/dateFormat';
import {
  getMessageMediaHash,
  getMessageMediaThumbDataUri,
  getMessageVideo,
  getMessageRoundVideo,
} from '../../../global/helpers';
import { renderMessageSummary } from '../../common/helpers/renderMessageText';
import useMedia from '../../../hooks/useMedia';

import './StatisticsRecentMessage.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

export type OwnProps = {
  message: ApiMessage & StatisticsRecentMessageType;
};

const StatisticsRecentMessage: FC<OwnProps> = ({ message }) => {
  const { t } = useTranslation();
  const { toggleMessageStatistics } = getActions();

  const mediaThumbnail = getMessageMediaThumbDataUri(message);
  const mediaBlobUrl = useMedia(getMessageMediaHash(message, 'micro'));
  const isRoundVideo = Boolean(getMessageRoundVideo(message));

  const handleClick = useCallback(() => {
    toggleMessageStatistics({ messageId: message.id });
  }, [toggleMessageStatistics, message.id]);

  return (
    <div
      className={classNames(
        'StatisticsRecentMessage',
        Boolean(mediaBlobUrl || mediaThumbnail) &&
          'StatisticsRecentMessage--with-image'
      )}
      // onClick={handleClick} відключив за проханням Антона. На той момент статистика для постів не була реалізована
    >
      <div className='StatisticsRecentMessage__title'>
        <div className='StatisticsRecentMessage__summary'>
          {renderSummary(
            t,
            message,
            mediaBlobUrl || mediaThumbnail,
            isRoundVideo
          )}
        </div>
        <div className='StatisticsRecentMessage__meta'>
          {t('ChannelStats.ViewsCount', { count: message.views || 0 })}
        </div>
      </div>

      <div className='StatisticsRecentMessage__info'>
        <div className='StatisticsRecentMessage__date'>
          {formatDateTimeToString(message.date * 1000)}
        </div>
        <div className='StatisticsRecentMessage__meta'>
          {message.forwards
            ? t('ChannelStats.SharesCount', { count: message.forwards })
            : 'No shares'}
        </div>
      </div>
    </div>
  );
};

function renderSummary(
  lang: LangFn,
  message: ApiMessage,
  blobUrl?: string,
  isRoundVideo?: boolean
) {
  if (!blobUrl) {
    return renderMessageSummary(lang, message);
  }

  return (
    <span className='media-preview'>
      <img
        src={blobUrl}
        alt=''
        className={classNames('media-preview__image', isRoundVideo && 'round')}
      />
      {getMessageVideo(message) && <i className='icon-play' />}
      {renderMessageSummary(lang, message, true)}
    </span>
  );
}

export default memo(StatisticsRecentMessage);
