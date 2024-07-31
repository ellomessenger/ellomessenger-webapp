import React, { FC, memo, useCallback, useMemo } from 'react';
import { getActions, getGlobal } from '../../../global';

import type {
  ApiChat,
  ApiCommentsInfo,
  ApiThreadInfo,
  ApiUser,
} from '../../../api/types';

import { isUserId } from '../../../global/helpers';
import { formatIntegerCompact } from '../../../util/textFormat';

import Avatar from '../../common/Avatar';
import AnimatedCounter from '../../common/AnimatedCounter';

import './CommentButton.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';
import useLastCallback from '../../../hooks/useLastCallback';
import buildClassName from '../../../util/buildClassName';
import useAsyncRendering from '../../right/hooks/useAsyncRendering';
import { selectPeer } from '../../../global/selectors';

const SHOW_LOADER_DELAY = 450;

type OwnProps = {
  threadInfo: ApiThreadInfo;
  disabled?: boolean;
  isLoading?: boolean;
  isCustomShape?: boolean;
};

const CommentButton: FC<OwnProps> = ({
  isCustomShape,
  threadInfo,
  disabled,
  isLoading,
}) => {
  const { openThread } = getActions();

  const shouldRenderLoading = useAsyncRendering([isLoading], SHOW_LOADER_DELAY);

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const {
    threadId,
    chatId,
    messagesCount,
    lastMessageId,
    lastReadInboxMessageId,
    recentReplierIds,
    originChannelId,
  } = threadInfo;

  const handleClick = useLastCallback(() => {
    if (originChannelId) {
      openThread({
        isComments: true,
        chatId,
        originMessageId: Number(threadId),
        originChannelId,
      });
    }
  });

  const recentRepliers = useMemo(() => {
    if (!recentReplierIds?.length) {
      return undefined;
    }

    // No need for expensive global updates on chats and users, so we avoid them
    const global = getGlobal();

    return recentReplierIds
      .map((peerId) => {
        return selectPeer(global, peerId);
      })
      .filter(Boolean);
  }, [recentReplierIds]);

  function renderRecentRepliers() {
    return (
      recentRepliers &&
      recentRepliers.length > 0 && (
        <div className='recent-repliers' dir={isRtl ? 'rtl' : 'ltr'}>
          {recentRepliers.map((user) => (
            <Avatar
              key={user.id}
              size='mini'
              peer={isUserId(user.id) ? (user as ApiUser) : (user as ApiChat)}
            />
          ))}
        </div>
      )
    );
  }

  const hasUnread = Boolean(
    lastReadInboxMessageId &&
      lastMessageId &&
      lastReadInboxMessageId < lastMessageId
  );

  const commentsText = messagesCount && (
    <>
      <AnimatedCounter text={formatIntegerCompact(messagesCount)} />{' '}
      {t('Comments', { count: messagesCount })}
    </>
  );
  return (
    <div
      data-cnt={formatIntegerCompact(messagesCount)}
      className={classNames('CommentButton', {
        'has-unread': hasUnread,
        'CommentButton-custom-shape': isCustomShape,
        disabled,
      })}
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={handleClick}
    >
      <i
        className={buildClassName(
          'icon-svg comments-sticker',
          isLoading && shouldRenderLoading && 'CommentButton_hidden'
        )}
        aria-hidden
      >
        <IconSvg name='comment' />
      </i>
      {!recentRepliers?.length && (
        <i className='icon-svg icon-svg-comments'>
          <IconSvg name='comment' />
        </i>
      )}
      {renderRecentRepliers()}
      <div className='label' dir='auto'>
        {messagesCount ? commentsText : t('LeaveAComment')}
      </div>
      <i className='icon-next' />
    </div>
  );
};

export default memo(CommentButton);
