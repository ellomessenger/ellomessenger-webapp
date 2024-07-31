import React, { FC, useEffect, useCallback, memo, useMemo } from 'react';
import { getActions, withGlobal } from '../../global';

import type {
  ApiUser,
  ApiTypingStatus,
  ApiUserStatus,
  ApiChatMember,
} from '../../api/types';
import type { GlobalState } from '../../global/types';
import type { AnimationLevel } from '../../types';
import { MediaViewerOrigin } from '../../types';

import {
  selectChatMessages,
  selectUser,
  selectUserStatus,
} from '../../global/selectors';
import {
  getMainUsername,
  getUserStatus,
  isUserOnline,
} from '../../global/helpers';
import renderText from './helpers/renderText';

import Avatar from './Avatar';
import TypingStatus from './TypingStatus';
import DotAnimation from './DotAnimation';
import FullNameTitle from './FullNameTitle';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  userId: string;
  typingStatus?: ApiTypingStatus;
  avatarSize?: 'tiny' | 'small' | 'medium' | 'large' | 'jumbo';
  forceShowSelf?: boolean;
  status?: string;
  withDots?: boolean;
  withMediaViewer?: boolean;
  withUsername?: boolean;
  withFullInfo?: boolean;
  withUpdatingStatus?: boolean;
  withVideoAvatar?: boolean;
  emojiStatusSize?: number;
  noStatusOrTyping?: boolean;
  noRtl?: boolean;
  adminMember?: ApiChatMember;
};

type StateProps = {
  user?: ApiUser;
  userStatus?: ApiUserStatus;
  isSavedMessages?: boolean;
  animationLevel: AnimationLevel;
  areMessagesLoaded: boolean;
} & Pick<GlobalState, 'lastSyncTime'>;

const PrivateChatInfo: FC<OwnProps & StateProps> = ({
  typingStatus,
  avatarSize = 'medium',
  status,
  withDots,
  withMediaViewer,
  withUsername,
  withFullInfo,
  withUpdatingStatus,
  withVideoAvatar,
  emojiStatusSize,
  noStatusOrTyping,
  noRtl,
  user,
  userId,
  userStatus,
  isSavedMessages,
  areMessagesLoaded,
  animationLevel,
  lastSyncTime,
  adminMember,
}) => {
  const { loadFullUser, openMediaViewer, loadProfilePhotos, loadUser } =
    getActions();

  //const { id: userId } = user || {};

  useEffect(() => {
    if (userId && lastSyncTime) {
      if (withFullInfo) loadFullUser({ userId });
      if (withMediaViewer) loadProfilePhotos({ profileId: userId });
    }
  }, [
    userId,
    loadFullUser,
    loadProfilePhotos,
    lastSyncTime,
    withFullInfo,
    withMediaViewer,
  ]);

  useEffect(() => {
    if (!user) {
      loadUser({ userId });
    }
  }, [user]);

  const handleAvatarViewerOpen = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, hasMedia: boolean) => {
      if (user && hasMedia) {
        e.stopPropagation();
        openMediaViewer({
          avatarOwnerId: user.id,
          mediaId: 0,
          origin:
            avatarSize === 'jumbo'
              ? MediaViewerOrigin.ProfileAvatar
              : MediaViewerOrigin.MiddleHeaderAvatar,
        });
      }
    },
    [user, avatarSize, openMediaViewer]
  );

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const mainUsername = useMemo(
    () => user && withUsername && getMainUsername(user),
    [user, withUsername]
  );

  if (!user) {
    return null;
  }

  const stringUserStatus = getUserStatus(t, user, userStatus);

  function renderStatusOrTyping() {
    if (status) {
      return withDots ? (
        <DotAnimation className='status' content={status} />
      ) : (
        <span className='status' dir='auto'>
          {renderText(status)}
        </span>
      );
    }

    if (withUpdatingStatus && !areMessagesLoaded) {
      return <DotAnimation className='status' content={t('Updating')} />;
    }

    if (!user) {
      return undefined;
    }

    if (typingStatus) {
      return <TypingStatus typingStatus={typingStatus} />;
    }

    return (
      <span
        className={classNames('status', {
          online: isUserOnline(user, userStatus),
        })}
      >
        {mainUsername && <span className='handle'>{mainUsername}</span>}
        {stringUserStatus && (
          <span className='user-status' dir='auto'>
            {stringUserStatus}
          </span>
        )}
      </span>
    );
  }

  const customTitle = adminMember
    ? adminMember.customTitle ||
      t(adminMember.isOwner ? 'GroupInfo.LabelOwner' : 'GroupInfo.LabelAdmin')
    : undefined;

  function renderNameTitle() {
    if (customTitle) {
      return (
        <div className='info-name-title'>
          <FullNameTitle
            peer={user!}
            withEmojiStatus
            emojiStatusSize={emojiStatusSize}
            isSavedMessages={isSavedMessages}
          />
          {customTitle && <span className='custom-title'>{customTitle}</span>}
        </div>
      );
    }

    return (
      <FullNameTitle
        peer={user!}
        withEmojiStatus
        emojiStatusSize={emojiStatusSize}
        isSavedMessages={isSavedMessages}
      />
    );
  }

  return (
    <div className='ChatInfo' dir={!noRtl && isRtl ? 'rtl' : undefined}>
      <Avatar
        key={user.id}
        size={avatarSize}
        peer={user}
        userStatus={userStatus}
        isSavedMessages={isSavedMessages}
        onClick={withMediaViewer ? handleAvatarViewerOpen : undefined}
        withVideo={withVideoAvatar}
      />

      <div className='info'>
        {renderNameTitle()}
        {(status || (!isSavedMessages && !noStatusOrTyping)) &&
          renderStatusOrTyping()}
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { userId, forceShowSelf }): StateProps => {
    const { lastSyncTime } = global;
    const user = selectUser(global, userId);
    const userStatus = selectUserStatus(global, userId);
    const isSavedMessages = !forceShowSelf && user && user.isSelf;
    const areMessagesLoaded = Boolean(selectChatMessages(global, userId));

    return {
      lastSyncTime,
      user,
      userStatus,
      isSavedMessages,
      areMessagesLoaded,
      animationLevel: global.settings.byKey.animationLevel,
    };
  })(PrivateChatInfo)
);
