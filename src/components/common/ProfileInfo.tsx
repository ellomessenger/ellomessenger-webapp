import type { ChangeEvent } from 'react';
import React, {
  FC,
  useEffect,
  useCallback,
  memo,
  useState,
  useMemo,
  useRef,
} from 'react';
import { getActions, withGlobal } from '../../global';

import type {
  ApiUser,
  ApiChat,
  ApiUserStatus,
  ApiTopic,
  ApiPhoto,
} from '../../api/types';
import type { GlobalState } from '../../global/types';
import type { AnimationLevel } from '../../types';
import { MediaViewerOrigin } from '../../types';

import { IS_TOUCH_ENV } from '../../util/windowEnvironment';
import { MEMO_EMPTY_ARRAY } from '../../util/memo';
import {
  selectTabState,
  selectChat,
  selectCurrentMessageList,
  selectThreadMessagesCount,
  selectUser,
  selectUserStatus,
} from '../../global/selectors';
import {
  getUserStatus,
  isChatChannel,
  isDeletedUser,
  isUserBot,
  isUserOnline,
} from '../../global/helpers';
import { captureEvents, SwipeDirection } from '../../util/captureEvents';
import renderText from './helpers/renderText';

import usePhotosPreload from './hooks/usePhotosPreload';
import usePrevious from '../../hooks/usePrevious';

import FullNameTitle from './FullNameTitle';
import ProfilePhoto from './ProfilePhoto';
import Transition from '../ui/Transition';
import TopicIcon from './TopicIcon';
import Avatar from './Avatar';

import './ProfileInfo.scss';
import styles from './ProfileInfo.module.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from '../ui/Button';
import IconSvg from '../ui/IconSvg';
import UploadProfilePhotoModal from './UploadProfilePhotoModal';
import DeleteProfilePhotoModal from './DeleteProfilePhotoModal';
import useFlag from '../../hooks/useFlag';
import CropModal from '../ui/CropModal';
import useLastCallback from '../../hooks/useLastCallback';

type OwnProps = {
  userId: string;
  forceShowSelf?: boolean;
  canPlayVideo: boolean;
};

type StateProps = {
  user?: ApiUser;
  userStatus?: ApiUserStatus;
  chat?: ApiChat;
  photos: ApiPhoto[];
  isSavedMessages?: boolean;
  animationLevel: AnimationLevel;
  mediaId?: number;
  avatarOwnerId?: string;
  topic?: ApiTopic;
  messagesCount?: number;
} & Pick<GlobalState, 'connectionState'>;

const EMOJI_STATUS_SIZE = 24;
const EMOJI_TOPIC_SIZE = 120;

const ProfileInfo: FC<OwnProps & StateProps> = ({
  forceShowSelf,
  canPlayVideo,
  user,
  userStatus,
  chat,
  photos,
  isSavedMessages,
  connectionState,
  animationLevel,
  mediaId,
  avatarOwnerId,
  topic,
  messagesCount,
}) => {
  const {
    loadFullUser,
    openMediaViewer,
    openPremiumModal,
    uploadProfilePhoto,
  } = getActions();
  const [isOpenConfirm, openConfirm, closeConfirm] = useFlag();
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useFlag();
  const inputRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const { id: userId } = user || {};
  const { id: chatId } = chat || {};

  const prevMediaId = usePrevious(mediaId);
  const prevAvatarOwnerId = usePrevious(avatarOwnerId);
  const [hasSlideAnimation, setHasSlideAnimation] = useState(true);
  const slideAnimation = hasSlideAnimation
    ? animationLevel >= 1
      ? isRtl
        ? 'slide-optimized-rtl'
        : 'slide-optimized'
      : 'none'
    : 'none';

  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const isDeleted = user && isDeletedUser(user);
  const isFirst =
    isSavedMessages || photos.length <= 1 || currentPhotoIndex === 0;
  const isLast =
    isSavedMessages ||
    photos.length <= 1 ||
    currentPhotoIndex === photos.length - 1;

  // Set the current avatar photo to the last selected photo in Media Viewer after it is closed
  useEffect(() => {
    if (
      prevAvatarOwnerId &&
      prevMediaId !== undefined &&
      mediaId === undefined
    ) {
      setHasSlideAnimation(false);
      setCurrentPhotoIndex(prevMediaId);
    }
  }, [mediaId, prevMediaId, prevAvatarOwnerId]);

  // Deleting the last profile photo may result in an error
  useEffect(() => {
    if (currentPhotoIndex > photos.length) {
      setCurrentPhotoIndex(Math.max(0, photos.length - 1));
    }
  }, [currentPhotoIndex, photos.length]);

  useEffect(() => {
    if (
      connectionState === 'connectionStateReady' &&
      userId &&
      !forceShowSelf
    ) {
      loadFullUser({ userId });
    }
  }, [userId, loadFullUser, connectionState, forceShowSelf]);

  usePhotosPreload(user || chat, photos, currentPhotoIndex);

  const handleProfilePhotoClick = useCallback(() => {
    openMediaViewer({
      avatarOwnerId: userId || chatId,
      mediaId: currentPhotoIndex,
      origin: forceShowSelf
        ? MediaViewerOrigin.SettingsAvatar
        : MediaViewerOrigin.ProfileAvatar,
    });
  }, [openMediaViewer, userId, chatId, currentPhotoIndex, forceShowSelf]);

  const handleClickPremium = useCallback(() => {
    if (!user) return;

    openPremiumModal({ fromUserId: user.id });
  }, [openPremiumModal, user]);

  const selectPreviousMedia = useCallback(() => {
    if (isFirst) {
      return;
    }
    setHasSlideAnimation(true);
    setCurrentPhotoIndex(currentPhotoIndex - 1);
  }, [currentPhotoIndex, isFirst]);

  const selectNextMedia = useCallback(() => {
    if (isLast) {
      return;
    }
    setHasSlideAnimation(true);
    setCurrentPhotoIndex(currentPhotoIndex + 1);
  }, [currentPhotoIndex, isLast]);

  function handleSelectFallbackPhoto() {
    if (!isFirst) return;
    setHasSlideAnimation(true);
    setCurrentPhotoIndex(photos.length - 1);
  }

  const handleAvatarCrop = useLastCallback((croppedImg: File) => {
    setSelectedFile(undefined);
    uploadProfilePhoto({ file: croppedImg, isFallback: true });
    closeConfirm();
  });

  function handleSelectFile(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    if (!target?.files?.[0]) {
      return;
    }
    setSelectedFile(target.files[0]);
    target.value = '';
  }

  const handleModalClose = useLastCallback(() => {
    setSelectedFile(undefined);
  });

  const selectInput = () => {
    if (inputRef.current) {
      //@ts-ignore
      inputRef.current.click();
    }
  };

  // Swipe gestures
  useEffect(() => {
    const element = document.querySelector<HTMLDivElement>(
      `.${styles.photoWrapper}`
    );
    if (!element) {
      return undefined;
    }

    return captureEvents(element, {
      selectorToPreventScroll: '.Profile, .settings-content',
      onSwipe: IS_TOUCH_ENV
        ? (e, direction) => {
            if (direction === SwipeDirection.Right) {
              selectPreviousMedia();
              return true;
            } else if (direction === SwipeDirection.Left) {
              selectNextMedia();
              return true;
            }

            return false;
          }
        : undefined,
    });
  }, [selectNextMedia, selectPreviousMedia]);

  if (!user && !chat) {
    return null;
  }

  function renderTopic() {
    return (
      <div className={styles.topicContainer}>
        <TopicIcon
          topic={topic!}
          size={EMOJI_TOPIC_SIZE}
          className={styles.topicIcon}
          letterClassName={styles.topicIconTitle}
          noLoopLimit
        />
        <h3 className={styles.topicTitle} dir={isRtl ? 'rtl' : undefined}>
          {renderText(topic!.title)}
        </h3>
        <p className={styles.topicMessagesCounter}>
          {messagesCount
            ? t('Chat.Title.Topic', { messagesCount })
            : t('lng_forum_no_messages')}
        </p>
      </div>
    );
  }

  function renderPhotoTabs() {
    if (isSavedMessages || !photos || photos.length <= 1) {
      return undefined;
    }

    return (
      <div className={styles.photoDashes}>
        {photos.map((_, i) => (
          <span
            key={i}
            className={classNames(
              styles.photoDash,
              i === currentPhotoIndex && styles.photoDash_current
            )}
          />
        ))}
      </div>
    );
  }

  function renderPhoto(isActive?: boolean) {
    const photo =
      !isSavedMessages && photos.length > 0
        ? photos[currentPhotoIndex]
        : undefined;

    return (
      <ProfilePhoto
        key={currentPhotoIndex}
        user={user}
        chat={chat}
        photo={photo}
        isSavedMessages={isSavedMessages}
        canPlayVideo={Boolean(isActive && canPlayVideo)}
        onClick={handleProfilePhotoClick}
      />
    );
  }

  function renderStatus() {
    if (user) {
      return (
        <div
          className={classNames(styles.status, 'status', {
            online: isUserOnline(user, userStatus),
          })}
        >
          <span className='user-status' dir='auto'>
            {getUserStatus(t, user, userStatus)}
          </span>
        </div>
      );
    }
    const count = chat!.membersCount ?? 0;
    return (
      <span className={classNames(styles.status, 'status')} dir='auto'>
        {isChatChannel(chat!)
          ? t('Channel.Members', { count })
          : t('Group.Members', { count })}
      </span>
    );
  }

  if (topic) {
    return renderTopic();
  }

  return (
    <div
      className={classNames('ProfileInfo', forceShowSelf && styles.self)}
      dir={isRtl ? 'rtl' : undefined}
    >
      <div className={styles.photoWrapper}>
        {renderPhotoTabs()}
        {!forceShowSelf && user?.fullInfo?.personalPhoto && (
          <div
            className={classNames(
              styles.fallbackPhoto,
              isFirst && styles.fallbackPhotoVisible
            )}
          >
            <div className={styles.fallbackPhotoContents}>
              {t(
                user.fullInfo.personalPhoto.isVideo
                  ? 'UserInfo.CustomVideo'
                  : 'UserInfo.CustomPhoto'
              )}
            </div>
          </div>
        )}
        {forceShowSelf && user?.fullInfo?.fallbackPhoto && (
          <div
            className={classNames(
              styles.fallbackPhoto,
              (isFirst || isLast) && styles.fallbackPhotoVisible
            )}
          >
            <div
              className={styles.fallbackPhotoContents}
              onClick={handleSelectFallbackPhoto}
            >
              {!isLast && (
                <Avatar
                  photo={user.fullInfo.fallbackPhoto}
                  className={styles.fallbackPhotoAvatar}
                  size='mini'
                />
              )}
              {t(
                user.fullInfo.fallbackPhoto.isVideo
                  ? 'UserInfo.PublicVideo'
                  : 'UserInfo.PublicPhoto'
              )}
            </div>
          </div>
        )}
        <Transition activeKey={currentPhotoIndex} name={slideAnimation}>
          {renderPhoto}
        </Transition>

        {!isFirst && (
          <button
            type='button'
            dir={isRtl ? 'rtl' : undefined}
            className={classNames(styles.navigation, styles.navigation_prev)}
            aria-label={String(t('AccDescrPrevious'))}
            onClick={selectPreviousMedia}
          />
        )}
        {!isLast && (
          <button
            type='button'
            dir={isRtl ? 'rtl' : undefined}
            className={classNames(styles.navigation, styles.navigation_next)}
            aria-label={String(t('Next'))}
            onClick={selectNextMedia}
          />
        )}
      </div>

      <div className={styles.info} dir={isRtl ? 'rtl' : 'auto'}>
        {(user || chat) && (
          <FullNameTitle
            peer={(user || chat)!}
            withEmojiStatus
            emojiStatusSize={EMOJI_STATUS_SIZE}
            isSavedMessages={isSavedMessages}
            onEmojiStatusClick={handleClickPremium}
            noLoopLimit
          />
        )}
        {user && !isUserBot(user) && !isSavedMessages && !isDeleted && (
          <p>
            {`${t(
              user.isBusiness ? 'UserInfo.Business' : 'UserInfo.Personal'
            )} (${t(
              user.isPublic ? 'UserInfo.Public' : 'UserInfo.Private'
            )})`}{' '}
            {user.isPublic && (
              <span>• @ {user?.usernames && user.usernames[0].username}</span>
            )}
          </p>
        )}
        {!isSavedMessages && !forceShowSelf && renderStatus()}
      </div>
      {user && user.isSelf && !isSavedMessages && (
        <Button
          className={styles.button}
          round
          size='smaller'
          color='dark'
          onClick={photos.length ? openConfirm : selectInput}
        >
          <i className='icon-svg'>
            <IconSvg name='add-foto' />
          </i>
        </Button>
      )}
      <input
        ref={inputRef}
        type='file'
        className='hidden'
        onChange={handleSelectFile}
        accept='image/png, image/jpeg'
      />
      <UploadProfilePhotoModal
        isOpen={isOpenConfirm}
        onClose={closeConfirm}
        confirmHandler={selectInput}
        deleteHandler={openDeleteModal}
      />
      <DeleteProfilePhotoModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        profileId={userId! || chatId!}
        photo={photos[currentPhotoIndex] || user?.fullInfo?.personalPhoto}
      />
      <CropModal
        file={selectedFile}
        onClose={handleModalClose}
        onChange={handleAvatarCrop}
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { userId, forceShowSelf }): StateProps => {
    const { connectionState } = global;
    const user = selectUser(global, userId);
    const userStatus = selectUserStatus(global, userId);
    const chat = selectChat(global, userId);
    const isSavedMessages = !forceShowSelf && user && user.isSelf;
    const { animationLevel } = global.settings.byKey;
    const { mediaId, avatarOwnerId } = selectTabState(global).mediaViewer;
    const isForum = chat?.isForum;
    const { threadId: currentTopicId } = selectCurrentMessageList(global) || {};
    const topic =
      isForum && currentTopicId ? chat?.topics?.[currentTopicId] : undefined;
    const photos = user?.photos || chat?.photos || MEMO_EMPTY_ARRAY;

    return {
      connectionState,
      user,
      userStatus,
      chat,
      isSavedMessages,
      animationLevel,
      mediaId,
      photos,
      avatarOwnerId,
      ...(topic && {
        topic,
        messagesCount: selectThreadMessagesCount(
          global,
          userId,
          currentTopicId!
        ),
      }),
    };
  })(ProfileInfo)
);
