import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ApiAvailableReaction,
  ApiChat,
  ApiMessage,
  ApiReaction,
  ApiThreadInfo,
} from '../../../api/types';
import classNames from 'classnames';
import useShowTransition from '../../../hooks/useShowTransition';
import useFlag from '../../../hooks/useFlag';
import {
  getMessageContent,
  getMessageCustomShape,
  getMessageHtmlId,
  hasMessageText,
  isMessageLocal,
} from '../../../global/helpers';

import FullNameTitle from '../../common/FullNameTitle';
import { getActions, withGlobal } from '../../../global';
import {
  selectCanAutoLoadMedia,
  selectCanAutoPlayMedia,
  selectChat,
  selectChatMessage,
  selectChatTranslations,
  selectDefaultReaction,
  selectIsCurrentUserPremium,
  selectIsDownloading,
  selectIsMessageProtected,
  selectIsMessageSelected,
  selectMessageIdsByGroupId,
  selectRequestedTranslationLanguage,
  selectTabState,
  selectTheme,
  selectThreadInfo,
  selectUploadProgress,
} from '../../../global/selectors';
import Avatar from '../../common/Avatar';
import useAppLayout from '../../../hooks/useAppLayout';
import useInnerHandlers from '../../middle/message/hooks/useInnerHandlers';
import { useTranslation } from 'react-i18next';
import {
  AnimationLevel,
  AudioOrigin,
  IAlbum,
  ISettings,
  ThreadId,
} from '../../../types';
import MessageText from '../../common/MessageText';
import useMessageTranslation from '../message/hooks/useMessageTranslation';
import { ActiveReaction, ChatTranslatedMessages } from '../../../global/types';
import usePrevious from '../../../hooks/usePrevious';
import { getCustomEmojiSize } from '../composer/helpers/customEmoji';
import { ObserveFn } from '../../../hooks/useIntersectionObserver';
import Video from '../message/Video';
import {
  MIN_MEDIA_WIDTH_WITH_COMMENTS,
  calculateMediaDimensions,
  getMinMediaWidth,
} from '../message/helpers/mediaDimensions';
import {
  ROUND_VIDEO_DIMENSIONS_PX,
  calculateDimensionsForMessageMedia,
} from '../../common/helpers/mediaDimensions';
import { buildContentClassName } from '../message/helpers/buildContentClassName';
import '../../middle/message/Message.scss';
import ListItem from '../../ui/ListItem';
import Album from '../message/Album';
import { calculateAlbumLayout } from '../message/helpers/calculateAlbumLayout';
import Photo from '../message/Photo';
import RoundVideo from '../message/RoundVideo';
import Document from '../../common/Document';
import Audio from '../../common/Audio';
import WebPage from '../message/WebPage';
import Invoice from '../message/Invoice';
import MessageMeta from '../message/MessageMeta';
import Location from '../message/Location';
import CommentButton from '../message/CommentButton';
import ReportModal from '../../common/ReportModal';
import Contact from '../message/Contact';
import InvoiceMediaPreview from '../message/InvoiceMediaPreview';
import Reactions from '../message/Reactions';
import Likes from '../message/Likes';

type MessagePositionProperties = {
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  isFirstInDocumentGroup: boolean;
  isLastInDocumentGroup: boolean;
  isLastInList: boolean;
};

type OwnProps = {
  threadId: ThreadId;
  message: ApiMessage;
  appearanceOrder: number;
  album?: IAlbum;
  observeIntersectionForBottom: ObserveFn;
  observeIntersectionForLoading: ObserveFn;
  observeIntersectionForPlaying: ObserveFn;
} & MessagePositionProperties;

type StateProps = {
  chat?: ApiChat;
  animationLevel: AnimationLevel;
  requestedTranslationLanguage?: string;
  chatTranslations?: ChatTranslatedMessages;
  canAutoLoadMedia?: boolean;
  canAutoPlayMedia?: boolean;
  uploadProgress?: number;
  lastSyncTime?: number;
  isDownloading: boolean;
  isProtected?: boolean;
  isInDocumentGroup: boolean;
  theme: ISettings['theme'];
  hasLinkedChat: boolean;
  autoLoadFileMaxSizeMb: number;
  isSelected?: boolean;
  reactionMessage?: ApiMessage;
  defaultReaction?: ApiReaction;
  repliesThreadInfo?: ApiThreadInfo;
  isTranscribing?: boolean;
  transcribedText?: string;
  isPremium: boolean;
  availableReactions?: ApiAvailableReaction[];
  activeReactions?: ActiveReaction[];
};

const NO_MEDIA_CORNERS_THRESHOLD = 18;
const APPEARANCE_DELAY = 10;

const MessageFeed: FC<OwnProps & StateProps> = ({
  message,
  appearanceOrder,
  chat,
  threadId,
  album,
  theme,
  hasLinkedChat,
  requestedTranslationLanguage,
  chatTranslations,
  canAutoLoadMedia,
  canAutoPlayMedia,
  uploadProgress,
  lastSyncTime,
  isDownloading,
  isProtected,
  isInDocumentGroup,
  autoLoadFileMaxSizeMb,
  isSelected,
  reactionMessage,
  availableReactions,
  activeReactions,
  defaultReaction,
  repliesThreadInfo,
  isTranscribing,
  transcribedText,
  isPremium,
  isLastInGroup,
  isFirstInGroup,
  isFirstInDocumentGroup,
  isLastInDocumentGroup,
  isLastInList,
  observeIntersectionForBottom,
  observeIntersectionForLoading,
  observeIntersectionForPlaying,
}) => {
  const {
    toggleMessageSelection,
    toggleFeedChatHidden,
    openChat,
    focusMessage,
  } = getActions();
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { isMobile } = useAppLayout();
  const { t } = useTranslation();

  const [isTranscriptionHidden, setTranscriptionHidden] = useState(false);
  const noAppearanceAnimation = appearanceOrder <= 0;
  const [isShown, markShown] = useFlag(noAppearanceAnimation);
  const [isReportModalOpen, openReportModal, closeReportModal] = useFlag();

  const { transitionClassNames } = useShowTransition(
    isShown,
    undefined,
    noAppearanceAnimation,
    false
  );

  const { id: messageId, chatId, isTranscriptionError } = message;
  const hasText = hasMessageText(message);
  const emojiSize = getCustomEmojiSize(message.emojiOnlyCount);

  const { isPending: isTranslationPending, translatedText } =
    useMessageTranslation(
      chatTranslations,
      chatId,
      messageId,
      requestedTranslationLanguage
    );
  const previousTranslatedText = usePrevious(translatedText, true);
  const currentTranslatedText = translatedText || previousTranslatedText;
  const isCustomShape = getMessageCustomShape(message);

  const isAlbum = message.isInAlbum;
  const isInDocumentGroupNotFirst =
    isInDocumentGroup && !isFirstInDocumentGroup;
  const isInDocumentGroupNotLast = isInDocumentGroup && !isLastInDocumentGroup;

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

  const handleClickHeader = useCallback(() => {
    //openChat({ id: chatId, shouldReplaceHistory: true, fromFeed: true });
    focusMessage({
      chatId,
      messageId,
      shouldReplaceHistory: true,
      fromFeed: true,
    });
  }, []);

  const reportMessageIds = useMemo(
    () => (album ? album.messages : [message]).map(({ id }) => id),
    [album, message]
  );

  const {
    handleMediaClick,
    handleAlbumMediaClick,
    handleCancelUpload,
    handleAudioPlay,
    handleReadMedia,
  } = useInnerHandlers(
    t,
    selectMessage,
    message,
    chatId,
    threadId,
    isInDocumentGroup,
    false,
    false,
    false,
    album
  );

  let contentWidth: number | undefined;
  let calculatedWidth;
  let noMediaCorners = false;

  const albumLayout = useMemo(() => {
    return isAlbum
      ? calculateAlbumLayout(false, false, false, album!, isMobile, true)
      : undefined;
  }, [isAlbum, album, isMobile]);

  const currentText = isTranslationPending
    ? previousTranslatedText || text
    : translatedText;

  if (!isAlbum && (photo || video || invoice?.extendedMedia)) {
    let width: number | undefined;
    if (photo) {
      width = calculateMediaDimensions(message, isMobile).width;
    } else if (video) {
      if (video.isRound) {
        width = ROUND_VIDEO_DIMENSIONS_PX;
      } else {
        width = calculateMediaDimensions(message, isMobile).width;
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
        fromOwnMessage: false,
        isMobile,
      }).width;
    }

    if (width) {
      if (width < MIN_MEDIA_WIDTH_WITH_COMMENTS) {
        contentWidth = width;
      }
      calculatedWidth = Math.max(
        getMinMediaWidth(Boolean(currentText), true),
        width
      );
      if (
        invoice?.extendedMedia &&
        calculatedWidth - width > NO_MEDIA_CORNERS_THRESHOLD
      ) {
        noMediaCorners = true;
      }
    }
  }

  function renderReactionsAndMeta() {
    const meta = (
      <MessageMeta
        message={message}
        availableReactions={availableReactions}
        isTranslated={Boolean(
          requestedTranslationLanguage ? currentTranslatedText : undefined
        )}
        onClick={() => true}
        onTranslationClick={() => true}
        onOpenThread={() => true}
        isGroup={false}
        metaPosition='standalone'
        reactions={reactionMessage!}
      />
    );

    // return (
    //   <Reactions
    //     activeReactions={activeReactions}
    //     message={reactionMessage!}
    //     metaChildren={meta}
    //     availableReactions={availableReactions}
    //     observeIntersection={observeIntersectionForPlaying}
    //   />
    // );

    return (
      <>
        <Likes
          message={reactionMessage!}
          defaultReaction={defaultReaction!}
          metaChildren={meta}
          chatId={chatId}
        />
      </>
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
        observeIntersectionForLoading={observeIntersectionForLoading}
        observeIntersectionForPlaying={observeIntersectionForPlaying}
        withTranslucentThumbs={isCustomShape}
      />
    );
  }

  function renderContent() {
    const className = classNames('content-inner', {
      'full-width': photo || location || video,
    });
    const textContentClass = classNames('text-content');
    return (
      <div className={className} dir='auto'>
        {hasText && (
          <>
            <div className={textContentClass} dir='auto'>
              {renderMessageText()}
              {isTranslationPending && (
                <div className='translation-animation'>
                  <div className='text-loading'>{renderMessageText(true)}</div>
                </div>
              )}
            </div>
          </>
        )}
        {isAlbum && (
          <Album
            album={album!}
            albumLayout={albumLayout!}
            observeIntersection={observeIntersectionForLoading}
            isProtected={isProtected}
            lastSyncTime={lastSyncTime}
            onMediaClick={handleAlbumMediaClick}
            isOwn={false}
          />
        )}
        {!isAlbum && photo && (
          <Photo
            message={message}
            observeIntersection={observeIntersectionForLoading}
            canAutoLoad={canAutoLoadMedia}
            uploadProgress={uploadProgress}
            isDownloading={isDownloading}
            isProtected={isProtected}
            theme={theme}
            forcedWidth={contentWidth}
            onClick={handleMediaClick}
            onCancelUpload={handleCancelUpload}
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
            canAutoLoad={canAutoLoadMedia}
            canAutoPlay={canAutoPlayMedia}
            uploadProgress={uploadProgress}
            lastSyncTime={lastSyncTime}
            isDownloading={isDownloading}
            isProtected={isProtected}
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
            noAvatars={true}
            onPlay={handleAudioPlay}
            onReadMedia={voice && handleReadMedia}
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
        {invoice?.extendedMedia && (
          <InvoiceMediaPreview message={message} lastSyncTime={lastSyncTime} />
        )}

        {webPage && (
          <WebPage
            message={message}
            observeIntersection={observeIntersectionForLoading}
            noAvatars={true}
            canAutoLoad={canAutoLoadMedia}
            canAutoPlay={canAutoPlayMedia}
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
            isSelected={isSelected}
            theme={theme}
            forcedWidth={contentWidth}
          />
        )}
        {location && (
          <Location message={message} isSelected={isSelected} theme={theme} />
        )}
      </div>
    );
  }

  const withCommentButton =
    repliesThreadInfo && hasLinkedChat && !isInDocumentGroupNotLast;

  const containerClassName = classNames(
    'Message Message-feed no-avatars message-list-item',
    transitionClassNames,
    {
      'first-in-group': isFirstInGroup,
      'last-in-group': isLastInGroup,
      'first-in-document-group': isFirstInDocumentGroup,
      'last-in-document-group': isLastInDocumentGroup,
      'last-in-list': isLastInList,
      'is-in-document-group': isInDocumentGroup,
    }
  );

  const contentClassName = buildContentClassName(message, {
    isLastInGroup: true,
    isFeed: true,
  });

  const actionsArray = useMemo(() => {
    return [
      {
        title: t('Channel.Hidden'),
        icon: 'sticker',
        handler: () => toggleFeedChatHidden({ chatId: chatId }),
      },
      {
        title: t('ReportPeer.Report'),
        icon: 'error',
        handler: openReportModal,
      },
    ];
  }, []);

  useEffect(() => {
    if (noAppearanceAnimation) {
      return;
    }

    setTimeout(markShown, appearanceOrder * APPEARANCE_DELAY);
  }, [appearanceOrder, markShown, noAppearanceAnimation]);

  return (
    <div
      ref={ref}
      id={`${getMessageHtmlId(message.id)}${chatId}`}
      className={containerClassName}
      data-message-id={`${messageId}${chatId}`}
    >
      <div className='message-content-wrapper can-select-text is-channel'>
        <div ref={contentRef} className={contentClassName} dir='auto'>
          {(!isInDocumentGroup || isFirstInDocumentGroup || isFirstInGroup) && (
            <ListItem
              secondaryIcon='filled'
              onClick={handleClickHeader}
              ripple
              contextActions={actionsArray}
            >
              <div className='status'>
                <Avatar
                  size={isMobile ? 'small-mobile' : 'small'}
                  peer={chat}
                  withVideo
                />
              </div>
              <div className='info'>
                <FullNameTitle peer={chat} />
                {chat?.usernames?.length && (
                  <span className='text-primary'>{`@${
                    chat.usernames![0].username
                  }`}</span>
                )}
              </div>
            </ListItem>
          )}
          {renderContent()}
          {!isInDocumentGroupNotLast && renderReactionsAndMeta()}
          {withCommentButton && (
            <CommentButton
              threadInfo={repliesThreadInfo!}
              disabled={!hasLinkedChat}
            />
          )}
          <div
            className='svg-appendix'
            dangerouslySetInnerHTML={APPENDIX_NOT_OWN}
          />
        </div>
      </div>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        messageIds={reportMessageIds}
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>(
    (global, { message, album, isLastInDocumentGroup }): StateProps => {
      const { id, chatId, repliesThreadInfo, transcriptionId } = message;
      const { lastSyncTime, availableReactions } = global;

      const { activeReactions } = selectTabState(global);

      const chat = selectChat(global, chatId);

      const requestedTranslationLanguage = selectRequestedTranslationLanguage(
        global,
        chatId,
        message.id
      );
      const chatTranslations = selectChatTranslations(global, chatId);
      const uploadProgress = selectUploadProgress(global, message);
      const isDownloading = selectIsDownloading(global, message);
      const isInDocumentGroup =
        Boolean(message.groupedId) && !message.isInAlbum;
      const hasLinkedChat =
        chat && chat.fullInfo && 'linkedChatId' in chat.fullInfo
          ? Boolean(chat.fullInfo.linkedChatId)
          : false;

      let isSelected: boolean;
      if (album?.messages) {
        isSelected = album.messages.every(({ id: messageId }) =>
          selectIsMessageSelected(global, messageId)
        );
      } else {
        isSelected = selectIsMessageSelected(global, id);
      }

      const documentGroupFirstMessageId = isInDocumentGroup
        ? selectMessageIdsByGroupId(global, chatId, message.groupedId!)![0]
        : undefined;

      const reactionMessage = isInDocumentGroup
        ? isLastInDocumentGroup
          ? selectChatMessage(global, chatId, documentGroupFirstMessageId!)
          : undefined
        : message;

      const actualRepliesThreadInfo = repliesThreadInfo
        ? selectThreadInfo(
            global,
            repliesThreadInfo.chatId,
            repliesThreadInfo.threadId!
          ) || repliesThreadInfo
        : undefined;

      return {
        chat,
        animationLevel: global.settings.byKey.animationLevel,
        requestedTranslationLanguage,
        chatTranslations,
        canAutoLoadMedia: selectCanAutoLoadMedia(global, message),
        canAutoPlayMedia: selectCanAutoPlayMedia(global, message),
        lastSyncTime,
        isDownloading,
        isInDocumentGroup,
        isSelected,
        hasLinkedChat,
        isTranscribing:
          transcriptionId !== undefined &&
          global.transcriptions[transcriptionId]?.isPending,
        transcribedText:
          transcriptionId !== undefined
            ? global.transcriptions[transcriptionId]?.text
            : undefined,
        theme: selectTheme(global),
        isProtected: selectIsMessageProtected(global, message),
        autoLoadFileMaxSizeMb: global.settings.byKey.autoLoadFileMaxSizeMb,
        ...(typeof uploadProgress === 'number' && { uploadProgress }),
        defaultReaction: isMessageLocal(message)
          ? undefined
          : selectDefaultReaction(global, chatId),
        activeReactions: reactionMessage && activeReactions[reactionMessage.id],
        reactionMessage,
        availableReactions,
        repliesThreadInfo: actualRepliesThreadInfo,
        isPremium: selectIsCurrentUserPremium(global),
      };
    }
  )(MessageFeed)
);

const APPENDIX_NOT_OWN = {
  __html:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 35"><g filter="url(#appendix-not-own)"><path fill="#fff" fill-rule="evenodd" d="m17 30.675-5.94-17.563V13c0 15.689-7.66 18.673-10.007 19.587L1 32.608a28.536 28.536 0 0 0 16-1.933Z" clip-rule="evenodd"/></g><defs><filter id="appendix-not-own" width="18" height="36" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1"/><feGaussianBlur stdDeviation=".5"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2_53331"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2_53331" result="shape"/></filter></defs></svg>',
};
