import React, { FC, useRef } from 'react';

import type { ApiUser, ApiMessage, ApiChat } from '../../api/types';

import {
  getMessageMediaHash,
  isActionMessage,
  getSenderTitle,
  getMessageRoundVideo,
  getUserColorKey,
  getMessageIsSpoiler,
} from '../../global/helpers';
import renderText from './helpers/renderText';
import { getPictogramDimensions } from './helpers/mediaDimensions';

import type { ObserveFn } from '../../hooks/useIntersectionObserver';
import { useIsIntersecting } from '../../hooks/useIntersectionObserver';
import useMedia from '../../hooks/useMedia';
import useThumbnail from '../../hooks/useThumbnail';

import ActionMessage from '../middle/ActionMessage';
import MessageSummary from './MessageSummary';
import MediaSpoiler from './MediaSpoiler';

import './EmbeddedMessage.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  className?: string;
  message?: ApiMessage;
  sender?: ApiUser | ApiChat;
  title?: string;
  customText?: string;
  noUserColors?: boolean;
  isProtected?: boolean;
  hasContextMenu?: boolean;
  observeIntersectionForLoading?: ObserveFn;
  observeIntersectionForPlaying?: ObserveFn;
  onClick: NoneToVoidFunction;
};

const NBSP = '\u00A0';

const EmbeddedMessage: FC<OwnProps> = ({
  className,
  message,
  sender,
  title,
  customText,
  isProtected,
  noUserColors,
  hasContextMenu,
  observeIntersectionForLoading,
  observeIntersectionForPlaying,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isIntersecting = useIsIntersecting(ref, observeIntersectionForLoading);

  const mediaBlobUrl = useMedia(
    message && getMessageMediaHash(message, 'pictogram'),
    !isIntersecting
  );
  const mediaThumbnail = useThumbnail(message);
  const isRoundVideo = Boolean(message && getMessageRoundVideo(message));
  const isSpoiler = Boolean(message && getMessageIsSpoiler(message));

  const { t } = useTranslation();

  const senderTitle = sender
    ? getSenderTitle(t, sender)
    : message?.forwardInfo?.hiddenUserName;

  function renderSender() {
    if (title) {
      return renderText(title);
    } else if (senderTitle) {
      return senderTitle;
    }

    return NBSP;
  }

  return (
    <div
      ref={ref}
      className={classNames(
        'EmbeddedMessage',
        className,
        sender && !noUserColors && `color-${getUserColorKey(sender)}`
      )}
      onClick={message ? onClick : undefined}
    >
      {mediaThumbnail &&
        renderPictogram(
          mediaThumbnail,
          mediaBlobUrl,
          isRoundVideo,
          isProtected,
          isSpoiler
        )}
      <div className='message-text'>
        <p dir='auto'>
          {!message ? (
            customText || NBSP
          ) : isActionMessage(message) ? (
            <ActionMessage
              message={message}
              isEmbedded
              observeIntersectionForLoading={observeIntersectionForLoading}
              observeIntersectionForPlaying={observeIntersectionForPlaying}
            />
          ) : (
            <MessageSummary
              lang={t}
              message={message}
              noEmoji={Boolean(mediaThumbnail)}
              observeIntersectionForLoading={observeIntersectionForLoading}
              observeIntersectionForPlaying={observeIntersectionForPlaying}
            />
          )}
        </p>
        <div className='message-title'>{renderSender()}</div>
      </div>
      {hasContextMenu && <i className='embedded-more icon-more' />}
    </div>
  );
};

function renderPictogram(
  thumbDataUri: string,
  blobUrl?: string,
  isRoundVideo?: boolean,
  isProtected?: boolean,
  isSpoiler?: boolean
) {
  const { width, height } = getPictogramDimensions();

  const srcUrl = blobUrl || thumbDataUri;

  return (
    <div className={classNames('embedded-thumb', { round: isRoundVideo })}>
      {!isSpoiler && (
        <img
          src={srcUrl}
          width={width}
          height={height}
          alt=''
          className='pictogram'
          draggable={false}
        />
      )}
      <MediaSpoiler
        thumbDataUri={srcUrl}
        isVisible={Boolean(isSpoiler)}
        width={width}
        height={height}
      />
      {isProtected && <span className='protector' />}
    </div>
  );
}

export default EmbeddedMessage;
