import React, { FC, memo } from 'react';

import type { MessageListType } from '../../global/types';
import type { ApiTopic } from '../../api/types';
import type { LangFn } from '../../hooks/useLang';

import { REM } from '../common/helpers/mediaDimensions';
import renderText from '../common/helpers/renderText';

import TopicIcon from '../common/TopicIcon';

import './NoMessages.scss';
import { useTranslation } from 'react-i18next';
import NoMessageImg from '../../assets/images/no_message.png';
import AnimatedIcon from '../common/AnimatedIcon';
import { STICKER_SIZE_HELLO } from '../../config';
import { LOCAL_TGS_URLS } from '../common/helpers/animatedAssets';

const ICON_SIZE = 3 * REM;

type OwnProps = {
  chatId: string;
  isChatWithSelf?: boolean;
  type: MessageListType;
  isGroupChatJustCreated?: boolean;
  topic?: ApiTopic;
};

const NoMessages: FC<OwnProps> = ({
  isChatWithSelf,
  type,
  isGroupChatJustCreated,
  topic,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  if (type === 'scheduled') {
    return renderScheduled(t);
  }

  if (isChatWithSelf) {
    return renderSavedMessages(t);
  }

  if (isGroupChatJustCreated) {
    return renderGroup(t, isRtl);
  }

  if (topic) {
    return renderTopic(t, topic);
  }

  return (
    <div className='empty'>
      <span>{t('NoMessages')}</span>
    </div>
  );
};

function renderTopic(lang: LangFn, topic: ApiTopic) {
  return (
    <div className='NoMessages'>
      <div className='wrapper'>
        <TopicIcon topic={topic} size={ICON_SIZE} className='icon topic-icon' />
        <h3 className='title'>{lang('Chat.EmptyTopicPlaceholder.Title')}</h3>
        <p className='description topic-description'>
          {renderText(lang('Chat.EmptyTopicPlaceholder.Text'), ['br'])}
        </p>
      </div>
    </div>
  );
}

function renderScheduled(lang: LangFn) {
  return (
    <div className='empty'>
      <span>{lang('ScheduledMessages.EmptyPlaceholder')}</span>
    </div>
  );
}

function renderSavedMessages(lang: LangFn) {
  return (
    <div className='NoMessages'>
      <div className='wrapper'>
        <AnimatedIcon
          tgsUrl={LOCAL_TGS_URLS.ShareDone}
          size={STICKER_SIZE_HELLO}
        />
        <h3 className='title'>{lang('CloudStorageInfo.Title')}</h3>
        <ul className='description'>
          <li>• {lang('CloudStorageInfo.Description1')}</li>
          <li>• {lang('CloudStorageInfo.Description2')}</li>
          <li>• {lang('CloudStorageInfo.Description3')}</li>
          <li>• {lang('CloudStorageInfo.Description4')}</li>
        </ul>
      </div>
    </div>
  );
}

function renderGroup(lang: LangFn, isRtl: boolean) {
  return (
    <div className='NoMessages'>
      <div className='wrapper' dir={isRtl ? 'rtl' : undefined}>
        <AnimatedIcon
          tgsUrl={LOCAL_TGS_URLS.Hello1}
          size={STICKER_SIZE_HELLO}
        />
        <h4 className='title'>{lang('EmptyGroupInfo.Title')}</h4>
        <p className='description'>{lang('EmptyGroupInfo.Subtitle')}</p>
        <ul className='list-checkmarks'>
          <li>{lang('EmptyGroupInfo.Line1')}</li>
          <li>{lang('EmptyGroupInfo.Line2')}</li>
          <li>{lang('EmptyGroupInfo.Line3')}</li>
          <li>{lang('EmptyGroupInfo.Line4')}</li>
        </ul>
      </div>
    </div>
  );
}

export default memo(NoMessages);
