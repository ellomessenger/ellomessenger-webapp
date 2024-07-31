import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiChat, ApiMessage, ApiUser } from '../../../api/types';

import {
  selectChat,
  selectChatMessage,
  selectSender,
  selectForwardedSender,
  selectUser,
  selectCurrentMessageList,
  selectReplyingToId,
  selectEditingId,
  selectEditingScheduledId,
  selectEditingMessage,
  selectIsChatWithSelf,
  selectIsCurrentUserPremium,
  selectTabState,
} from '../../../global/selectors';
import captureEscKeyListener from '../../../util/captureEscKeyListener';
import { isUserId, stripCustomEmoji } from '../../../global/helpers';

import useAsyncRendering from '../../right/hooks/useAsyncRendering';
import useShowTransition from '../../../hooks/useShowTransition';
import useContextMenuHandlers from '../../../hooks/useContextMenuHandlers';
import useContextMenuPosition from '../../../hooks/useContextMenuPosition';

import Button from '../../ui/Button';
import EmbeddedMessage from '../../common/EmbeddedMessage';
import MenuItem from '../../ui/MenuItem';
import Menu from '../../ui/Menu';
import MenuSeparator from '../../ui/MenuSeparator';

import './ComposerEmbeddedMessage.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';
import useLastCallback from '../../../hooks/useLastCallback';

type StateProps = {
  replyingToId?: number;
  editingId?: number;
  message?: ApiMessage;
  sender?: ApiUser | ApiChat;
  shouldAnimate?: boolean;
  forwardedMessagesCount?: number;
  noAuthors?: boolean;
  noCaptions?: boolean;
  forwardsHaveCaptions?: boolean;
  isCurrentUserPremium?: boolean;
};

type OwnProps = {
  onClear?: () => void;
  shouldForceShowEditing?: boolean;
};

const FORWARD_RENDERING_DELAY = 300;

const ComposerEmbeddedMessage: FC<OwnProps & StateProps> = ({
  replyingToId,
  editingId,
  message,
  sender,
  shouldAnimate,
  forwardedMessagesCount,
  noAuthors,
  noCaptions,
  forwardsHaveCaptions,
  shouldForceShowEditing,
  isCurrentUserPremium,
  onClear,
}) => {
  const {
    setReplyingToId,
    setEditingId,
    focusMessage,
    changeForwardRecipient,
    setForwardNoAuthors,
    setForwardNoCaptions,
    exitForwardMode,
  } = getActions();
  // eslint-disable-next-line no-null/no-null
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const isForwarding = Boolean(forwardedMessagesCount);
  const isShown = Boolean(
    ((replyingToId || editingId) && message) ||
      (sender && forwardedMessagesCount)
  );

  const canAnimate = useAsyncRendering(
    [forwardedMessagesCount],
    forwardedMessagesCount ? FORWARD_RENDERING_DELAY : undefined
  );

  const { shouldRender, transitionClassNames } = useShowTransition(
    canAnimate && isShown,
    undefined,
    !shouldAnimate,
    undefined,
    !shouldAnimate
  );

  const clearEmbedded = useCallback(() => {
    if (replyingToId && !shouldForceShowEditing) {
      setReplyingToId({ messageId: undefined });
    } else if (editingId) {
      setEditingId({ messageId: undefined });
    } else if (forwardedMessagesCount) {
      exitForwardMode();
    }
    onClear?.();
  }, [
    replyingToId,
    shouldForceShowEditing,
    editingId,
    forwardedMessagesCount,
    onClear,
    setReplyingToId,
    setEditingId,
    exitForwardMode,
  ]);

  useEffect(
    () => (isShown ? captureEscKeyListener(clearEmbedded) : undefined),
    [isShown, clearEmbedded]
  );

  const handleMessageClick = useCallback((): void => {
    if (isForwarding) return;
    focusMessage({
      chatId: message!.chatId,
      messageId: message!.id,
      noForumTopicPanel: true,
    });
  }, [focusMessage, isForwarding, message]);

  const handleClearClick = useLastCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.stopPropagation();
      clearEmbedded();
    }
  );

  const handleChangeRecipientClick = useCallback(() => {
    changeForwardRecipient();
  }, [changeForwardRecipient]);

  const {
    isContextMenuOpen,
    contextMenuPosition,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide,
  } = useContextMenuHandlers(ref);

  const getTriggerElement = useCallback(() => ref.current, []);
  const getRootElement = useCallback(() => ref.current!, []);
  const getMenuElement = useCallback(
    () => ref.current!.querySelector('.forward-context-menu .bubble'),
    []
  );

  const {
    positionX,
    positionY,
    transformOriginX,
    transformOriginY,
    style: menuStyle,
  } = useContextMenuPosition(
    contextMenuPosition,
    getTriggerElement,
    getRootElement,
    getMenuElement
  );

  const className = classNames('ComposerEmbeddedMessage', transitionClassNames);

  const isShowingReply = replyingToId && !shouldForceShowEditing;

  const leftIcon = useMemo(() => {
    if (replyingToId && !shouldForceShowEditing) {
      return 'reply';
    }
    if (editingId) {
      return 'edit';
    }
    if (isForwarding) {
      return 'forward';
    }

    return '';
  }, [editingId, isForwarding, replyingToId, shouldForceShowEditing]);

  const customText =
    forwardedMessagesCount && forwardedMessagesCount > 1
      ? t('ForwardedMessageCount', { forwardedMessagesCount })
      : undefined;

  const strippedMessage = useMemo(() => {
    if (
      !message ||
      !isForwarding ||
      !message.content.text ||
      !noAuthors ||
      isCurrentUserPremium
    )
      return message;

    const strippedText = stripCustomEmoji(message.content.text);
    return {
      ...message,
      content: {
        ...message.content,
        text: strippedText,
      },
    };
  }, [isCurrentUserPremium, isForwarding, message, noAuthors]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={className}
      ref={ref}
      onContextMenu={handleContextMenu}
      onClick={handleContextMenu}
    >
      <div>
        <div className='embedded-left-icon'>
          <i className='icon-svg'>
            <IconSvg name={leftIcon} />
          </i>
        </div>
        <EmbeddedMessage
          className='inside-input'
          message={strippedMessage}
          sender={!noAuthors ? sender : undefined}
          customText={customText}
          title={
            editingId && !isShowingReply
              ? t('EditMessage')
              : noAuthors
              ? t('HiddenSendersNameDescription')
              : undefined
          }
          onClick={handleMessageClick}
          hasContextMenu={isForwarding}
        />
        <Button
          className='embedded-cancel'
          round
          faded
          color='translucent'
          ariaLabel={String(t('Cancel'))}
          onClick={handleClearClick}
        >
          <i className='icon-svg'>
            <IconSvg name='close' />
          </i>
        </Button>
        {isForwarding && (
          <Menu
            isOpen={isContextMenuOpen}
            transformOriginX={transformOriginX}
            transformOriginY={transformOriginY}
            positionX={positionX}
            positionY={positionY}
            style={menuStyle}
            className='forward-context-menu'
            onClose={handleContextMenuClose}
            onCloseAnimationEnd={handleContextMenuHide}
          >
            <MenuItem
              icon={!noAuthors ? 'message-succeeded' : undefined}
              customIcon={
                noAuthors ? <i className='icon-placeholder' /> : undefined
              }
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() =>
                setForwardNoAuthors({
                  noAuthors: false,
                })
              }
            >
              {t(
                forwardedMessagesCount > 1
                  ? 'ShowSenderNames'
                  : 'ShowSendersName'
              )}
            </MenuItem>
            <MenuItem
              icon={noAuthors ? 'message-succeeded' : undefined}
              customIcon={
                !noAuthors ? <i className='icon-placeholder' /> : undefined
              }
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() =>
                setForwardNoAuthors({
                  noAuthors: true,
                })
              }
            >
              {t(
                forwardedMessagesCount > 1
                  ? 'HideSenderNames'
                  : 'HideSendersName'
              )}
            </MenuItem>
            {forwardsHaveCaptions && (
              <>
                <MenuSeparator />
                <MenuItem
                  icon={!noCaptions ? 'message-succeeded' : undefined}
                  customIcon={
                    noCaptions ? <i className='icon-placeholder' /> : undefined
                  }
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() =>
                    setForwardNoCaptions({
                      noCaptions: false,
                    })
                  }
                >
                  {t(
                    forwardedMessagesCount > 1
                      ? 'ForwardOptions.ShowCaption'
                      : 'ShowCaption'
                  )}
                </MenuItem>
                <MenuItem
                  icon={noCaptions ? 'message-succeeded' : undefined}
                  customIcon={
                    !noCaptions ? <i className='icon-placeholder' /> : undefined
                  }
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() =>
                    setForwardNoCaptions({
                      noCaptions: true,
                    })
                  }
                >
                  {t(
                    forwardedMessagesCount > 1
                      ? 'ForwardOptions.HideCaption'
                      : 'HideCaption'
                  )}
                </MenuItem>
              </>
            )}
            <MenuSeparator />
            <MenuItem icon='replace' onClick={handleChangeRecipientClick}>
              {t('ChangeRecipient')}
            </MenuItem>
          </Menu>
        )}
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { shouldForceShowEditing }): StateProps => {
    const {
      chatId,
      threadId,
      type: messageListType,
    } = selectCurrentMessageList(global) || {};
    if (!chatId || !threadId || !messageListType) {
      return {};
    }

    const {
      forwardMessages: {
        fromChatId,
        toChatId,
        messageIds: forwardMessageIds,
        noAuthors,
        noCaptions,
      },
    } = selectTabState(global);

    const replyingToId = selectReplyingToId(global, chatId, threadId);
    const editingId =
      messageListType === 'scheduled'
        ? selectEditingScheduledId(global, chatId)
        : selectEditingId(global, chatId, threadId);
    const shouldAnimate = global.settings.byKey.animationLevel >= 1;
    const isForwarding = toChatId === chatId;
    const forwardedMessages = forwardMessageIds?.map(
      (id) => selectChatMessage(global, fromChatId!, id)!
    );

    let message: ApiMessage | undefined;
    if (replyingToId && !shouldForceShowEditing) {
      message = selectChatMessage(global, chatId, replyingToId);
    } else if (editingId) {
      message = selectEditingMessage(global, chatId, threadId, messageListType);
    } else if (isForwarding && forwardMessageIds!.length === 1) {
      message = forwardedMessages?.[0];
    }

    let sender: ApiChat | ApiUser | undefined;
    if (replyingToId && message && !shouldForceShowEditing) {
      const { forwardInfo } = message;
      const isChatWithSelf = selectIsChatWithSelf(global, chatId);
      if (forwardInfo && (forwardInfo.isChannelPost || isChatWithSelf)) {
        sender = selectForwardedSender(global, message);
      }

      if (!sender && !forwardInfo?.hiddenUserName) {
        sender = selectSender(global, message);
      }
    } else if (isForwarding) {
      if (message) {
        sender = selectForwardedSender(global, message);
        if (!sender) {
          sender = selectSender(global, message);
        }
      }
      if (!sender) {
        sender = isUserId(fromChatId!)
          ? selectUser(global, fromChatId!)
          : selectChat(global, fromChatId!);
      }
    }

    const forwardsHaveCaptions = forwardedMessages?.some(
      (forward) =>
        forward?.content.text && Object.keys(forward.content).length > 1
    );

    return {
      replyingToId,
      editingId,
      message,
      sender,
      shouldAnimate,
      forwardedMessagesCount: isForwarding
        ? forwardMessageIds!.length
        : undefined,
      noAuthors,
      noCaptions,
      forwardsHaveCaptions,
      isCurrentUserPremium: selectIsCurrentUserPremium(global),
    };
  })(ComposerEmbeddedMessage)
);
