import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { getActions } from '../../../global';

import type {
  ApiAvailableReaction,
  ApiChatReactions,
  ApiMessage,
  ApiReaction,
  ApiSponsoredMessage,
  ApiStickerSet,
  ApiThreadInfo,
  ApiUser,
} from '../../../api/types';
import type { IAnchorPosition } from '../../../types';

import { getMessageCopyOptions } from './helpers/copyOptions';
import { disableScrolling, enableScrolling } from '../../../util/scrollLock';
import { getUserFullName, isMessageLink } from '../../../global/helpers';
import renderText from '../../common/helpers/renderText';

import useFlag from '../../../hooks/useFlag';
import useContextMenuPosition from '../../../hooks/useContextMenuPosition';
import useAppLayout from '../../../hooks/useAppLayout';

import Menu from '../../ui/Menu';
import MenuItem from '../../ui/MenuItem';
import Skeleton from '../../ui/Skeleton';
import Avatar from '../../common/Avatar';
import ReactionSelector from './ReactionSelector';

import './MessageContextMenu.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';

type OwnProps = {
  availableReactions?: ApiAvailableReaction[];
  topReactions?: ApiReaction[];
  isOpen: boolean;
  anchor: IAnchorPosition;
  message: ApiMessage | ApiSponsoredMessage;
  canSendNow?: boolean;
  enabledReactions?: ApiChatReactions;
  maxUniqueReactions?: number;
  canReschedule?: boolean;
  canReply?: boolean;
  repliesThreadInfo?: ApiThreadInfo;
  canPin?: boolean;
  canUnpin?: boolean;
  canDelete?: boolean;
  canReport?: boolean;
  canShowReactionsCount?: boolean;
  canShowReactionList?: boolean;
  canBuyPremium?: boolean;
  canEdit?: boolean;
  canForward?: boolean;
  canFaveSticker?: boolean;
  canUnfaveSticker?: boolean;
  canCopy?: boolean;
  canCopyLink?: boolean;
  canSelect?: boolean;
  canTranslate?: boolean;
  canShowOriginal?: boolean;
  canSelectLanguage?: boolean;
  isPrivate?: boolean;
  isCurrentUserPremium?: boolean;
  canDownload?: boolean;
  canSaveGif?: boolean;
  canRevote?: boolean;
  canClosePoll?: boolean;
  isDownloading?: boolean;
  canShowSeenBy?: boolean;
  noReplies?: boolean;
  hasCustomEmoji?: boolean;
  customEmojiSets?: ApiStickerSet[];
  isCreator?: boolean;
  isAdmin?: boolean;
  effectReactin?: ApiReaction | undefined;
  onReply?: () => void;
  onOpenThread?: VoidFunction;
  onEdit?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  onFaveSticker?: () => void;
  onUnfaveSticker?: () => void;
  onSelect?: () => void;
  onSend?: () => void;
  onReschedule?: () => void;
  onClose: () => void;
  onCloseAnimationEnd?: () => void;
  onCopyLink?: () => void;
  onCopyMessages?: (messageIds: number[]) => void;
  onCopyNumber?: () => void;
  onDownload?: () => void;
  onSaveGif?: () => void;
  onCancelVote?: () => void;
  onClosePoll?: () => void;
  onShowSeenBy?: () => void;
  onShowReactors?: () => void;
  onAboutAds?: () => void;
  onSponsoredHide?: () => void;
  onTranslate?: () => void;
  onShowOriginal?: () => void;
  onSelectLanguage?: () => void;
  onToggleReaction?: (reaction: ApiReaction) => void;
};

const SCROLLBAR_WIDTH = 10;
const REACTION_BUBBLE_EXTRA_WIDTH = 32;
const ANIMATION_DURATION = 200;

const MessageContextMenu: FC<OwnProps> = ({
  availableReactions,
  topReactions,
  isOpen,
  message,
  isPrivate,
  enabledReactions,
  maxUniqueReactions,
  anchor,
  canSendNow,
  canReschedule,
  canReply,
  canEdit,
  noReplies,
  canPin,
  canUnpin,
  canDelete,
  canReport,
  canForward,
  canFaveSticker,
  canUnfaveSticker,
  canCopy,
  canCopyLink,
  canSelect,
  canDownload,
  canSaveGif,
  canRevote,
  canClosePoll,
  canTranslate,
  canShowOriginal,
  canSelectLanguage,
  isDownloading,
  repliesThreadInfo,
  canShowSeenBy,
  canShowReactionsCount,
  canShowReactionList,
  hasCustomEmoji,
  customEmojiSets,
  isCreator,
  isAdmin,
  canBuyPremium,
  isCurrentUserPremium,
  effectReactin,
  onReply,
  onOpenThread,
  onEdit,
  onPin,
  onUnpin,
  onForward,
  onDelete,
  onReport,
  onFaveSticker,
  onUnfaveSticker,
  onSelect,
  onSend,
  onReschedule,
  onClose,
  onCloseAnimationEnd,
  onCopyLink,
  onCopyNumber,
  onDownload,
  onSaveGif,
  onCancelVote,
  onClosePoll,
  onShowSeenBy,
  onShowReactors,
  onToggleReaction,
  onCopyMessages,
  onAboutAds,
  onSponsoredHide,
  onTranslate,
  onShowOriginal,
  onSelectLanguage,
}) => {
  const { showNotification, openStickerSet, openCustomEmojiSets } =
    getActions();
  // eslint-disable-next-line no-null/no-null
  const menuRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-null/no-null
  const scrollableRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const noReactions = !isPrivate && !enabledReactions;
  const withReactions = canShowReactionList && !noReactions;
  const isSponsoredMessage = !('id' in message);
  const messageId = !isSponsoredMessage ? message.id : '';

  const [isReady, markIsReady, unmarkIsReady] = useFlag();
  const { isMobile } = useAppLayout();

  const isLink = !isSponsoredMessage && isMessageLink(message);
  const handleAfterCopy = useCallback(() => {
    showNotification({
      message: t(`Copy.${isLink ? 'Link' : 'Message'}`),
    });
    onClose();
  }, [onClose, showNotification]);

  const handleOpenCustomEmojiSets = useCallback(() => {
    if (!customEmojiSets) return;
    if (customEmojiSets.length === 1) {
      openStickerSet({
        stickerSetInfo: {
          shortName: customEmojiSets[0].shortName,
        },
      });
    } else {
      openCustomEmojiSets({
        setIds: customEmojiSets.map((set) => set.id),
      });
    }
    onClose();
  }, [customEmojiSets, onClose, openCustomEmojiSets, openStickerSet]);

  const copyOptions = isSponsoredMessage
    ? []
    : getMessageCopyOptions(
        message,
        handleAfterCopy,
        canCopyLink ? onCopyLink : undefined,
        onCopyMessages,
        onCopyNumber
      );

  const getTriggerElement = useCallback(() => {
    return isSponsoredMessage
      ? document.querySelector(
          '.Transition__slide--active > .MessageList .SponsoredMessage'
        )
      : document.querySelector(
          `.Transition__slide--active > .MessageList div[data-message-id="${messageId}"]`
        );
  }, [isSponsoredMessage, messageId]);

  const getRootElement = useCallback(
    () => document.querySelector('.Transition__slide--active > .MessageList'),
    []
  );

  const getMenuElement = useCallback(
    () => document.querySelector('.MessageContextMenu .bubble'),
    []
  );

  const getLayout = useCallback(() => {
    const extraHeightAudioPlayer =
      (isMobile &&
        document.querySelector<HTMLElement>('.AudioPlayer-content')
          ?.offsetHeight) ||
      0;
    const pinnedElement = document.querySelector<HTMLElement>(
      '.HeaderPinnedMessageWrapper'
    );
    const extraHeightPinned =
      (((isMobile && !extraHeightAudioPlayer) ||
        (!isMobile && pinnedElement?.classList.contains('full-width'))) &&
        pinnedElement?.offsetHeight) ||
      0;

    return {
      extraPaddingX: SCROLLBAR_WIDTH,
      extraTopPadding:
        document.querySelector<HTMLElement>('.MiddleHeader')!.offsetHeight,
      marginSides: withReactions ? REACTION_BUBBLE_EXTRA_WIDTH : undefined,
      extraMarginTop: extraHeightPinned + extraHeightAudioPlayer,
      withFooter: !canForward && !isCreator && !isAdmin && !isPrivate,
    };
  }, [isMobile, withReactions, canForward, isCreator, isAdmin, isPrivate]);

  useEffect(() => {
    if (!isOpen) {
      unmarkIsReady();
      return;
    }

    setTimeout(() => {
      markIsReady();
    }, ANIMATION_DURATION);
  }, [isOpen, markIsReady, unmarkIsReady]);

  const {
    positionX,
    positionY,
    transformOriginX,
    transformOriginY,
    style,
    menuStyle,
    withScroll,
  } = useContextMenuPosition(
    anchor,
    getTriggerElement,
    getRootElement,
    getMenuElement,
    getLayout
  );

  useEffect(() => {
    disableScrolling(
      withScroll ? scrollableRef.current : undefined,
      '.ReactionSelector'
    );

    return enableScrolling;
  }, [withScroll]);

  return (
    <Menu
      elRef={menuRef}
      isOpen={isOpen}
      transformOriginX={transformOriginX}
      transformOriginY={transformOriginY}
      positionX={positionX}
      positionY={positionY}
      style={style}
      footer={
        !canForward && !isCreator && !isAdmin && !isPrivate
          ? 'Copying and forwarding is not allowed in this channel.'
          : ''
      }
      bubbleStyle={menuStyle}
      className={classNames('MessageContextMenu', 'fluid', {
        'with-reactions': withReactions,
      })}
      onClose={onClose}
      onCloseAnimationEnd={onCloseAnimationEnd}
    >
      {withReactions && enabledReactions?.allowed?.length ? (
        <ReactionSelector
          enabledReactions={enabledReactions}
          topReactions={topReactions}
          currentReactions={
            !isSponsoredMessage ? message.reactions?.results : undefined
          }
          maxUniqueReactions={maxUniqueReactions}
          onToggleReaction={onToggleReaction!}
          isPrivate={isPrivate}
          availableReactions={availableReactions}
          allAvailableReactions={availableReactions}
          isReady={isReady}
          canBuyPremium={canBuyPremium}
          isCurrentUserPremium={isCurrentUserPremium}
        />
      ) : null}

      <div
        className='scrollable-content custom-scroll'
        style={menuStyle}
        ref={scrollableRef}
      >
        {canSendNow && (
          <MenuItem icon='send-outline' onClick={onSend}>
            {t('MessageScheduleSend')}
          </MenuItem>
        )}
        {canReschedule && (
          <MenuItem icon='schedule' onClick={onReschedule}>
            {t('MessageScheduleEditTime')}
          </MenuItem>
        )}
        {canReply && (
          <MenuItem customIcon={<IconSvg name='reply' />} onClick={onReply}>
            {t('Reply')}
          </MenuItem>
        )}
        {!noReplies && Boolean(repliesThreadInfo?.messagesCount) && (
          <MenuItem icon='replies' onClick={onOpenThread}>
            {t('ContextViewReplies', {
              message: repliesThreadInfo!.messagesCount,
            })}
          </MenuItem>
        )}
        {canEdit && (
          <MenuItem customIcon={<IconSvg name='edit' />} onClick={onEdit}>
            {t('Edit')}
          </MenuItem>
        )}
        {canFaveSticker && (
          <MenuItem icon='favorite' onClick={onFaveSticker}>
            {t('AddToFavorites')}
          </MenuItem>
        )}
        {canUnfaveSticker && (
          <MenuItem icon='favorite' onClick={onUnfaveSticker}>
            {t('Stickers.RemoveFromFavorites')}
          </MenuItem>
        )}
        {canTranslate && (
          <MenuItem icon='language' onClick={onTranslate}>
            {t('TranslateMessage')}
          </MenuItem>
        )}
        {canShowOriginal && (
          <MenuItem icon='language' onClick={onShowOriginal}>
            {t('ShowOriginalButton')}
          </MenuItem>
        )}
        {canSelectLanguage && (
          <MenuItem icon='web' onClick={onSelectLanguage}>
            {t('lng_settings_change_lang')}
          </MenuItem>
        )}
        {canCopy &&
          copyOptions.map((option) => (
            <MenuItem
              key={option.label}
              customIcon={<IconSvg name={option.icon} />}
              onClick={option.handler}
            >
              {t(option.label)}
            </MenuItem>
          ))}
        {/* {canPin && (
          <MenuItem customIcon={<IconSvg name='pin' />} onClick={onPin}>
            {t('Pin')}
          </MenuItem>
        )}
        {canUnpin && (
          <MenuItem customIcon={<IconSvg name='unpin' />} onClick={onUnpin}>
            {t('Unpin')}
          </MenuItem>
        )} */}
        {canSaveGif && (
          <MenuItem icon='gifs' onClick={onSaveGif}>
            {t('lng_context_save_gif')}
          </MenuItem>
        )}
        {canRevote && (
          <MenuItem icon='revote' onClick={onCancelVote}>
            {t('lng_polls_retract')}
          </MenuItem>
        )}
        {canClosePoll && (
          <MenuItem icon='stop' onClick={onClosePoll}>
            {t('lng_polls_stop')}
          </MenuItem>
        )}
        {canDownload && (
          <MenuItem
            customIcon={<IconSvg name='download' />}
            onClick={onDownload}
          >
            {isDownloading
              ? t('lng_context_cancel_download')
              : t('Media_download')}
          </MenuItem>
        )}
        {canForward && (
          <MenuItem customIcon={<IconSvg name='forward' />} onClick={onForward}>
            {t('Forward')}
          </MenuItem>
        )}
        {canSelect && (
          <MenuItem customIcon={<IconSvg name='select' />} onClick={onSelect}>
            {t('Select')}
          </MenuItem>
        )}
        {canReport && (
          <MenuItem customIcon={<IconSvg name='error' />} onClick={onReport}>
            {t('ReportPeer.Report')}
          </MenuItem>
        )}

        {canDelete && (
          <MenuItem customIcon={<IconSvg name='delete' />} onClick={onDelete}>
            {t('Delete')}
          </MenuItem>
        )}
        {hasCustomEmoji && (
          <>
            {!customEmojiSets && (
              <>
                <Skeleton inline className='menu-loading-row' />
                <Skeleton inline className='menu-loading-row' />
              </>
            )}
            {customEmojiSets && customEmojiSets.length === 1 && (
              <MenuItem
                withWrap
                onClick={handleOpenCustomEmojiSets}
                className='menu-custom-emoji-sets'
              >
                {renderText(
                  String(
                    t('MessageContainsEmojiPack', {
                      title: customEmojiSets[0].title,
                    })
                  ),
                  ['simple_markdown', 'emoji']
                )}
              </MenuItem>
            )}
            {customEmojiSets && customEmojiSets.length > 1 && (
              <MenuItem
                withWrap
                onClick={handleOpenCustomEmojiSets}
                className='menu-custom-emoji-sets'
              >
                {renderText(
                  String(
                    t('MessageContainsEmojiPacks', {
                      count: customEmojiSets.length,
                    })
                  ),
                  ['simple_markdown']
                )}
              </MenuItem>
            )}
          </>
        )}
        {isSponsoredMessage && (
          <MenuItem icon='help' onClick={onAboutAds}>
            {t('SponsoredMessageInfo')}
          </MenuItem>
        )}
        {isSponsoredMessage && onSponsoredHide && (
          <MenuItem icon='stop' onClick={onSponsoredHide}>
            {t('HideAd')}
          </MenuItem>
        )}
      </div>
    </Menu>
  );
};

export default memo(MessageContextMenu);
