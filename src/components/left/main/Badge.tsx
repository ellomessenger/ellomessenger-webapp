import React, { FC, memo, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';

import type { ApiChat, ApiTopic } from '../../../api/types';

import { formatIntegerCompact } from '../../../util/textFormat';

import AnimatedCounter from '../../common/AnimatedCounter';

import './Badge.scss';
import classNames from 'classnames';
import ShowTransition from '../../ui/ShowTransition';
import IconSvg from '../../ui/IconSvg';

type OwnProps = {
  chat: ApiChat;
  topic?: ApiTopic;
  wasTopicOpened?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isFeed?: boolean;
  shouldShowOnlyMostImportant?: boolean;
  forceHidden?: boolean;
};

const Badge: FC<OwnProps> = ({
  topic,
  chat,
  isPinned,
  isMuted,
  isFeed,
  shouldShowOnlyMostImportant,
  wasTopicOpened,
  forceHidden,
}) => {
  const { unreadMentionsCount = 0, unreadReactionsCount = 0 } = !chat.isForum
    ? chat
    : {}; // TODO[forums] Unread mentions and reactions temporarily disabled for forums

  const isTopicUnopened = !isPinned && topic && !wasTopicOpened;
  const isForum = chat.isForum && !topic;
  const topicsWithUnread = useMemo(
    () =>
      isForum && chat?.topics
        ? Object.values(chat.topics).filter(({ unreadCount }) => unreadCount)
        : undefined,
    [chat, isForum]
  );

  const unreadCount = useMemo(
    () =>
      isForum
        ? // If we have unmuted topics, display the count of those. Otherwise, display the count of all topics.
          (isMuted &&
            topicsWithUnread?.filter((acc) => acc.isMuted === false).length) ||
          topicsWithUnread?.length
        : (topic || chat).unreadCount,
    [chat, topic, topicsWithUnread, isForum, isMuted]
  );

  const shouldBeMuted = useMemo(() => {
    const hasUnmutedUnreadTopics =
      chat.topics &&
      Object.values(chat.topics).some((acc) => acc.isMuted && acc.unreadCount);

    return isMuted || (chat.topics && !hasUnmutedUnreadTopics);
  }, [chat, isMuted]);

  const hasUnreadMark = topic ? false : chat.hasUnreadMark;

  const isShown =
    !forceHidden &&
    Boolean(
      unreadCount ||
        unreadMentionsCount ||
        hasUnreadMark ||
        isPinned ||
        unreadReactionsCount ||
        isTopicUnopened
    );

  const isUnread = Boolean(unreadCount || hasUnreadMark);
  const className = classNames('Badge', {
    muted: shouldBeMuted,
    unread: isUnread,
  });

  function renderContent() {
    const unreadReactionsElement = unreadReactionsCount && (
      <div className={classNames('Badge reaction', { muted: shouldBeMuted })}>
        <i className='icon-svg'>
          <IconSvg name='heart' w='16' h='16' />
        </i>
      </div>
    );

    const unreadMentionsElement = unreadMentionsCount && (
      <div className='Badge mention'>
        <i className='icon-svg'>
          <IconSvg name='mention' w='16' h='17' />
        </i>
      </div>
    );

    const unopenedTopicElement = isTopicUnopened && (
      <div className={classNames('Badge unopened', { muted: shouldBeMuted })} />
    );

    const unreadCountElement =
      hasUnreadMark || unreadCount ? (
        <div key='count' className={className}>
          {!hasUnreadMark && (
            <AnimatedCounter text={formatIntegerCompact(unreadCount!)} />
          )}
        </div>
      ) : undefined;

    const pinnedElement = isPinned && (
      <i className='icon-svg'>
        <IconSvg name='badge-pin' />
      </i>
    );

    const elements = [
      unopenedTopicElement,
      unreadReactionsElement,
      unreadMentionsElement,
      unreadCountElement,
    ].filter(Boolean);

    if (elements.length === 0 && !pinnedElement) return undefined;

    //if (elements.length === 1) return elements[0];

    if (shouldShowOnlyMostImportant) {
      const importanceOrderedElements = [
        unreadMentionsElement,
        unreadCountElement,
        unreadReactionsElement,
      ].filter(Boolean);
      return importanceOrderedElements[0];
    }

    return (
      <div className='Badge-wrapper'>
        {pinnedElement}
        {!isFeed && elements}
      </div>
    );
  }

  return (
    <ShowTransition
      isCustom
      className='opacity-transition zoom-in'
      isOpen={isShown}
    >
      {renderContent()}
    </ShowTransition>
  );
};

export default memo(Badge);
