import React, { FC, memo, useCallback } from 'react';

import type { ApiMessage, ApiWebPage } from '../../api/types';
import type { TextPart } from '../../types';
import type { ObserveFn } from '../../hooks/useIntersectionObserver';

import {
  getFirstLinkInMessage,
  getMessageText,
  getMessageWebPage,
} from '../../global/helpers';
import trimText from '../../util/trimText';
import renderText from './helpers/renderText';
import { formatPastTimeShort } from '../../util/dateFormat';
import { renderMessageSummary } from './helpers/renderMessageText';

import Media from './Media';
import Link from '../ui/Link';
import SafeLink from './SafeLink';

import './WebLink.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

const MAX_TEXT_LENGTH = 170; // symbols

type OwnProps = {
  message: ApiMessage;
  senderTitle?: string;
  isProtected?: boolean;
  observeIntersection?: ObserveFn;
  onMessageClick: (messageId: number, chatId: string) => void;
};

type ApiWebPageWithFormatted = ApiWebPage & {
  formattedDescription?: TextPart[];
};

const WebLink: FC<OwnProps> = ({
  message,
  senderTitle,
  isProtected,
  observeIntersection,
  onMessageClick,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  let linkData: ApiWebPageWithFormatted | undefined =
    getMessageWebPage(message);

  if (!linkData) {
    const link = getFirstLinkInMessage(message);
    if (link) {
      const { url, domain } = link;

      linkData = {
        siteName: domain.replace(/^www./, ''),
        url: url.includes('://')
          ? url
          : url.includes('@')
          ? `mailto:${url}`
          : `http://${url}`,
        formattedDescription:
          getMessageText(message) !== url
            ? renderMessageSummary(
                t,
                message,
                undefined,
                undefined,
                MAX_TEXT_LENGTH
              )
            : undefined,
      } as ApiWebPageWithFormatted;
    }
  }

  const handleMessageClick = useCallback(() => {
    onMessageClick(message.id, message.chatId);
  }, [onMessageClick, message.id, message.chatId]);

  if (!linkData) {
    return null;
  }

  const {
    siteName,
    url,
    displayUrl,
    title,
    description,
    formattedDescription,
    photo,
    video,
  } = linkData;

  const truncatedDescription =
    !senderTitle && description && trimText(description, MAX_TEXT_LENGTH);

  const className = classNames(
    'WebLink scroll-item',
    !photo && !video && 'without-media'
  );

  const safeLinkContent = url.replace('mailto:', '') || displayUrl;

  return (
    <div
      className={className}
      data-initial={(siteName || displayUrl)[0]}
      dir={isRtl ? 'rtl' : undefined}
    >
      {photo && (
        <Media
          message={message}
          isProtected={isProtected}
          observeIntersection={observeIntersection}
        />
      )}
      <div className='content'>
        <Link isRtl={isRtl} className='site-title' onClick={handleMessageClick}>
          {renderText(title || siteName || displayUrl)}
        </Link>
        {(truncatedDescription || formattedDescription) && (
          <Link
            isRtl={isRtl}
            className='site-description'
            onClick={handleMessageClick}
          >
            {formattedDescription ||
              (truncatedDescription && renderText(truncatedDescription))}
          </Link>
        )}
        <SafeLink
          url={url}
          className='site-name'
          text={safeLinkContent}
          isRtl={isRtl}
        />
        {senderTitle && (
          <div className='sender-name'>{renderText(senderTitle)}</div>
        )}
      </div>
      {senderTitle && (
        <div className='message-date'>
          <Link className='date' onClick={handleMessageClick} isRtl={isRtl}>
            {formatPastTimeShort(t, message.date * 1000)}
          </Link>
        </div>
      )}
    </div>
  );
};

export default memo(WebLink);
