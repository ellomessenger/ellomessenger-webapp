import React, { FC, memo, useEffect, useState } from 'react';
import { ApiChat } from '../../../api/types';
import { getActions, withGlobal } from '../../../global';
import { selectChat } from '../../../global/selectors';
import Avatar from '../../common/Avatar';
import FullNameTitle from '../../common/FullNameTitle';
import { useTranslation } from 'react-i18next';
import Switcher from '../../ui/Switcher';
import useLastCallback from '../../../hooks/useLastCallback';
import { GlobalState } from '../../../global/types';

type OwnProps = {
  chatId: string;
  tab: string;
};

type StateProps = {
  chat?: ApiChat;
} & Pick<GlobalState, 'feedFilter'>;

const FeedItem: FC<StateProps & OwnProps> = ({
  chat,
  chatId,
  tab,
  feedFilter,
}) => {
  const { toggleFeedChatHidden, toggleFeedChatPinned } = getActions();
  const { hidden = [], pinned = [] } = feedFilter || {};
  const [checked, setChecked] = useState<boolean | undefined>(false);
  const { t } = useTranslation();

  if (!chat) return undefined;

  const handleChangeSwitch = useLastCallback(() => {
    let newArr: string[] | undefined;
    if (tab === 'hidden') {
      toggleFeedChatHidden({ chatId });
    } else if (tab === 'pinned') {
      toggleFeedChatPinned({ chatId });
    }
  });

  useEffect(() => {
    if (hidden || pinned)
      if (tab === 'hidden') {
        setChecked(hidden?.includes(chatId));
      } else {
        setChecked(pinned?.includes(chatId));
      }
  }, [hidden, pinned, chatId]);

  return (
    <div className='feed-item'>
      <div className='status'>
        <Avatar peer={chat} withVideo />
      </div>
      <div className='info'>
        <div className='info-row'>
          {<FullNameTitle peer={chat} withEmojiStatus />}
        </div>
        <div className='subtitle'>
          <div className='last-message'>
            {t('Channel.Subscribers', { count: chat?.membersCount || 0 })}
          </div>
        </div>
      </div>
      <Switcher
        name={`${tab}_${chatId}`}
        label={`${tab}-${chatId}`}
        color='reverse'
        has_icon
        checked={checked}
        onChange={handleChangeSwitch}
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const { feedFilter } = global;
    const chat = selectChat(global, chatId);
    return {
      chat,
      feedFilter,
    };
  })(FeedItem)
);
