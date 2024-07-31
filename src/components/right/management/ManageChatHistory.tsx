import React, {
  FC,
  ChangeEvent,
  memo,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { getActions } from '../../../global';

import type { ApiChat } from '../../../api/types';

import useHistoryBack from '../../../hooks/useHistoryBack';

import RadioGroup from '../../ui/RadioGroup';
import { useTranslation } from 'react-i18next';
import useLastCallback from '../../../hooks/useLastCallback';

enum EHistoryType {
  visible = 'visible',
  hidden = 'hidden',
}

type OwnProps = {
  chat: ApiChat;
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

const ManageChatHistory: FC<OwnProps> = ({ isActive, chat, onClose }) => {
  const { togglePreHistoryHidden } = getActions();
  const [historyHidden, setHistoryHidden] = useState(
    chat?.fullInfo?.isPreHistoryHidden
  );
  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const handleOptionChange = useLastCallback(
    (value: string, e: ChangeEvent<HTMLInputElement>) => {
      setHistoryHidden(value === EHistoryType.hidden);
    }
  );

  useEffect(() => {
    togglePreHistoryHidden({
      chatId: chat.id,
      isEnabled: Boolean(historyHidden)!,
    });
  }, [historyHidden]);

  const { t } = useTranslation();

  const options = [
    {
      value: EHistoryType.visible,
      label: t('GroupInfo.HistoryVisible'),
      subLabel: t('GroupInfo.HistoryVisibleDescription'),
    },
    {
      value: EHistoryType.hidden,
      label: t('GroupInfo.HistoryHidden'),
      subLabel: t('GroupInfo.HistoryHiddenDescription'),
    },
  ];

  return (
    <div className='Management'>
      <div className='custom-scroll'>
        <div className='section'>
          <h4 className='section-heading'>{t('ChatHistory')}</h4>
          <RadioGroup
            selected={
              historyHidden ? EHistoryType.hidden : EHistoryType.visible
            }
            name='edit-channel-type'
            options={options}
            onChange={handleOptionChange}
            size='smaller'
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ManageChatHistory);
