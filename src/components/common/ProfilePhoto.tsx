import React, { FC, ReactNode, memo, useEffect, useRef } from 'react';

import type { ApiChat, ApiPhoto, ApiUser } from '../../api/types';

import { IS_CANVAS_FILTER_SUPPORTED } from '../../util/windowEnvironment';
import {
  getChatAvatarHash,
  getChatTitle,
  getUserColorKey,
  getUserFullName,
  isUserId,
  isChatWithRepliesBot,
  isDeletedUser,
  getVideoAvatarMediaHash,
  isUserBot,
} from '../../global/helpers';
import renderText from './helpers/renderText';
import { getFirstLetters } from '../../util/textFormat';
import useMedia from '../../hooks/useMedia';
import useFlag from '../../hooks/useFlag';
import useMediaTransition from '../../hooks/useMediaTransition';
import useCanvasBlur from '../../hooks/useCanvasBlur';
import useAppLayout from '../../hooks/useAppLayout';

import Spinner from '../ui/Spinner';
import OptimizedVideo from '../ui/OptimizedVideo';

import './ProfilePhoto.scss';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import IconSvg from '../ui/IconSvg';
import { AI_BOT_ID, AI_BOT_PHOENIX, SUPPORT_USER_ID } from '../../config';
import IconSvgSettings from '../middle/settings/icons/IconSvgSettings';
import PhoenixImg from '../../assets/icons/Phoenix_Suns_Logo.svg';

type OwnProps = {
  chat?: ApiChat;
  user?: ApiUser;
  isSavedMessages?: boolean;
  photo?: ApiPhoto;
  lastSyncTime?: number;
  canPlayVideo: boolean;
  onClick: NoneToVoidFunction;
};

const ProfilePhoto: FC<OwnProps> = ({
  chat,
  user,
  photo,
  isSavedMessages,
  canPlayVideo,
  lastSyncTime,
  onClick,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { t } = useTranslation();
  const { isMobile } = useAppLayout();

  const isDeleted = user && isDeletedUser(user);
  const isRepliesChat = chat && isChatWithRepliesBot(chat.id);
  const isBot = user && isUserBot(user);
  const peer = user || chat;

  const canHaveMedia = peer && !isSavedMessages && !isDeleted && !isRepliesChat;
  const { isVideo } = photo || {};

  const avatarHash = canHaveMedia && getChatAvatarHash(peer, 'normal');

  const avatarBlobUrl = useMedia(avatarHash);

  const photoHash =
    canHaveMedia && photo && !isVideo && `photo${photo.id}?size=c`;
  const photoBlobUrl = useMedia(photoHash);

  const videoHash =
    canHaveMedia && photo && isVideo && getVideoAvatarMediaHash(photo);
  const videoBlobUrl = useMedia(videoHash);

  const fullMediaData = videoBlobUrl || photoBlobUrl;
  const [isVideoReady, markVideoReady] = useFlag();
  const isFullMediaReady = Boolean(fullMediaData && (!isVideo || isVideoReady));
  const transitionClassNames = useMediaTransition(isFullMediaReady);
  const isBlurredThumb =
    canHaveMedia &&
    !isFullMediaReady &&
    !avatarBlobUrl &&
    photo?.thumbnail?.dataUri;
  const blurredThumbCanvasRef = useCanvasBlur(
    photo?.thumbnail?.dataUri,
    !isBlurredThumb,
    isMobile && !IS_CANVAS_FILTER_SUPPORTED
  );
  //
  const hasMedia = photo || avatarBlobUrl || isBlurredThumb;

  useEffect(() => {
    if (videoRef.current && !canPlayVideo) {
      videoRef.current.currentTime = 0;
    }
  }, [canPlayVideo]);

  let content: ReactNode | undefined;

  if (isSavedMessages) {
    content = (
      <i className='icon-svg'>
        <IconSvgSettings name='cloud' w='160' h='160' />
      </i>
    );
  } else if (isDeleted) {
    content = (
      <i className='icon-svg'>
        <IconSvg name='avatar-deleted' w='160' h='160' />
      </i>
    );
  } else if (isRepliesChat) {
    content = (
      <i className='icon-svg'>
        <IconSvg name='avatar-forward' w='160' h='160' />
      </i>
    );
  } else if (hasMedia) {
    content = (
      <>
        {isBlurredThumb ? (
          <canvas ref={blurredThumbCanvasRef} className='thumb' />
        ) : (
          <img src={avatarBlobUrl} className='thumb' alt='' />
        )}
        {photo &&
          (isVideo ? (
            <OptimizedVideo
              canPlay={canPlayVideo}
              elRef={videoRef}
              src={fullMediaData}
              className={classNames('avatar-media', transitionClassNames)}
              muted
              disablePictureInPicture
              loop
              playsInline
              onReady={markVideoReady}
            />
          ) : (
            <img
              src={fullMediaData}
              className={classNames('avatar-media', transitionClassNames)}
              alt=''
            />
          ))}
      </>
    );
  } else if (user) {
    if (user.id === AI_BOT_ID) {
      content = <IconSvg name='ai-bot' w='240' h='240' />;
    } else if (user.id === SUPPORT_USER_ID) {
      content = <IconSvg name='support-bot' w='240' h='240' />;
    } else if (user.id === AI_BOT_PHOENIX) {
      content = <img src={PhoenixImg} className='thumb' alt='' />;
    } else {
      content = '';
    }
  } else if (chat) {
    const title = getChatTitle(t, chat);
    content = title && getFirstLetters(title, isUserId(chat.id) ? 2 : 1);
  } else {
    content = (
      <div className='spinner-wrapper'>
        <Spinner color='white' />
      </div>
    );
  }

  const fullClassName = classNames(
    'ProfilePhoto',
    `color-bg-${getUserColorKey(user || chat)}`,
    {
      'saved-messages': isSavedMessages,
      'deleted-account': isDeleted,
      'replies-bot-account': isRepliesChat,
      'no-photo': !isSavedMessages && !hasMedia && !isBot,
      'no-bg': isBot,
      'phoenix-bg': user?.id === AI_BOT_PHOENIX,
      user,
    }
  );

  return (
    <div className={fullClassName} onClick={hasMedia ? onClick : undefined}>
      {typeof content === 'string'
        ? renderText(content, ['hq_emoji'])
        : content}
    </div>
  );
};

export default memo(ProfilePhoto);
