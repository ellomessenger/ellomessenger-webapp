import type { MouseEvent as ReactMouseEvent } from 'react';
import React, { FC, memo, useCallback, useRef, ReactNode } from 'react';

import type {
  ApiChat,
  ApiChatValue,
  ApiPhoto,
  ApiUser,
  ApiUserStatus,
} from '../../api/types';
import type { ObserveFn } from '../../hooks/useIntersectionObserver';
import { ApiMediaFormat } from '../../api/types';

import {
  getChatAvatarHash,
  getChatTitle,
  getUserColorKey,
  getUserFullName,
  isUserId,
  isChatWithRepliesBot,
  isDeletedUser,
  isUserOnline,
} from '../../global/helpers';
import { getFirstLetters } from '../../util/textFormat';
import renderText from './helpers/renderText';
import useMedia from '../../hooks/useMedia';
import {
  AI_BOT_BUSINESS,
  AI_BOT_CANCER,
  AI_BOT_ID,
  AI_BOT_PHOENIX,
  IS_TEST,
  SERVICE_NOTIFICATIONS_USER_ID,
  SUPPORT_USER_ID,
} from '../../config';
import OptimizedVideo from '../ui/OptimizedVideo';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { createClassNameBuilder } from '../../util/buildClassName';
import IconSvgSettings from '../middle/settings/icons/IconSvgSettings';

import './Avatar.scss';
import IconSvg from '../ui/IconSvg';
import useUniqueId from '../../hooks/useUniqueId';
import PhoenixImg from '../../assets/icons/Phoenix_Suns_Logo.svg';
import CanserLogo from '../../assets/icons/cancer.svg';
import BusinessLogo from '../../assets/icons/ai-business.svg';

const LOOP_COUNT = 3;
export type AvatarSize =
  | 'micro'
  | 'tiny'
  | 'mini'
  | 'small'
  | 'small-mobile'
  | 'medium'
  | 'large'
  | 'jumbo';

const cn = createClassNameBuilder('Avatar');
cn.media = cn('media');
cn.icon = cn('icon');

type OwnProps = {
  className?: string;
  size?: AvatarSize;
  peer?: ApiChat | ApiUser | ApiChatValue;
  photo?: ApiPhoto;
  userStatus?: ApiUserStatus;
  text?: string;
  isSavedMessages?: boolean;
  withVideo?: boolean;
  noLoop?: boolean;
  loopIndefinitely?: boolean;
  noPersonalPhoto?: boolean;
  lastSyncTime?: number;
  observeIntersection?: ObserveFn;
  onClick?: (
    e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
    hasMedia: boolean
  ) => void;
};

const Avatar: FC<OwnProps> = ({
  className,
  size = 'large',
  peer,
  photo,
  userStatus,
  text,
  isSavedMessages,
  withVideo,
  noLoop,
  loopIndefinitely,
  lastSyncTime,
  noPersonalPhoto,
  observeIntersection,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const videoLoopCountRef = useRef(0);
  const isPeerChat = peer && 'title' in peer;
  const user = peer && !isPeerChat ? (peer as ApiUser) : undefined;
  const chat = peer && isPeerChat ? (peer as ApiChat) : undefined;
  const isDeleted = user && isDeletedUser(user);
  const customId = useUniqueId();

  const isReplies = user && isChatWithRepliesBot(user.id);
  const isAiBot = peer?.id === AI_BOT_ID;
  const isSupportBot = peer?.id === SUPPORT_USER_ID;
  const isServiceBot = peer?.id === SERVICE_NOTIFICATIONS_USER_ID;
  const isPhoenixBot = peer?.id === AI_BOT_PHOENIX;
  const isCanserBot = peer?.id === AI_BOT_CANCER;
  const isBusinessBot = peer?.id === AI_BOT_BUSINESS;

  const isForum = chat?.isForum;
  let imageHash: string | undefined;
  let videoHash: string | undefined;

  const shouldLoadVideo = withVideo && photo?.isVideo;
  const profilePhoto =
    user?.fullInfo?.personalPhoto ||
    user?.fullInfo?.profilePhoto ||
    user?.fullInfo?.fallbackPhoto;
  const hasProfileVideo = profilePhoto?.isVideo;

  const shouldFetchBig = size === 'jumbo';
  if (!isSavedMessages && !isDeleted) {
    if (user && !noPersonalPhoto) {
      imageHash = getChatAvatarHash(user, shouldFetchBig ? 'big' : undefined);
    } else if (chat) {
      imageHash = getChatAvatarHash(chat, shouldFetchBig ? 'big' : undefined);
    } else if (photo) {
      imageHash = `photo${photo.id}?size=m`;
      if (photo.isVideo && withVideo) {
        videoHash = `videoAvatar${photo.id}?size=u`;
      }
    }

    if (hasProfileVideo) {
      videoHash = getChatAvatarHash(user!, undefined, 'video');
    }
  }

  const imgBlobUrl = useMedia(
    imageHash,
    false,
    ApiMediaFormat.BlobUrl,
    lastSyncTime
  );
  const videoBlobUrl = useMedia(
    videoHash,
    !shouldLoadVideo,
    ApiMediaFormat.BlobUrl,
    lastSyncTime
  );
  const hasBlobUrl = Boolean(imgBlobUrl || videoBlobUrl);
  // `videoBlobUrl` can be taken from memory cache, so we need to check `shouldLoadVideo` again
  const shouldPlayVideo = Boolean(videoBlobUrl && shouldLoadVideo);

  const handleVideoEnded = useCallback(
    (e: { currentTarget: any }) => {
      const video = e.currentTarget;
      if (!videoBlobUrl) return;

      if (loopIndefinitely) return;

      videoLoopCountRef.current += 1;
      if (videoLoopCountRef.current >= LOOP_COUNT || noLoop) {
        video.style.display = 'none';
      }
    },
    [loopIndefinitely, noLoop, videoBlobUrl]
  );

  const { t } = useTranslation();

  let content: ReactNode;
  const author = user
    ? getUserFullName(user)
    : chat
    ? getChatTitle(t, chat)
    : text;

  if (isSavedMessages) {
    content = (
      <i
        className={classNames(cn.icon, 'icon-svg')}
        role='img'
        aria-label={author}
      >
        <IconSvgSettings name='cloud' w='32' h='32' />
      </i>
    );
  } else if (isDeleted) {
    content = (
      <i
        className={classNames(cn.icon, 'icon-svg avatar-deleted-account')}
        role='img'
        aria-label={author}
      >
        <IconSvg name='avatar-deleted' />
      </i>
    );
  } else if (isReplies) {
    content = (
      <i
        className={classNames(cn.icon, 'icon-svg avatar-forward')}
        role='img'
        aria-label={author}
      >
        <IconSvg name='avatar-forward' />
      </i>
    );
  } else if (hasBlobUrl) {
    content = (
      <>
        <img
          src={imgBlobUrl}
          className={classNames(cn.media, 'avatar-media', {
            poster: videoBlobUrl,
          })}
          alt={author}
          decoding='async'
        />
        {shouldPlayVideo && (
          <OptimizedVideo
            canPlay
            src={videoBlobUrl}
            className={classNames(cn.media, 'avatar-media', 'poster')}
            muted
            loop={loopIndefinitely}
            autoPlay
            disablePictureInPicture
            playsInline
            onEnded={handleVideoEnded}
          />
        )}
      </>
    );
  } else if (isAiBot) {
    content = (
      <i
        className={classNames(cn.icon, 'icon-svg avatar-bot')}
        role='img'
        aria-label={author}
      >
        <IconSvg id={customId} name='ai-bot' w='54' h='54' />
      </i>
    );
  } else if (isSupportBot) {
    content = (
      <i
        className={classNames(cn.icon, 'icon-svg')}
        role='img'
        aria-label={author}
      >
        <IconSvg name='support-bot' w='54' h='48' />
      </i>
    );
  } else if (isServiceBot) {
    content = (
      <i
        className={classNames(cn.icon, 'icon-svg')}
        role='img'
        aria-label={author}
      >
        <IconSvg name='ello-logo' />
      </i>
    );
  } else if (isPhoenixBot) {
    content = (
      <img
        src={PhoenixImg}
        className={classNames(cn.media, 'avatar-media')}
        alt={author}
        decoding='async'
      />
    );
  } else if (isCanserBot) {
    content = (
      <img
        src={CanserLogo}
        className={classNames(cn.media, 'avatar-media')}
        alt={author}
        decoding='async'
      />
    );
  } else if (isBusinessBot) {
    content = (
      <img
        src={BusinessLogo}
        className={classNames(cn.media, 'avatar-media')}
        alt={author}
        decoding='async'
      />
    );
  } else if (user) {
    const userFullName = getUserFullName(user);
    content = userFullName ? getFirstLetters(userFullName, 2) : undefined;
  } else if (chat) {
    const title = getChatTitle(t, chat);
    content = title && getFirstLetters(title, isUserId(chat.id) ? 2 : 1);
  } else if (text) {
    content = getFirstLetters(text, 2);
  }

  const isOnline =
    !isSavedMessages && user && userStatus && isUserOnline(user, userStatus);
  const fullClassName = classNames(
    `Avatar size-${size}`,
    className,
    `color-bg-${getUserColorKey(user || chat)}`,
    {
      'saved-messages': isSavedMessages,
      'deleted-account': isDeleted,
      'replies-bot-account': isReplies,
      forum: isForum,
      online: isOnline,
      interactive: !!onClick,
      'no-photo': !isSavedMessages && !imgBlobUrl,
      'no-bg': isAiBot || isSupportBot,
    }
  );

  const hasMedia = Boolean(isSavedMessages || imgBlobUrl);
  const handleClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
      if (onClick) {
        onClick(e, hasMedia);
      }
    },
    [onClick, hasMedia]
  );

  const senderId = (user || chat) && (user || chat)!.id;

  return (
    <div
      ref={ref}
      className={fullClassName}
      onClick={handleClick}
      data-test-sender-id={IS_TEST ? senderId : undefined}
      aria-label={typeof content === 'string' ? author : undefined}
    >
      {typeof content === 'string'
        ? renderText(content, [size === 'jumbo' ? 'hq_emoji' : 'emoji'])
        : content}
    </div>
  );
};

export default memo(Avatar);
