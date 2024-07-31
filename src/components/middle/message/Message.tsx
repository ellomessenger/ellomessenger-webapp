import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getActions, withGlobal } from '../../../global';

import {
  AiState,
  type ActiveEmojiInteraction,
  type ActiveReaction,
  type ChatTranslatedMessages,
  type IAiPurchases,
  type MessageListType,
} from '../../../global/types';
import type {
  ApiMessage,
  ApiMessageOutgoingStatus,
  ApiUser,
  ApiChat,
  ApiThreadInfo,
  ApiAvailableReaction,
  ApiChatMember,
  ApiUsername,
  ApiTopic,
  ApiReaction,
  ApiStickerSet,
  ApiKeyboardButton,
} from '../../../api/types';
import type {
  AnimationLevel,
  FocusDirection,
  IAlbum,
  ISettings,
  ThreadId,
} from '../../../types';
import type { ObserveFn } from '../../../hooks/useIntersectionObserver';
import type { PinnedIntersectionChangedCallback } from '../hooks/usePinnedMessage';
import { AudioOrigin } from '../../../types';
import { MAIN_THREAD_ID } from '../../../api/types';

import { IS_ANDROID, IS_TOUCH_ENV } from '../../../util/windowEnvironment';
import {
  AI_BOT_ID,
  EMOJI_STATUS_LOOP_LIMIT,
  GENERAL_TOPIC_ID,
} from '../../../config';
import {
  selectChat,
  selectChatMessage,
  selectUploadProgress,
  selectIsChatWithSelf,
  selectOutgoingStatus,
  selectUser,
  selectIsMessageFocused,
  selectCurrentTextSearch,
  selectIsInSelectMode,
  selectIsMessageSelected,
  selectIsDocumentGroupSelected,
  selectSender,
  selectForwardedSender,
  selectThreadTopMessageId,
  selectCanAutoLoadMedia,
  selectCanAutoPlayMedia,
  selectShouldLoopStickers,
  selectTheme,
  selectAllowedMessageActions,
  selectIsDownloading,
  selectThreadInfo,
  selectMessageIdsByGroupId,
  selectIsMessageProtected,
  selectDefaultReaction,
  selectReplySender,
  selectAnimatedEmoji,
  selectIsCurrentUserPremium,
  selectIsChatProtected,
  selectTopicFromMessage,
  selectTabState,
  selectChatTranslations,
  selectRequestedTranslationLanguage,
  selectCurrentMessageIds,
} from '../../../global/selectors';
import {
  getMessageContent,
  isOwnMessage,
  isAnonymousOwnMessage,
  isMessageLocal,
  isUserId,
  isChatWithRepliesBot,
  getMessageCustomShape,
  isChatChannel,
  getMessageSingleRegularEmoji,
  getSenderTitle,
  getUserColorKey,
  areReactionsEmpty,
  getMessageHtmlId,
  isGeoLiveExpired,
  getMessageSingleCustomEmoji,
  hasMessageText,
  isChatGroup,
  getMessageLocation,
  isReplyMessage,
  isForwardedMessage,
  isBotSpace,
} from '../../../global/helpers';

import {
  calculateDimensionsForMessageMedia,
  REM,
  ROUND_VIDEO_DIMENSIONS_PX,
} from '../../common/helpers/mediaDimensions';
import { buildContentClassName } from './helpers/buildContentClassName';
import {
  getMinMediaWidth,
  calculateMediaDimensions,
  MIN_MEDIA_WIDTH_WITH_COMMENTS,
  MIN_MEDIA_WIDTH_WITH_TEXT,
} from './helpers/mediaDimensions';
import { calculateAlbumLayout } from './helpers/calculateAlbumLayout';
import renderText from '../../common/helpers/renderText';
import calculateAuthorWidth from './helpers/calculateAuthorWidth';
import { getServerTime } from '../../../util/serverTime';
import { isElementInViewport } from '../../../util/isElementInViewport';
import { getCustomEmojiSize } from '../composer/helpers/customEmoji';
import { isAnimatingScroll } from '../../../util/fastSmoothScroll';

import useEnsureMessage from '../../../hooks/useEnsureMessage';
import useContextMenuHandlers from '../../../hooks/useContextMenuHandlers';
import { useOnIntersect } from '../../../hooks/useIntersectionObserver';

import useShowTransition from '../../../hooks/useShowTransition';
import useFlag from '../../../hooks/useFlag';
import useFocusMessage from './hooks/useFocusMessage';
import useOuterHandlers from './hooks/useOuterHandlers';
import useInnerHandlers from './hooks/useInnerHandlers';
import useAppLayout from '../../../hooks/useAppLayout';
import useResizeObserver from '../../../hooks/useResizeObserver';
import useThrottledCallback from '../../../hooks/useThrottledCallback';
import useMessageTranslation from './hooks/useMessageTranslation';
import usePrevious from '../../../hooks/usePrevious';
import useTextLanguage from '../../../hooks/useTextLanguage';

import Button from '../../ui/Button';
import Avatar from '../../common/Avatar';
import EmbeddedMessage from '../../common/EmbeddedMessage';
import Document from '../../common/Document';
import Audio from '../../common/Audio';
import MessageMeta from './MessageMeta';
import ContextMenuContainer from './ContextMenuContainer.async';
import Sticker from './Sticker';
import AnimatedCustomEmoji from './AnimatedCustomEmoji';
import Photo from './Photo';
import Video from './Video';
import InlineButtons from './InlineButtons';
import CommentButton from './CommentButton';
import Reactions from './Reactions';
import ReactionStaticEmoji from '../../common/ReactionStaticEmoji';
import DotAnimation from '../../common/DotAnimation';
import CustomEmoji from '../../common/CustomEmoji';
import PremiumIcon from '../../common/PremiumIcon';
import Contact from './Contact';
import Poll from './Poll';
import WebPage from './WebPage';
import Invoice from './Invoice';
import InvoiceMediaPreview from './InvoiceMediaPreview';
import Location from './Location';
import Album from './Album';
import RoundVideo from './RoundVideo';
import MessagePhoneCall from './MessagePhoneCall';

import FakeIcon from '../../common/FakeIcon';
import MessageText from '../../common/MessageText';
import TopicChip from '../../common/TopicChip';

import './Message.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';
import Likes from './Likes';
import NoAiPromptsModal from '../../payment/NoAiPromptsModal';
import LikesList from './LikesList';

type MessagePositionProperties = {
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  isFirstInDocumentGroup: boolean;
  isLastInDocumentGroup: boolean;
  isLastInList: boolean;
};

type OwnProps = {
  currentUserId: string;
  message: ApiMessage;
  observeIntersectionForBottom: ObserveFn;
  observeIntersectionForLoading: ObserveFn;
  observeIntersectionForPlaying: ObserveFn;
  album?: IAlbum;
  noAvatars?: boolean;
  withAvatar?: boolean;
  withSenderName?: boolean;
  threadId: ThreadId;
  messageListType: MessageListType;
  noComments: boolean;
  noReplies: boolean;
  appearanceOrder: number;
  hasGroup?: boolean;
  effectReactin?: ApiReaction | undefined;
  memoFirstUnreadIdRef: { current: number | undefined };
  onPinnedIntersectionChange: PinnedIntersectionChangedCallback;
} & MessagePositionProperties;

type StateProps = {
  theme: ISettings['theme'];
  forceSenderName?: boolean;
  chatUsernames?: ApiUsername[];
  sender?: ApiUser | ApiChat;
  canShowSender: boolean;
  originSender?: ApiUser | ApiChat;
  botSender?: ApiUser;
  isThreadTop?: boolean;
  shouldHideReply?: boolean;
  replyMessage?: ApiMessage;
  replyMessageSender?: ApiUser | ApiChat;
  outgoingStatus?: ApiMessageOutgoingStatus;
  uploadProgress?: number;
  isInDocumentGroup: boolean;
  isProtected?: boolean;
  isChatProtected?: boolean;
  isFocused?: boolean;
  focusDirection?: FocusDirection;
  noFocusHighlight?: boolean;
  isResizingContainer?: boolean;
  viewportIds?: number[];
  isForwarding?: boolean;
  isChatWithSelf?: boolean;
  isRepliesChat?: boolean;
  isChannel?: boolean;
  isGroup?: boolean;
  canReply?: boolean;
  lastSyncTime?: number;
  highlight?: string;
  animatedEmoji?: string;
  animatedCustomEmoji?: string;
  genericEffects?: ApiStickerSet;
  isInSelectMode?: boolean;
  isSelected?: boolean;
  isGroupSelected?: boolean;
  isDownloading: boolean;
  threadId?: ThreadId;
  isPinnedList?: boolean;
  isPinned?: boolean;
  canAutoLoadMedia?: boolean;
  canAutoPlayMedia?: boolean;
  hasLinkedChat?: boolean;
  shouldLoopStickers?: boolean;
  autoLoadFileMaxSizeMb: number;
  repliesThreadInfo?: ApiThreadInfo;
  reactionMessage?: ApiMessage;
  availableReactions?: ApiAvailableReaction[];
  defaultReaction?: ApiReaction;
  activeReactions?: ActiveReaction[];
  activeEmojiInteractions?: ActiveEmojiInteraction[];
  hasUnreadReaction?: boolean;
  isTranscribing?: boolean;
  transcribedText?: string;
  isTranscriptionError?: boolean;
  isPremium: boolean;
  animationLevel: AnimationLevel;
  senderAdminMember?: ApiChatMember;
  messageTopic?: ApiTopic;
  hasTopicChip?: boolean;
  chatTranslations?: ChatTranslatedMessages;
  areTranslationsEnabled?: boolean;
  requestedTranslationLanguage?: string;
  isLoadingComments?: boolean;
  isChatPrivate?: boolean;
  aiPurchases?: IAiPurchases;
  isBotSpace?: boolean;
};

type MetaPosition = 'in-text' | 'standalone' | 'none';
type ReactionsPosition = 'inside' | 'outside' | 'none';

const NBSP = '\u00A0';
// eslint-disable-next-line max-len
const APPENDIX_OWN = {
  __html:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 35"><g filter="url(#appendix-own)"><path fill="#0A49A5" fill-rule="evenodd" d="m1 30.675 5.94-17.563V13c0 15.689 7.66 18.673 10.007 19.587l.053.021a28.536 28.536 0 0 1-16-1.933Z" clip-rule="evenodd"/></g><defs><filter id="appendix-own" width="18" height="36" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1"/><feGaussianBlur stdDeviation=".5"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2_53340"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2_53340" result="shape"/></filter></defs></svg>',
};
// eslint-disable-next-line max-len
const APPENDIX_NOT_OWN = {
  __html:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 35"><g filter="url(#appendix-not-own)"><path fill="#fff" fill-rule="evenodd" d="m17 30.675-5.94-17.563V13c0 15.689-7.66 18.673-10.007 19.587L1 32.608a28.536 28.536 0 0 0 16-1.933Z" clip-rule="evenodd"/></g><defs><filter id="appendix-not-own" width="18" height="36" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1"/><feGaussianBlur stdDeviation=".5"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2_53331"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2_53331" result="shape"/></filter></defs></svg>',
};
const APPEARANCE_DELAY = 10;
const NO_MEDIA_CORNERS_THRESHOLD = 18;
const QUICK_REACTION_SIZE = 1.75 * REM;
const EXTRA_SPACE_FOR_REACTIONS = 2.25 * REM;
const BOTTOM_FOCUS_SCROLL_THRESHOLD = 5;
const THROTTLE_MS = 300;

const Message: FC<OwnProps & StateProps> = ({
  message,
  chatUsernames,
  currentUserId,
  observeIntersectionForBottom,
  observeIntersectionForLoading,
  observeIntersectionForPlaying,
  album,
  noAvatars,
  withAvatar,
  withSenderName,
  noComments,
  noReplies,
  appearanceOrder,
  isFirstInGroup,
  isPremium,
  isLastInGroup,
  isFirstInDocumentGroup,
  isLastInDocumentGroup,
  isTranscribing,
  transcribedText,
  isLastInList,
  theme,
  forceSenderName,
  sender,
  canShowSender,
  originSender,
  botSender,
  isThreadTop,
  shouldHideReply,
  replyMessage,
  replyMessageSender,
  outgoingStatus,
  uploadProgress,
  isInDocumentGroup,
  isProtected,
  isChatProtected,
  isFocused,
  focusDirection,
  noFocusHighlight,
  isResizingContainer,
  viewportIds,
  isForwarding,
  isChatWithSelf,
  isRepliesChat,
  isChannel,
  isGroup,
  canReply,
  lastSyncTime,
  highlight,
  animatedEmoji,
  animatedCustomEmoji,
  genericEffects,
  hasLinkedChat,
  isInSelectMode,
  isSelected,
  isGroupSelected,
  threadId,
  reactionMessage,
  availableReactions,
  defaultReaction,
  activeReactions,
  activeEmojiInteractions,
  messageListType,
  isPinnedList,
  isPinned,
  isDownloading,
  canAutoLoadMedia,
  canAutoPlayMedia,
  shouldLoopStickers,
  autoLoadFileMaxSizeMb,
  repliesThreadInfo,
  hasUnreadReaction,
  memoFirstUnreadIdRef,
  animationLevel,
  senderAdminMember,
  messageTopic,
  hasTopicChip,
  chatTranslations,
  areTranslationsEnabled,
  requestedTranslationLanguage,
  hasGroup,
  isLoadingComments,
  isChatPrivate,
  aiPurchases,
  isBotSpace,
  onPinnedIntersectionChange,
}) => {
  const {
    toggleMessageSelection,
    clickBotInlineButton,
    disableContextMenuHint,
    animateUnreadReaction,
    focusLastMessage,
  } = getActions();

  const ref = useRef<HTMLDivElement>(null);
  const bottomMarkerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeReactionsPopup, setActiveReactionsPopup] = useState(false);
  const messageHeightRef = useRef(0);
  const { t } = useTranslation();
  const [effectReactin, setEffectReactin] = useState<ApiReaction | undefined>();

  const [isTranscriptionHidden, setTranscriptionHidden] = useState(false);
  const [hasActiveStickerEffect, startStickerEffect, stopStickerEffect] =
    useFlag();
  const [isPurchaseAI, openPurchaseAI, closePurchaseAI] = useFlag();
  const { isMobile } = useAppLayout();

  useOnIntersect(bottomMarkerRef, observeIntersectionForBottom);

  const {
    isContextMenuOpen,
    contextMenuPosition,
    handleBeforeContextMenu,
    handleContextMenu: onContextMenu,
    handleContextMenuClose,
    handleContextMenuHide,
  } = useContextMenuHandlers(
    ref,
    IS_TOUCH_ENV && isInSelectMode,
    true,
    IS_ANDROID
  );

  useEffect(() => {
    if (isContextMenuOpen) {
      disableContextMenuHint();
    }
  }, [isContextMenuOpen, disableContextMenuHint]);

  const noAppearanceAnimation = appearanceOrder <= 0;
  const [isShown, markShown] = useFlag(noAppearanceAnimation);
  useEffect(() => {
    if (noAppearanceAnimation) {
      return;
    }

    setTimeout(markShown, appearanceOrder * APPEARANCE_DELAY);
  }, [appearanceOrder, markShown, noAppearanceAnimation]);

  const { transitionClassNames } = useShowTransition(
    isShown,
    undefined,
    noAppearanceAnimation,
    false
  );

  const {
    id: messageId,
    chatId,
    forwardInfo,
    viaBotId,
    isTranscriptionError,
  } = message;

  useEffect(() => {
    if (!isPinned) return undefined;
    const id = album ? album.mainMessage.id : messageId;

    return () => {
      onPinnedIntersectionChange({
        viewportPinnedIdsToRemove: [id],
        isUnmount: true,
      });
    };
  }, [album, isPinned, messageId, onPinnedIntersectionChange]);

  const isLocal = isMessageLocal(message);

  const isOwn =
    !isThreadTop &&
    (!isChatPrivate ? !isForwardedMessage(message) : true) &&
    (isOwnMessage(message) || currentUserId === message.senderId);

  const isScheduled = messageListType === 'scheduled' || message.isScheduled;
  const hasReply = isReplyMessage(message) && !shouldHideReply;

  const hasThread = Boolean(repliesThreadInfo) && messageListType === 'thread';
  const isCustomShape = getMessageCustomShape(message);
  const hasAnimatedEmoji =
    isCustomShape && (animatedEmoji || animatedCustomEmoji);
  const hasReactions =
    reactionMessage?.reactions && !areReactionsEmpty(reactionMessage.reactions);

  const asForwarded =
    forwardInfo &&
    (!isChatWithSelf || isScheduled) &&
    !isRepliesChat &&
    !forwardInfo.isLinkedChannelPost;

  const isAlbum =
    Boolean(album) &&
    album!.messages.length > 1 &&
    !album?.messages.some((msg) => Object.keys(msg.content).length === 0);
  const isInDocumentGroupNotFirst =
    isInDocumentGroup && !isFirstInDocumentGroup;
  const isInDocumentGroupNotLast = isInDocumentGroup && !isLastInDocumentGroup;
  const isContextMenuShown = contextMenuPosition !== undefined;
  const canShowActionButton =
    !(isContextMenuShown || isInSelectMode || isForwarding) &&
    !isInDocumentGroupNotLast;
  const canForward =
    isChannel &&
    !isScheduled &&
    message.isForwardingAllowed &&
    !isChatProtected;
  const canFocus = Boolean(
    isPinnedList ||
      (forwardInfo &&
        (forwardInfo.isChannelPost ||
          (isChatWithSelf && !isOwn) ||
          isRepliesChat) &&
        forwardInfo.fromMessageId)
  );

  const hasSubheader = hasTopicChip || hasReply;

  const onReactions = (value: boolean) => {
    setActiveReactionsPopup(value);
  };

  const selectMessage = useCallback(
    (e?: React.MouseEvent<HTMLDivElement, MouseEvent>, groupedId?: string) => {
      toggleMessageSelection({
        messageId,
        groupedId,
        ...(e?.shiftKey && { withShift: true }),
        ...(isAlbum && {
          childMessageIds: album!.messages.map(({ id }) => id),
        }),
      });
    },
    [toggleMessageSelection, messageId, isAlbum, album]
  );

  const { state: aiState, img_total = 0, text_total = 0 } = aiPurchases || {};

  const handleClickBotButton = useCallback(
    ({
      messageId,
      button,
    }: {
      messageId: number;
      button: ApiKeyboardButton;
    }) => {
      //@ts-ignore
      const data = JSON.parse(button.data);
      if (isBotSpace && data.command !== 1) {
        switch (aiState) {
          case AiState.image:
            if (img_total === 0) {
              openPurchaseAI();
              return;
            }
            break;
          case AiState.text:
            if (text_total === 0) {
              openPurchaseAI();
              return;
            }
            break;
        }
      }
      clickBotInlineButton({ messageId, button });
    },
    [aiState, img_total, text_total]
  );

  const messageSender = canShowSender ? sender : undefined;
  const withVoiceTranscription = Boolean(
    !isTranscriptionHidden && (isTranscriptionError || transcribedText)
  );

  const avatarPeer =
    forwardInfo && (isChatWithSelf || isRepliesChat || !messageSender)
      ? originSender
      : messageSender;
  const senderPeer = forwardInfo ? originSender : messageSender;

  const {
    handleMouseDown,
    handleClick,
    handleContextMenu,
    handleDoubleClick,
    handleContentDoubleClick,
    handleMouseMove,
    handleSendQuickReaction,
    handleMouseLeave,
    isSwiped,
    isQuickReactionVisible,
    handleDocumentGroupMouseEnter,
  } = useOuterHandlers(
    selectMessage,
    ref,
    messageId,
    isAlbum,
    Boolean(isInSelectMode),
    Boolean(canReply),
    Boolean(isProtected),
    onContextMenu,
    handleBeforeContextMenu,
    chatId,
    isContextMenuShown,
    contentRef,
    isOwn,
    isInDocumentGroupNotLast
  );

  const {
    handleAvatarClick,
    handleSenderClick,
    handleViaBotClick,
    handleReplyClick,
    handleMediaClick,
    handleAudioPlay,
    handleAlbumMediaClick,
    handleMetaClick,
    handleTranslationClick,
    handleOpenThread,
    handleReadMedia,
    handleCancelUpload,
    handleVoteSend,
    handleGroupForward,
    handleForward,
    handleFocus,
    handleFocusForwarded,
    handleDocumentGroupSelectAll,
    handleTopicChipClick,
  } = useInnerHandlers(
    t,
    selectMessage,
    message,
    chatId,
    threadId,
    isInDocumentGroup,
    asForwarded,
    isScheduled,
    isRepliesChat,
    album,
    avatarPeer,
    senderPeer,
    botSender,
    messageTopic
  );

  useEffect(() => {
    if (!isLastInList) {
      return;
    }

    if (withVoiceTranscription && transcribedText) {
      focusLastMessage();
    }
  }, [focusLastMessage, isLastInList, transcribedText, withVoiceTranscription]);

  const containerClassName = classNames(
    'Message message-list-item',
    transitionClassNames,
    {
      'first-in-group': isFirstInGroup,
      'is-protected': isProtected,
      'last-in-group': isLastInGroup,
      'first-in-document-group': isFirstInDocumentGroup,
      'last-in-document-group': isLastInDocumentGroup,
      'last-in-list': isLastInList,
      own: isOwn && !isChannel,
      'is-channel': isChannel && !hasGroup,
      'has-views': Boolean(message.views),
      'was-edited': message.isEdited,
      'has-reply': hasReply,
      'has-menu-open': isContextMenuShown,
      focused: isFocused && !noFocusHighlight,
      'is-forwarding': isForwarding,
      'is-deleting': message.isDeleting,
      'is-in-document-group': isInDocumentGroup,
      'is-album': isAlbum,
      'has-unread-mention': message.hasUnreadMention,
      'is-selected': isSelected,
      'is-in-selection-mode': isInSelectMode,
      'is-thread-top': isThreadTop && !withAvatar,
      'has-inline-buttons': Boolean(message.inlineButtons),
      'is-swiped': isSwiped,
      'has-active-reaction': Boolean(activeReactions) || hasActiveStickerEffect,
    }
  );

  const {
    text,
    photo,
    video,
    audio,
    voice,
    document,
    sticker,
    contact,
    poll,
    webPage,
    invoice,
    location,
    action,
    game,
  } = getMessageContent(message);

  const { result: detectedLanguage } = useTextLanguage(
    areTranslationsEnabled ? text?.text : undefined
  );

  const { isPending: isTranslationPending, translatedText } =
    useMessageTranslation(
      chatTranslations,
      chatId,
      messageId,
      requestedTranslationLanguage
    );
  // Used to display previous result while new one is loading
  const previousTranslatedText = usePrevious(translatedText, true);

  const currentText = isTranslationPending
    ? previousTranslatedText || text
    : translatedText;
  const currentTranslatedText = translatedText || previousTranslatedText;

  const { phoneCall } = action || {};

  const isMediaWidthWithCommentButton =
    (repliesThreadInfo || (hasLinkedChat && isChannel && isLocal)) &&
    !isInDocumentGroupNotLast &&
    messageListType === 'thread' &&
    !noComments;

  const withCommentButton =
    repliesThreadInfo &&
    !isInDocumentGroupNotLast &&
    messageListType === 'thread' &&
    !noComments;

  const withQuickReactionButton =
    !IS_TOUCH_ENV &&
    !phoneCall &&
    !isInSelectMode &&
    defaultReaction &&
    !isInDocumentGroupNotLast;

  const contentClassName = buildContentClassName(message, {
    hasSubheader,
    isCustomShape,
    isLastInGroup,
    asForwarded,
    hasThread: hasThread && !noComments,
    forceSenderName,
    hasComments: repliesThreadInfo && repliesThreadInfo.messagesCount > 0,
    hasActionButton: canForward || canFocus,
    hasReactions,
    isGeoLiveActive:
      location?.type === 'geoLive' &&
      !isGeoLiveExpired(message, getServerTime()),
    withVoiceTranscription,
    isChannel,
  });

  const withAppendix = contentClassName.includes('has-appendix');
  const hasText = hasMessageText(message);
  const emojiSize = getCustomEmojiSize(message.emojiOnlyCount);

  let metaPosition!: MetaPosition;
  if (phoneCall) {
    metaPosition = 'none';
  } else if (isInDocumentGroupNotLast) {
    metaPosition = 'none';
  } else if (hasText && !webPage && !hasAnimatedEmoji) {
    metaPosition = 'in-text';
  } else {
    metaPosition = 'standalone';
  }

  let reactionsPosition!: ReactionsPosition;
  if (hasReactions) {
    if (isCustomShape || ((photo || video) && !hasText)) {
      reactionsPosition = 'outside';
    } else if (asForwarded) {
      metaPosition = 'standalone';
      reactionsPosition = 'inside';
    } else {
      reactionsPosition = 'inside';
    }
  } else {
    reactionsPosition = 'none';
  }

  useEnsureMessage(
    isRepliesChat && message.replyToChatId ? message.replyToChatId : chatId,
    hasReply ? message.replyToMsgId : undefined,
    replyMessage,
    message.id
  );

  useFocusMessage(
    ref,
    messageId,
    chatId,
    isFocused,
    focusDirection,
    noFocusHighlight,
    viewportIds,
    isResizingContainer
  );

  const shouldFocusOnResize = isLastInGroup;

  const handleResize = useCallback(
    (entry: ResizeObserverEntry) => {
      const lastHeight = messageHeightRef.current;

      const newHeight = entry.target.clientHeight;
      messageHeightRef.current = newHeight;
      if (isAnimatingScroll() || !lastHeight || newHeight <= lastHeight) return;

      const container = entry.target.closest<HTMLDivElement>('.MessageList');
      if (!container) return;

      const resizeDiff = newHeight - lastHeight;
      const { offsetHeight, scrollHeight, scrollTop } = container;
      const currentScrollBottom = Math.round(
        scrollHeight - scrollTop - offsetHeight
      );
      const previousScrollBottom = currentScrollBottom - resizeDiff;

      if (previousScrollBottom <= BOTTOM_FOCUS_SCROLL_THRESHOLD) {
        focusLastMessage();
      }
    },
    [focusLastMessage]
  );

  const throttledResize = useThrottledCallback(
    handleResize,
    [handleResize],
    THROTTLE_MS,
    false
  );

  useResizeObserver(shouldFocusOnResize ? ref : undefined, throttledResize);

  useEffect(() => {
    const bottomMarker = bottomMarkerRef.current;
    if (
      hasUnreadReaction &&
      bottomMarker &&
      isElementInViewport(bottomMarker)
    ) {
      animateUnreadReaction({ messageIds: [messageId] });
    }
  }, [hasUnreadReaction, messageId, animateUnreadReaction]);

  let style = {};
  let calculatedWidth;
  let reactionsMaxWidth;
  let contentWidth: number | undefined;
  let noMediaCorners = false;
  const albumLayout = useMemo(() => {
    return isAlbum
      ? calculateAlbumLayout(
          isOwn,
          Boolean(asForwarded),
          Boolean(noAvatars),
          album!,
          isMobile
        )
      : undefined;
  }, [isAlbum, isOwn, asForwarded, noAvatars, album, isMobile]);

  const extraPadding = asForwarded ? 28 : 0;

  if (!isAlbum && (photo || video || invoice?.extendedMedia)) {
    let width: number | undefined;
    if (photo) {
      width = calculateMediaDimensions(
        message,
        asForwarded,
        noAvatars,
        isMobile
      ).width;
    } else if (video) {
      if (video.isRound) {
        width = ROUND_VIDEO_DIMENSIONS_PX;
      } else {
        width = calculateMediaDimensions(
          message,
          asForwarded,
          noAvatars,
          isMobile
        ).width;
      }
    } else if (
      invoice?.extendedMedia &&
      invoice.extendedMedia.width &&
      invoice.extendedMedia.height
    ) {
      const { width: previewWidth, height: previewHeight } =
        invoice.extendedMedia;
      width = calculateDimensionsForMessageMedia({
        width: previewWidth,
        height: previewHeight,
        fromOwnMessage: isOwn,
        asForwarded,
        noAvatars,
        isMobile,
      }).width;
    }

    if (width) {
      if (
        width <
        (isMediaWidthWithCommentButton
          ? MIN_MEDIA_WIDTH_WITH_COMMENTS
          : MIN_MEDIA_WIDTH_WITH_TEXT)
      ) {
        contentWidth = width;
      }

      calculatedWidth = Math.max(
        getMinMediaWidth(Boolean(currentText), isMediaWidthWithCommentButton),
        width
      );

      if (
        invoice?.extendedMedia &&
        calculatedWidth - width > NO_MEDIA_CORNERS_THRESHOLD
      ) {
        noMediaCorners = true;
      }
    }
  } else if (albumLayout) {
    calculatedWidth = Math.max(
      getMinMediaWidth(Boolean(currentText), isMediaWidthWithCommentButton),
      albumLayout.containerStyle.width
    );

    if (
      calculatedWidth - albumLayout.containerStyle.width >
      NO_MEDIA_CORNERS_THRESHOLD
    ) {
      noMediaCorners = true;
    }
  }

  if (calculatedWidth) {
    style = { ...style, width: `${calculatedWidth + extraPadding}px` };
    reactionsMaxWidth = calculatedWidth + EXTRA_SPACE_FOR_REACTIONS;
  }

  const signature =
    (isChannel && message.postAuthorTitle) ||
    (!asForwarded && forwardInfo?.postAuthorTitle) ||
    undefined;
  const metaSafeAuthorWidth = useMemo(() => {
    return signature ? calculateAuthorWidth(signature) : undefined;
  }, [signature]);

  function renderAvatar() {
    const isAvatarPeerUser = avatarPeer && isUserId(avatarPeer.id);
    const avatarUser =
      avatarPeer && isAvatarPeerUser ? (avatarPeer as ApiUser) : undefined;
    const avatarChat =
      avatarPeer && !isAvatarPeerUser ? (avatarPeer as ApiChat) : undefined;
    const hiddenName =
      !avatarPeer && forwardInfo ? forwardInfo.hiddenUserName : undefined;
    return (
      <Avatar
        size={isMobile ? 'small-mobile' : 'small'}
        peer={avatarUser || avatarChat}
        text={hiddenName}
        lastSyncTime={lastSyncTime}
        onClick={avatarUser || avatarChat ? handleAvatarClick : undefined}
        observeIntersection={observeIntersectionForLoading}
        withVideo
      />
    );
  }

  function renderMessageText(isForAnimation?: boolean) {
    return (
      <MessageText
        message={message}
        translatedText={
          requestedTranslationLanguage ? currentTranslatedText : undefined
        }
        isForAnimation={isForAnimation}
        emojiSize={emojiSize}
        highlight={highlight}
        isProtected={isProtected}
        observeIntersectionForLoading={observeIntersectionForLoading}
        observeIntersectionForPlaying={observeIntersectionForPlaying}
        withTranslucentThumbs={isCustomShape}
      />
    );
  }

  function renderReactionsAndMeta() {
    const meta = (
      <MessageMeta
        message={message}
        isPinned={isPinned}
        noReplies={noReplies}
        repliesThreadInfo={repliesThreadInfo}
        outgoingStatus={outgoingStatus}
        signature={signature}
        withReactionOffset={reactionsPosition === 'inside'}
        availableReactions={availableReactions}
        isTranslated={Boolean(
          requestedTranslationLanguage ? currentTranslatedText : undefined
        )}
        onClick={handleMetaClick}
        onTranslationClick={handleTranslationClick}
        onOpenThread={handleOpenThread}
        isGroup={isGroup || false}
        metaPosition={metaPosition}
        reactions={reactionMessage!}
      />
    );

    if (hasGroup && reactionsPosition !== 'outside') {
      return (
        <Reactions
          isMedia={
            photo ||
            text?.entities?.[0].type.toLowerCase().includes('url') ||
            video ||
            audio ||
            voice ||
            document
          }
          hasGroup={hasGroup}
          activeReactions={activeReactions}
          message={reactionMessage!}
          metaChildren={meta}
          availableReactions={availableReactions}
          genericEffects={genericEffects}
          observeIntersection={observeIntersectionForPlaying}
          noRecentReactors={isChannel}
          effectReactin={effectReactin}
          setEffectReactin={setEffectReactin}
          contentClassName={contentClassName}
          forwardInfo={message.forwardInfo}
          isOwn={isOwn}
        />
      );
    }

    if (!isChannel) {
      return meta;
    }

    if (reactionsPosition === 'outside') {
      return null;
    }

    return (
      <Reactions
        activeReactions={activeReactions}
        message={reactionMessage!}
        metaChildren={meta}
        availableReactions={availableReactions}
        genericEffects={genericEffects}
        observeIntersection={observeIntersectionForPlaying}
        noRecentReactors={isChannel}
        effectReactin={effectReactin}
        setEffectReactin={setEffectReactin}
        contentClassName={contentClassName}
      />
    );
    // return (
    //   <>
    //     <Likes
    //       message={reactionMessage!}
    //       defaultReaction={defaultReaction!}
    //       metaChildren={meta}
    //       chatId={chatId}
    //     />
    //   </>
    // );
  }

  function renderContent() {
    const className = classNames('content-inner', {
      'forwarded-message': asForwarded,
      'with-subheader': hasSubheader,
      'no-media-corners': noMediaCorners,
    });
    const hasCustomAppendix =
      isLastInGroup && !hasText && !asForwarded && !withCommentButton;
    const textContentClass = classNames('text-content clearfix', {
      'with-meta': metaPosition === 'in-text',
      'with-outgoing-icon': outgoingStatus,
    });

    return (
      <div
        className={className}
        onDoubleClick={handleContentDoubleClick}
        dir='auto'
      >
        {sticker && (
          <Sticker
            message={message}
            observeIntersection={observeIntersectionForLoading}
            observeIntersectionForPlaying={observeIntersectionForPlaying}
            shouldLoop={shouldLoopStickers}
            lastSyncTime={lastSyncTime}
            shouldPlayEffect={
              (sticker.hasEffect &&
                ((memoFirstUnreadIdRef.current &&
                  messageId >= memoFirstUnreadIdRef.current) ||
                  isLocal)) ||
              undefined
            }
            onPlayEffect={startStickerEffect}
            onStopEffect={stopStickerEffect}
          />
        )}
        {hasAnimatedEmoji && animatedCustomEmoji && (
          <AnimatedCustomEmoji
            customEmojiId={animatedCustomEmoji}
            withEffects={isUserId(chatId)!}
            isOwn={isOwn}
            observeIntersection={observeIntersectionForLoading}
            lastSyncTime={lastSyncTime}
            forceLoadPreview={isLocal}
            messageId={messageId}
            chatId={chatId}
            activeEmojiInteractions={activeEmojiInteractions}
          />
        )}

        {isAlbum && (
          <Album
            album={album!}
            albumLayout={albumLayout!}
            observeIntersection={observeIntersectionForLoading}
            isOwn={isOwn && !isChannel}
            isProtected={isProtected}
            hasCustomAppendix={hasCustomAppendix}
            lastSyncTime={lastSyncTime}
            onMediaClick={handleAlbumMediaClick}
          />
        )}
        {phoneCall && (
          <MessagePhoneCall
            message={message}
            phoneCall={phoneCall}
            chatId={chatId}
            isOwn={isOwn}
          />
        )}
        {!isAlbum && photo && (
          <Photo
            message={message}
            observeIntersection={observeIntersectionForLoading}
            noAvatars={noAvatars}
            canAutoLoad={canAutoLoadMedia}
            uploadProgress={uploadProgress}
            shouldAffectAppendix={hasCustomAppendix}
            isDownloading={isDownloading}
            isProtected={isProtected}
            asForwarded={asForwarded}
            theme={theme}
            forcedWidth={contentWidth}
            onClick={handleMediaClick}
            onCancelUpload={handleCancelUpload}
            isChannel={isChannel}
          />
        )}
        {!isAlbum && video && video.isRound && (
          <RoundVideo
            message={message}
            observeIntersection={observeIntersectionForLoading}
            canAutoLoad={canAutoLoadMedia}
            lastSyncTime={lastSyncTime}
            isDownloading={isDownloading}
          />
        )}
        {!isAlbum && video && !video.isRound && (
          <Video
            message={message}
            observeIntersectionForLoading={observeIntersectionForLoading}
            observeIntersectionForPlaying={observeIntersectionForPlaying}
            forcedWidth={contentWidth}
            noAvatars={noAvatars}
            canAutoLoad={canAutoLoadMedia}
            canAutoPlay={canAutoPlayMedia}
            uploadProgress={uploadProgress}
            lastSyncTime={lastSyncTime}
            isDownloading={isDownloading}
            isProtected={isProtected}
            asForwarded={asForwarded}
            onClick={handleMediaClick}
            onCancelUpload={handleCancelUpload}
          />
        )}
        {(audio || voice) && (
          <Audio
            theme={theme}
            message={message}
            origin={AudioOrigin.Inline}
            uploadProgress={uploadProgress}
            lastSyncTime={lastSyncTime}
            isSelectable={isInDocumentGroup}
            isSelected={isSelected}
            noAvatars={noAvatars}
            onPlay={handleAudioPlay}
            onReadMedia={
              voice && (!isOwn || isChatWithSelf) ? handleReadMedia : undefined
            }
            onCancelUpload={handleCancelUpload}
            isDownloading={isDownloading}
            isTranscribing={isTranscribing}
            isTranscriptionHidden={isTranscriptionHidden}
            isTranscribed={Boolean(transcribedText)}
            isTranscriptionError={isTranscriptionError}
            canDownload={!isProtected}
            onHideTranscription={setTranscriptionHidden}
            canTranscribe={isPremium}
          />
        )}
        {document && (
          <Document
            message={message}
            observeIntersection={observeIntersectionForLoading}
            canAutoLoad={canAutoLoadMedia}
            autoLoadFileMaxSizeMb={autoLoadFileMaxSizeMb}
            uploadProgress={uploadProgress}
            isSelectable={isInDocumentGroup}
            isSelected={isSelected}
            onMediaClick={handleMediaClick}
            onCancelUpload={handleCancelUpload}
            isDownloading={isDownloading}
          />
        )}
        {contact && <Contact contact={contact} />}
        {poll && (
          <Poll message={message} poll={poll} onSendVote={handleVoteSend} />
        )}

        {invoice?.extendedMedia && (
          <InvoiceMediaPreview message={message} lastSyncTime={lastSyncTime} />
        )}

        {withVoiceTranscription && (
          <p
            className={classNames('transcription', {
              'transcription-error':
                !isTranscriptionHidden && isTranscriptionError,
            })}
            dir='auto'
          >
            {isTranscriptionError ? (
              t('NoWordsRecognized')
            ) : isTranscribing && transcribedText ? (
              <DotAnimation content={transcribedText} />
            ) : (
              transcribedText
            )}
          </p>
        )}

        {!hasAnimatedEmoji && hasText && (
          <div className={textContentClass} dir='auto'>
            {renderMessageText()}
            {isTranslationPending && (
              <div className='translation-animation'>
                <div className='text-loading'>{renderMessageText(true)}</div>
              </div>
            )}
            {metaPosition === 'in-text' && renderReactionsAndMeta()}
          </div>
        )}

        {webPage && (
          <WebPage
            message={message}
            observeIntersection={observeIntersectionForLoading}
            noAvatars={noAvatars}
            canAutoLoad={canAutoLoadMedia}
            canAutoPlay={canAutoPlayMedia}
            asForwarded={asForwarded}
            lastSyncTime={lastSyncTime}
            isDownloading={isDownloading}
            isProtected={isProtected}
            theme={theme}
            onMediaClick={handleMediaClick}
            onCancelMediaTransfer={handleCancelUpload}
          />
        )}
        {invoice && !invoice.extendedMedia && (
          <Invoice
            message={message}
            shouldAffectAppendix={hasCustomAppendix}
            isInSelectMode={isInSelectMode}
            isSelected={isSelected}
            theme={theme}
            forcedWidth={contentWidth}
          />
        )}
        {location && (
          <Location
            message={message}
            isInSelectMode={isInSelectMode}
            isSelected={isSelected}
            theme={theme}
            peer={sender}
          />
        )}
      </div>
    );
  }

  function renderSenderName() {
    const media = photo || video || location;
    const shouldRender =
      !viaBotId &&
      ((withSenderName && (!media || hasTopicChip)) ||
        asForwarded ||
        viaBotId ||
        forceSenderName) &&
      !isInDocumentGroupNotFirst &&
      !hasReply;

    if (!shouldRender) {
      return undefined;
    }

    let senderTitle;
    let senderColor;

    if (senderPeer && !(isCustomShape && viaBotId)) {
      senderTitle = getSenderTitle(t, senderPeer);

      if (!asForwarded && !isOwn) {
        senderColor = `color-${getUserColorKey(senderPeer)}`;
      }
    } else if (forwardInfo?.hiddenUserName) {
      senderTitle = forwardInfo.hiddenUserName;
    }

    const senderEmojiStatus =
      senderPeer && 'emojiStatus' in senderPeer && senderPeer.emojiStatus;
    const senderIsPremium =
      senderPeer && 'isPremium' in senderPeer && senderPeer.isPremium;

    return (
      <div className='message-title' dir='ltr'>
        {forwardInfo?.isLinkedChannelPost || asForwarded ? (
          <span
            className={classNames(
              `message-title-name interactive ${senderColor}`
            )}
            onClick={handleSenderClick}
            dir='ltr'
          >
            {asForwarded && (
              <span>
                {t('ForwardedMessage')}
                <br />
              </span>
            )}

            <span>
              {asForwarded && t('From')}{' '}
              {senderTitle
                ? renderText(senderTitle)
                : asForwarded
                ? NBSP
                : undefined}
            </span>
            {!asForwarded && senderEmojiStatus && (
              <CustomEmoji
                documentId={senderEmojiStatus.documentId}
                loopLimit={EMOJI_STATUS_LOOP_LIMIT}
                observeIntersectionForLoading={observeIntersectionForLoading}
                observeIntersectionForPlaying={observeIntersectionForPlaying}
              />
            )}
            {!asForwarded && !senderEmojiStatus && senderIsPremium && (
              <PremiumIcon />
            )}
            {senderPeer?.fakeType && (
              <FakeIcon fakeType={senderPeer.fakeType} />
            )}
          </span>
        ) : !botSender ? (
          NBSP
        ) : undefined}
        {botSender && (
          <>
            <span className='via'>{t('ViaBot')}</span>
            <span className='interactive' onClick={handleViaBotClick}>
              {renderText(`@${botSender.usernames![0].username}`)}
            </span>
          </>
        )}

        {forwardInfo?.isLinkedChannelPost ? (
          <span className='admin-title' dir='auto'>
            {t('Channel.DiscussChannel')}
          </span>
        ) : message.forwardInfo?.postAuthorTitle && isGroup && asForwarded ? (
          <span className='admin-title' dir='auto'>
            {message.forwardInfo?.postAuthorTitle}
          </span>
        ) : message.postAuthorTitle && isGroup && !asForwarded ? (
          <span className='admin-title' dir='auto'>
            {message.postAuthorTitle}
          </span>
        ) : senderAdminMember && !asForwarded ? (
          <span className='admin-title' dir='auto'>
            {senderAdminMember.customTitle ||
              t(
                senderAdminMember.isOwner
                  ? 'GroupInfo.LabelOwner'
                  : 'GroupInfo.LabelAdmin'
              )}
          </span>
        ) : undefined}
      </div>
    );
  }

  //const forwardAuthor = isGroup && asForwarded ? message.postAuthorTitle : undefined;

  const chatUsername = useMemo(
    () => chatUsernames?.find((c) => c.isActive),
    [chatUsernames]
  );

  return (
    <div
      ref={ref}
      id={getMessageHtmlId(message.id)}
      className={containerClassName}
      style={
        !!metaSafeAuthorWidth
          ? // @ts-ignore
            { '--meta-safe-author-width': `${metaSafeAuthorWidth}px` }
          : undefined
      }
      data-message-id={messageId}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => {
        onReactions(true);
        isInDocumentGroupNotLast ? handleDocumentGroupMouseEnter : undefined;
      }}
      onMouseMove={withQuickReactionButton ? handleMouseMove : undefined}
      onMouseLeave={() => {
        onReactions(false);
        withQuickReactionButton || isInDocumentGroupNotLast
          ? handleMouseLeave
          : undefined;
      }}
    >
      <div
        ref={bottomMarkerRef}
        className='bottom-marker'
        data-message-id={messageId}
        data-last-message-id={
          album ? album.messages[album.messages.length - 1].id : undefined
        }
        data-album-main-id={album ? album.mainMessage.id : undefined}
        data-has-unread-mention={message.hasUnreadMention || undefined}
        data-has-unread-reaction={hasUnreadReaction || undefined}
        data-is-pinned={isPinned || undefined}
      />
      {!isInDocumentGroup && (
        <div className='message-select-control'>
          {isSelected && (
            <i className='icon-svg'>
              <IconSvg name='check' w='15' h='17' />
            </i>
          )}
        </div>
      )}
      {isLastInDocumentGroup && (
        <div
          className={classNames('message-select-control group-select', {
            'is-selected': isGroupSelected,
          })}
          onClick={handleDocumentGroupSelectAll}
        >
          {isGroupSelected && (
            <i className='icon-svg'>
              <IconSvg name='check' w='15' h='17' />
            </i>
          )}
        </div>
      )}
      {withAvatar && renderAvatar()}
      <div
        className={classNames('message-content-wrapper', {
          'can-select-text': contentClassName.includes('text'),
          'is-channel': isChannel,
          'has-appendix': contentClassName.includes('has-appendix'),
        })}
      >
        <div
          ref={contentRef}
          className={contentClassName}
          style={style}
          dir='auto'
        >
          {forwardInfo && renderSenderName()}
          {hasSubheader && (
            <div className='message-subheader'>
              {hasTopicChip && (
                <TopicChip
                  topic={messageTopic}
                  onClick={handleTopicChipClick}
                  className='message-topic'
                />
              )}
              {hasReply && (
                <EmbeddedMessage
                  message={replyMessage}
                  noUserColors={isOwn || isChannel}
                  isProtected={isProtected}
                  sender={replyMessageSender}
                  observeIntersectionForLoading={observeIntersectionForLoading}
                  observeIntersectionForPlaying={observeIntersectionForPlaying}
                  onClick={handleReplyClick}
                />
              )}
            </div>
          )}
          {renderContent()}
          {!isInDocumentGroupNotLast &&
            metaPosition === 'standalone' &&
            renderReactionsAndMeta()}
          {/* {isGroup && (
            <Likes
              message={reactionMessage!}
              defaultReaction={defaultReaction!}
              chatId={chatId}
            />
          )} */}

          {canShowActionButton && canForward ? (
            <Button
              className='message-action-button'
              color='translucent-white'
              round
              size='tiny'
              ariaLabel={String(t('Forward'))}
              onClick={
                isLastInDocumentGroup ? handleGroupForward : handleForward
              }
            >
              <i className='icon-svg'>
                <IconSvg name='forward' />
              </i>
            </Button>
          ) : canShowActionButton && canFocus && !hasReply ? (
            <Button
              className='message-action-button'
              color='translucent-white'
              round
              size='tiny'
              ariaLabel='Focus message'
              onClick={isPinnedList ? handleFocus : handleFocusForwarded}
            >
              <i className='icon-arrow-right' />
            </Button>
          ) : undefined}
          {withCommentButton && (
            <CommentButton
              threadInfo={repliesThreadInfo}
              disabled={noComments}
            />
          )}

          {hasReply && canFocus && (
            <div className='CommentButton' onClick={handleFocusForwarded}>
              <IconSvg name='view-reply' />
              <div className='label' dir='auto'>
                View Reply
              </div>
              <i className='icon-next' />
            </div>
          )}

          {withQuickReactionButton && (
            <div
              className={classNames('quick-reaction', {
                visible: isQuickReactionVisible && !activeReactions,
              })}
              onClick={handleSendQuickReaction}
            >
              <ReactionStaticEmoji
                reaction={defaultReaction}
                size={QUICK_REACTION_SIZE}
                availableReactions={availableReactions}
                observeIntersection={observeIntersectionForPlaying}
              />
            </div>
          )}
        </div>
        {withAppendix && (
          <div
            style={reactionsPosition === 'outside' ? { bottom: 36 } : {}}
            className={isChannel ? 'svg-appendix-white' : 'svg-appendix'}
            dangerouslySetInnerHTML={
              isOwn && !isChannel ? APPENDIX_OWN : APPENDIX_NOT_OWN
            }
          />
        )}
        {reactionsPosition === 'outside' && (
          <Reactions
            message={reactionMessage!}
            isOutside
            maxWidth={reactionsMaxWidth}
            activeReactions={activeReactions}
            availableReactions={availableReactions}
            genericEffects={genericEffects}
            observeIntersection={observeIntersectionForPlaying}
            noRecentReactors={isChannel}
            effectReactin={effectReactin}
            setEffectReactin={setEffectReactin}
          />
        )}
      </div>
      {contextMenuPosition && (
        <ContextMenuContainer
          isOpen={isContextMenuOpen}
          anchor={contextMenuPosition}
          message={message}
          album={album}
          chatUsername={chatUsername?.username}
          messageListType={messageListType}
          onClose={handleContextMenuClose}
          onCloseAnimationEnd={handleContextMenuHide}
          repliesThreadInfo={repliesThreadInfo}
          noReplies={noReplies}
          detectedLanguage={detectedLanguage}
          setEffectReactin={setEffectReactin}
        />
      )}
      {message.inlineButtons && (
        <InlineButtons message={message} onClick={handleClickBotButton} />
      )}
      <NoAiPromptsModal
        isOpen={isPurchaseAI}
        onClose={closePurchaseAI}
        aiState={aiState!}
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>(
    (
      global,
      {
        message,
        album,
        withSenderName,
        withAvatar,
        threadId,
        messageListType,
        isLastInDocumentGroup,
        isFirstInGroup,
      }
    ): StateProps => {
      const {
        focusedMessage,
        forwardMessages,
        activeReactions,
        activeEmojiInteractions,
      } = selectTabState(global);
      const { lastSyncTime, aiPurchases } = global;

      const {
        id,
        chatId,
        viaBotId,
        replyToChatId,
        replyToMsgId,
        replyToTopId,
        isOutgoing,
        repliesThreadInfo,
        forwardInfo,
        transcriptionId,
        isPinned,
      } = message;

      const chat = selectChat(global, chatId);

      const isChatWithSelf = selectIsChatWithSelf(global, chatId);
      const isRepliesChat = isChatWithRepliesBot(chatId);
      const isChannel = chat && isChatChannel(chat);
      const isGroup = chat && isChatGroup(chat);
      const chatUsernames = chat?.usernames;
      const isChatPrivate = chat?.type === 'chatTypePrivate';

      const isForwarding =
        forwardMessages.messageIds && forwardMessages.messageIds.includes(id);
      const forceSenderName = !isChatWithSelf && isAnonymousOwnMessage(message);

      const canShowSender = withSenderName || withAvatar || forceSenderName;
      const sender = selectSender(global, message);

      const originSender = selectForwardedSender(global, message);
      const botSender = viaBotId ? selectUser(global, viaBotId) : undefined;
      const senderAdminMember =
        sender?.id && isGroup
          ? chat.fullInfo?.adminMembersById?.[sender?.id]
          : undefined;

      const threadTopMessageId = threadId
        ? selectThreadTopMessageId(global, chatId, threadId)
        : undefined;
      const isThreadTop = message.id === threadTopMessageId;

      const shouldHideReply = replyToMsgId === threadTopMessageId;
      const replyMessage =
        replyToMsgId && !shouldHideReply
          ? selectChatMessage(
              global,
              isRepliesChat && replyToChatId ? replyToChatId : chatId,
              replyToMsgId
            )
          : undefined;
      const replyMessageSender =
        replyMessage &&
        selectReplySender(global, replyMessage, Boolean(forwardInfo));
      const isReplyToTopicStart =
        replyMessage?.content.action?.type === 'topicCreate';

      const uploadProgress = selectUploadProgress(global, message);

      const isFocused =
        messageListType === 'thread' &&
        (album
          ? album.messages.some((m) =>
              selectIsMessageFocused(global, m, Number(threadId))
            )
          : selectIsMessageFocused(global, message, Number(threadId)));

      const {
        direction: focusDirection,
        noHighlight: noFocusHighlight,
        isResizingContainer,
      } = (isFocused && focusedMessage) || {};

      const { query: highlight } = selectCurrentTextSearch(global) || {};

      const singleEmoji = getMessageSingleRegularEmoji(message);
      const animatedEmoji =
        singleEmoji && selectAnimatedEmoji(global, singleEmoji)
          ? singleEmoji
          : undefined;
      const animatedCustomEmoji = getMessageSingleCustomEmoji(message);

      let isSelected: boolean;
      if (album?.messages) {
        isSelected = album.messages.every(({ id: messageId }) =>
          selectIsMessageSelected(global, messageId)
        );
      } else {
        isSelected = selectIsMessageSelected(global, id);
      }

      const { canReply } =
        (messageListType === 'thread' &&
          selectAllowedMessageActions(global, message, threadId)) ||
        {};
      const isDownloading = selectIsDownloading(global, message);

      const actualRepliesThreadInfo = repliesThreadInfo
        ? selectThreadInfo(
            global,
            repliesThreadInfo.chatId,
            repliesThreadInfo.threadId!
          ) || repliesThreadInfo
        : undefined;

      const isInDocumentGroup =
        Boolean(message.groupedId) && !message.isInAlbum;

      const documentGroupFirstMessageId = isInDocumentGroup
        ? selectMessageIdsByGroupId(global, chatId, message.groupedId!)
          ? selectMessageIdsByGroupId(global, chatId, message.groupedId!)![0]
          : undefined
        : undefined;
      const reactionMessage = isInDocumentGroup
        ? isLastInDocumentGroup
          ? selectChatMessage(global, chatId, documentGroupFirstMessageId!)
          : undefined
        : message;

      const hasUnreadReaction = chat?.unreadReactions?.includes(message.id);

      const hasTopicChip =
        threadId === MAIN_THREAD_ID && chat?.isForum && isFirstInGroup;
      const messageTopic = hasTopicChip
        ? selectTopicFromMessage(global, message) ||
          chat?.topics?.[GENERAL_TOPIC_ID]
        : undefined;

      const isLocation = Boolean(getMessageLocation(message));
      const chatTranslations = selectChatTranslations(global, chatId);
      const requestedTranslationLanguage = selectRequestedTranslationLanguage(
        global,
        chatId,
        message.id
      );

      return {
        theme: selectTheme(global),
        chatUsernames,
        forceSenderName,
        canShowSender,
        originSender,
        botSender,
        shouldHideReply: shouldHideReply || isReplyToTopicStart,
        isThreadTop,
        replyMessage,
        replyMessageSender,
        isInDocumentGroup,
        isProtected: selectIsMessageProtected(global, message),
        isChatProtected: selectIsChatProtected(global, chatId),
        isFocused,
        isForwarding,
        reactionMessage,
        isChatWithSelf,
        isRepliesChat,
        isChannel,
        isGroup,
        canReply,
        lastSyncTime,
        highlight,
        animatedEmoji,
        animatedCustomEmoji,
        isInSelectMode: selectIsInSelectMode(global),
        isSelected,
        isGroupSelected:
          Boolean(message.groupedId) &&
          !message.isInAlbum &&
          selectIsDocumentGroupSelected(global, chatId, message.groupedId),
        threadId,
        isDownloading,
        isPinnedList: messageListType === 'pinned',
        isPinned,
        canAutoLoadMedia: selectCanAutoLoadMedia(global, message),
        canAutoPlayMedia: selectCanAutoPlayMedia(global, message),
        autoLoadFileMaxSizeMb: global.settings.byKey.autoLoadFileMaxSizeMb,
        shouldLoopStickers: selectShouldLoopStickers(global),
        repliesThreadInfo: actualRepliesThreadInfo,
        isLoadingComments: repliesThreadInfo?.isComments,
        availableReactions: global.availableReactions,
        defaultReaction: isMessageLocal(message)
          ? undefined
          : selectDefaultReaction(global, chatId),
        activeReactions: reactionMessage && activeReactions[reactionMessage.id],
        activeEmojiInteractions,
        hasUnreadReaction,
        isTranscribing:
          transcriptionId !== undefined &&
          global.transcriptions[transcriptionId]?.isPending,
        transcribedText:
          transcriptionId !== undefined
            ? global.transcriptions[transcriptionId]?.text
            : undefined,
        isPremium: selectIsCurrentUserPremium(global),
        animationLevel: global.settings.byKey.animationLevel,
        senderAdminMember,
        messageTopic,
        genericEffects: global.genericEmojiEffects,
        hasTopicChip,
        chatTranslations,
        areTranslationsEnabled: global.settings.byKey.canTranslate,
        requestedTranslationLanguage,
        hasLinkedChat: Boolean(chat?.fullInfo?.linkedChatId),
        aiPurchases,
        ...((canShowSender || isLocation) && { sender }),
        ...(isOutgoing &&
          isChatPrivate && {
            outgoingStatus: selectOutgoingStatus(
              global,
              message,
              messageListType === 'scheduled'
            ),
          }),
        ...(typeof uploadProgress === 'number' && { uploadProgress }),
        ...(isFocused && {
          focusDirection,
          noFocusHighlight,
          isResizingContainer,
          viewportIds: selectCurrentMessageIds(
            global,
            chatId,
            threadId,
            messageListType
          ),
        }),
        isChatPrivate,
        isBotSpace: isBotSpace(global, chatId),
      };
    }
  )(Message)
);
