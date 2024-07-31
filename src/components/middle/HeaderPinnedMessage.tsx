import React, { FC, memo, useCallback } from 'react';
import { getActions } from '../../global';

import type { ApiMessage } from '../../api/types';

import { getPictogramDimensions } from '../common/helpers/mediaDimensions';
import {
  getMessageIsSpoiler,
  getMessageMediaHash,
  getMessageSingleInlineButton,
} from '../../global/helpers';
import { IS_TOUCH_ENV } from '../../util/windowEnvironment';
import renderText from '../common/helpers/renderText';

import useMedia from '../../hooks/useMedia';
import useThumbnail from '../../hooks/useThumbnail';
import useFlag from '../../hooks/useFlag';
import useAsyncRendering from '../right/hooks/useAsyncRendering';

import RippleEffect from '../ui/RippleEffect';
import ConfirmDialog from '../ui/ConfirmDialog';
import Button from '../ui/Button';
import PinnedMessageNavigation from './PinnedMessageNavigation';
import MessageSummary from '../common/MessageSummary';
import MediaSpoiler from '../common/MediaSpoiler';
import AnimatedCounter from '../common/AnimatedCounter';
import Transition from '../ui/Transition';
import Spinner from '../ui/Spinner';

import styles from './HeaderPinnedMessage.module.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../ui/IconSvg';

const SHOW_LOADER_DELAY = 450;
type OwnProps = {
  message: ApiMessage;
  index: number;
  count: number;
  customTitle?: string;
  className?: string;
  onUnpinMessage?: (id: number) => void;
  onClick?: () => void;
  onAllPinnedClick?: () => void;
  isLoading?: boolean;
  isFullWidth?: boolean;
};

const HeaderPinnedMessage: FC<OwnProps> = ({
  message,
  count,
  index,
  customTitle,
  className,
  onUnpinMessage,
  onClick,
  onAllPinnedClick,
  isLoading,
  isFullWidth,
}) => {
  const { clickBotInlineButton } = getActions();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const mediaThumbnail = useThumbnail(message);
  const mediaBlobUrl = useMedia(getMessageMediaHash(message, 'pictogram'));
  const isSpoiler = getMessageIsSpoiler(message);
  const canRenderLoader = useAsyncRendering([isLoading], SHOW_LOADER_DELAY);
  const shouldShowLoader = canRenderLoader && isLoading;

  const [isUnpinDialogOpen, openUnpinDialog, closeUnpinDialog] = useFlag();

  const handleUnpinMessage = useCallback(() => {
    closeUnpinDialog();

    if (onUnpinMessage) {
      onUnpinMessage(message.id);
    }
  }, [closeUnpinDialog, onUnpinMessage, message.id]);

  const inlineButton = getMessageSingleInlineButton(message);

  const handleInlineButtonClick = useCallback(() => {
    if (inlineButton) {
      clickBotInlineButton({ messageId: message.id, button: inlineButton });
    }
  }, [clickBotInlineButton, inlineButton, message.id]);

  const [noHoverColor, markNoHoverColor, unmarkNoHoverColor] = useFlag();

  function renderPictogram(
    thumbDataUri?: string,
    blobUrl?: string,
    spoiler?: boolean
  ) {
    const { width, height } = getPictogramDimensions();
    const srcUrl = blobUrl || thumbDataUri;

    return (
      <div className={styles.pinnedThumb}>
        {thumbDataUri && !spoiler && (
          <img
            className={styles.pinnedThumbImage}
            src={srcUrl}
            width={width}
            height={height}
            alt=''
          />
        )}
        {thumbDataUri && (
          <MediaSpoiler
            thumbDataUri={srcUrl}
            isVisible={Boolean(spoiler)}
            width={width}
            height={height}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={classNames(
        'HeaderPinnedMessageWrapper',
        styles.root,
        className,
        { 'full-width': isFullWidth }
      )}
    >
      {(count > 1 || shouldShowLoader) && (
        <Button
          round
          color='translucent'
          ariaLabel={String(t('EventLogFilterPinnedMessages'))}
          onClick={!shouldShowLoader ? onAllPinnedClick : undefined}
        >
          <Spinner
            color='blue'
            className={classNames(
              styles.loading,
              styles.pinListIcon,
              !shouldShowLoader && styles.pinListIconHidden
            )}
          />
          <i
            className={classNames(
              'icon-svg',
              styles.pinListIcon,
              shouldShowLoader && styles.pinListIconHidden
            )}
          >
            <IconSvg name='pin-list' />
          </i>
        </Button>
      )}
      {onUnpinMessage && (
        <Button
          round
          color='translucent'
          ariaLabel={String(t('UnpinMessageAlertTitle'))}
          onClick={openUnpinDialog}
        >
          <i className='icon-svg'>
            <IconSvg name='close' />
          </i>
        </Button>
      )}
      <ConfirmDialog
        isOpen={isUnpinDialogOpen}
        onClose={closeUnpinDialog}
        text='Would you like to unpin this message?'
        confirmLabel='Unpin'
        confirmHandler={handleUnpinMessage}
      />
      <div
        className={classNames(
          styles.pinnedMessage,
          noHoverColor && styles.noHover
        )}
        onClick={onClick}
        dir={isRtl ? 'rtl' : undefined}
      >
        <PinnedMessageNavigation count={count} index={index} />
        <Transition
          activeKey={message.id}
          name='slide-vertical'
          className={styles.pictogramTransition}
        >
          {renderPictogram(mediaThumbnail, mediaBlobUrl, isSpoiler)}
        </Transition>
        <div
          className={classNames(
            styles.messageText,
            mediaThumbnail && styles.withMedia
          )}
        >
          <div className={styles.title} dir='auto'>
            {!customTitle && (
              <AnimatedCounter
                text={`${t('PinnedMessage')} ${
                  index > 0 ? `#${count - index}` : ''
                }`}
              />
            )}

            {customTitle && renderText(customTitle)}
          </div>
          <Transition
            activeKey={message.id}
            name='slide-vertical-fade'
            className={styles.messageTextTransition}
          >
            <p dir='auto' className={styles.summary}>
              <MessageSummary
                lang={t}
                message={message}
                noEmoji={Boolean(mediaThumbnail)}
              />
            </p>
          </Transition>
        </div>
        <RippleEffect />
        {inlineButton && (
          <Button
            size='tiny'
            className={styles.inlineButton}
            onClick={handleInlineButtonClick}
            shouldStopPropagation
            onMouseEnter={!IS_TOUCH_ENV ? markNoHoverColor : undefined}
            onMouseLeave={!IS_TOUCH_ENV ? unmarkNoHoverColor : undefined}
          >
            {inlineButton.text}
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(HeaderPinnedMessage);
