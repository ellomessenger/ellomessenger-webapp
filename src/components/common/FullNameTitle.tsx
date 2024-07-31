import React, { FC, memo, useMemo } from 'react';

import type { ApiChat, ApiUser } from '../../api/types';
import type { ObserveFn } from '../../hooks/useIntersectionObserver';

import { EMOJI_STATUS_LOOP_LIMIT } from '../../config';
import renderText from './helpers/renderText';
import {
  getChatTitle,
  getUserFullName,
  isChatAdult,
  isChatCourse,
  isChatPublic,
  isChatSubscription,
  isChatSuperGroup,
  isUserId,
} from '../../global/helpers';

import VerifiedIcon from './VerifiedIcon';
import FakeIcon from './FakeIcon';
import CustomEmoji from './CustomEmoji';
import PremiumIcon from './PremiumIcon';

import styles from './FullNameTitle.module.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../ui/IconSvg';

type OwnProps = {
  peer: ApiChat | ApiUser | undefined;
  className?: string;
  noVerified?: boolean;
  noFake?: boolean;
  withEmojiStatus?: boolean;
  emojiStatusSize?: number;
  isSavedMessages?: boolean;
  noLoopLimit?: boolean;
  onEmojiStatusClick?: NoneToVoidFunction;
  observeIntersection?: ObserveFn;
};

const FullNameTitle: FC<OwnProps> = ({
  className,
  peer,
  noVerified,
  noFake,
  withEmojiStatus,
  emojiStatusSize,
  isSavedMessages,
  noLoopLimit,
  onEmojiStatusClick,
  observeIntersection,
}) => {
  const { t } = useTranslation();
  const isUser = peer && isUserId(peer.id);
  const isPeerChat = peer && 'title' in peer;
  const chat = peer && isPeerChat ? (peer as ApiChat) : undefined;

  const title = isUser
    ? getUserFullName(peer as ApiUser)
    : getChatTitle(t, peer as ApiChat);

  const emojiStatus = isUser && (peer as ApiUser).emojiStatus;
  const isPremium = isUser && (peer as ApiUser).isPremium;
  const isChannelPublic = useMemo(() => !!chat && isChatPublic(chat), [chat]);
  const isChannelSubscription = useMemo(
    () => !!chat && isChatSubscription(chat),
    [chat]
  );
  const isChannelCourse = useMemo(() => !!chat && isChatCourse(chat), [chat]);
  const isAdult = useMemo(() => !!chat && isChatAdult(chat), [chat]);
  const isGroup = useMemo(() => !!chat && isChatSuperGroup(chat), [chat]);

  if (isSavedMessages) {
    return (
      <div className={classNames('title', styles.root, className)}>
        <h3>{t('SavedMessages')}</h3>
      </div>
    );
  }

  return (
    <div className={classNames('title', styles.root, className)}>
      {!isChannelPublic && !isUser && <IconSvg name='lock' />}
      {isChannelSubscription && <IconSvg name='channel' />}
      {isChannelCourse && <IconSvg name='online-course-outline' />}
      {isAdult && <IconSvg name='adult' />}
      <h3 dir='auto' className='fullName'>
        {renderText(title || '')}
      </h3>
      {!noVerified && peer && peer!.isVerified && <VerifiedIcon />}
      {!noFake && peer && peer!.fakeType && (
        <FakeIcon fakeType={peer!.fakeType} />
      )}
      {withEmojiStatus && emojiStatus && (
        <CustomEmoji
          documentId={emojiStatus.documentId}
          size={emojiStatusSize}
          loopLimit={!noLoopLimit ? EMOJI_STATUS_LOOP_LIMIT : undefined}
          observeIntersectionForLoading={observeIntersection}
          onClick={onEmojiStatusClick}
        />
      )}
      {withEmojiStatus && !emojiStatus && isPremium && <PremiumIcon />}
    </div>
  );
};

export default memo(FullNameTitle);
