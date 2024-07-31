import React, { FC, memo, useMemo } from 'react';
import { getActions } from '../../../global';

import type {
  ApiAvailableReaction,
  ApiMessage,
  ApiMessageOutgoingStatus,
  ApiThreadInfo,
} from '../../../api/types';

import {
  formatDateTimeToString,
  formatPastTimeShort,
  formatTime,
} from '../../../util/dateFormat';
import { formatIntegerCompact } from '../../../util/textFormat';

import renderText from '../../common/helpers/renderText';

import useFlag from '../../../hooks/useFlag';

import MessageOutgoingStatus from '../../common/MessageOutgoingStatus';
import AnimatedCounter from '../../common/AnimatedCounter';

import './MessageMeta.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';

type OwnProps = {
  message: ApiMessage;
  withReactionOffset?: boolean;
  outgoingStatus?: ApiMessageOutgoingStatus;
  signature?: string;
  availableReactions?: ApiAvailableReaction[];
  noReplies?: boolean;
  repliesThreadInfo?: ApiThreadInfo;
  isTranslated?: boolean;
  isPinned?: boolean;
  withFullDate?: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTranslationClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onOpenThread: NoneToVoidFunction;
  isGroup: boolean;
  metaPosition: string;
  reactions: ApiMessage;
};

const MessageMeta: FC<OwnProps> = ({
  message,
  outgoingStatus,
  signature,
  withReactionOffset,
  repliesThreadInfo,
  noReplies,
  isTranslated,
  isPinned,
  withFullDate,
  onClick,
  onTranslationClick,
  onOpenThread,
  isGroup,
  metaPosition,
  reactions,
}) => {
  const { showNotification } = getActions();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const [isActivated, markActivated] = useFlag();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    showNotification({
      message: t('ImportedInfo'),
    });
  };

  function handleOpenThread(e: React.MouseEvent) {
    e.stopPropagation();
    onOpenThread();
  }

  const title = useMemo(() => {
    if (!isActivated) return undefined;
    const createDateTime = formatDateTimeToString(
      message.date * 1000,
      i18n.language,
      undefined
    ); //lang.timeFormat
    const editDateTime =
      message.isEdited &&
      formatDateTimeToString(message.editDate! * 1000, i18n.language); //lang.timeFormat
    const forwardedDateTime =
      message.forwardInfo &&
      formatDateTimeToString(message.forwardInfo.date * 1000, i18n.language); //lang.timeFormat

    let text = createDateTime;
    if (editDateTime) {
      text += '\n';
      text += t('lng_edited_date').replace('{date}', editDateTime);
    }
    if (forwardedDateTime) {
      text += '\n';
      text += t('lng_forwarded_date').replace('{date}', forwardedDateTime);
    }

    return text;
    // We need to listen to timeformat change
    // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  }, [isActivated, message]); //lang.timeFormat

  const date = useMemo(() => {
    const time = formatTime(t, message.date * 1000);
    if (!withFullDate) {
      return time;
    }

    return formatDateTimeToString(
      message.date * 1000,
      i18n.language,
      true,
      true
    );
  }, [t, message.date, message.forwardInfo?.date, withFullDate]);

  const fullClassName = classNames('MessageMeta', {
    'reactions-offset': withReactionOffset,
    'is-imported': message.forwardInfo?.isImported,
    'custom-group-time': isGroup && metaPosition !== 'in-text',
    'custom-group-time-in-text':
      isGroup &&
      metaPosition === 'in-text' &&
      reactions.reactions?.results.length,
    'custom-group-time-in-text-with-reaction':
      isGroup &&
      metaPosition === 'in-text' &&
      !reactions.reactions?.results.length,
  });

  function formatDayToStringWithCache(
    arg0: number,
    language: string,
    arg2: boolean
  ): React.ReactNode | Iterable<React.ReactNode> {
    throw new Error('Function not implemented.');
  }

  return (
    <span
      className={fullClassName}
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={onClick}
      data-ignore-on-paste
    >
      {isTranslated && (
        <i
          className='icon-language message-translated'
          onClick={onTranslationClick}
        />
      )}
      {Boolean(message.views) && (
        <>
          <i className='icon-swg'>
            <IconSvg name='eye-bold' />
          </i>
          <span className='message-views'>
            {formatIntegerCompact(message.views!)}
          </span>
        </>
      )}
      {!noReplies && Boolean(repliesThreadInfo?.messagesCount) && (
        <span onClick={handleOpenThread} className='message-replies-wrapper'>
          <span className='message-replies'>
            <AnimatedCounter
              text={formatIntegerCompact(repliesThreadInfo!.messagesCount!)}
            />
          </span>
          <i className='icon-reply-filled' />
        </span>
      )}
      {isPinned && <i className='icon-pinned-message message-pinned' />}
      {signature && (
        <span className='message-signature'>{renderText(signature)}</span>
      )}
      <span className='message-time' title={title} onMouseEnter={markActivated}>
        {message.forwardInfo?.isImported && (
          <>
            <span className='message-imported' onClick={handleClick}>
              {formatDateTimeToString(
                message.forwardInfo.date * 1000,
                i18n.language,
                true
              )}
            </span>
            <span className='message-imported' onClick={handleClick}>
              {t('ImportedMessage')}
            </span>
          </>
        )}
        {message.isEdited && `${t('EditedMessage')} `}
        {date}
      </span>
      {outgoingStatus && <MessageOutgoingStatus status={outgoingStatus} />}
    </span>
  );
};

export default memo(MessageMeta);
