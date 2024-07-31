import React, { ChangeEvent, FC, memo, useCallback, useState } from 'react';

import { ApiChat, ApiExportedInvite, ApiUser } from '../../../api/types';
import './SettingsInvitationLink.scss';
import { getActions, withGlobal } from '../../../global';
import { selectChat, selectTabState } from '../../../global/selectors';
import { useTranslation } from 'react-i18next';
import RangeSlider from '../../ui/RangeSlider';
import Button from '../../ui/Button';
import InputText from '../../ui/InputText';
import { formatHumanDate, formatTimeDuration } from '../../../util/dateFormat';
import useHistoryBack from '../../../hooks/useHistoryBack';
import { getServerTime } from '../../../util/serverTime';
import { ManagementScreens, SettingsScreens } from '../../../types';
import useSyncEffect from '../../../hooks/useSyncEffect';

type StateProps = {
  chat?: ApiChat;
  currentUserId?: string;
  editingInvite?: ApiExportedInvite;
};

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
  onScreenSelect: (screen: SettingsScreens) => void;
};

const DEFAULT_USAGE_LIMITS = [1, 10, 50, 100, 0];
const DEFAULT_EXPIRE_DATE = [3600, 86400, 604800, 0];

const COUNT_USERS = ['1', '10', '50', '100', 'No limit'];

const TIME_LIMIT = ['1 hour', '1 Day', '1 Week', 'No limit'];

const SettingsInvitationLink: FC<StateProps & OwnProps> = ({
  chat,
  isActive,
  editingInvite,
  onReset,
  onScreenSelect,
}) => {
  const { editExportedChatInvite, exportChatInvite } = getActions();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [customTimeLimit, setCustomTimeLimit] = useState(TIME_LIMIT);
  const [customDefaultExpireDate, setCustomDefaultExpireDate] =
    useState(DEFAULT_EXPIRE_DATE);
  const [isRequestNeeded, setIsRequestNeeded] = useState(false);

  const [selectedExpireOption, setSelectedExpireOption] = useState(
    TIME_LIMIT.length - 1
  );
  const [selectedUsageOption, setSelectedUsageOption] = useState(
    COUNT_USERS.length - 1
  );
  const [isSubmitBlocked, setIsSubmitBlocked] = useState(false);
  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  if (!chat) return null;

  const handleSaveClick = useCallback(() => {
    setIsSubmitBlocked(true);
    const usageLimit = DEFAULT_USAGE_LIMITS[selectedUsageOption];
    let expireDate;
    if (Boolean(customDefaultExpireDate[selectedExpireOption])) {
      expireDate =
        getServerTime() + customDefaultExpireDate[selectedExpireOption];
    } else {
      expireDate = 0;
    }

    if (editingInvite) {
      editExportedChatInvite({
        link: editingInvite.link,
        chatId: chat.id,
        title,
        isRequestNeeded,
        expireDate,
        usageLimit,
      });
    } else {
      exportChatInvite({
        chatId: chat.id,
        title,
        isRequestNeeded,
        expireDate,
        usageLimit,
      });
    }
    setIsSubmitBlocked(false);
    onScreenSelect(SettingsScreens.InvitationLink);
  }, [
    chat,
    editExportedChatInvite,
    editingInvite,
    exportChatInvite,
    isRequestNeeded,
    selectedExpireOption,
    selectedUsageOption,
    title,
    onScreenSelect,
  ]);

  useSyncEffect(
    ([oldEditingInvite]) => {
      if (oldEditingInvite === editingInvite) return;

      if (!editingInvite) {
        setTitle('');
        setSelectedExpireOption(TIME_LIMIT.length - 1);
        setSelectedUsageOption(COUNT_USERS.length - 1);
        setIsRequestNeeded(false);
      } else {
        const {
          title: editingTitle,
          usageLimit,
          expireDate,
          isRequestNeeded: editingIsRequestNeeded,
        } = editingInvite;
        setTitle(editingTitle || '');

        setSelectedUsageOption(
          usageLimit
            ? DEFAULT_USAGE_LIMITS.indexOf(usageLimit)
            : COUNT_USERS.length - 1
        );

        if (expireDate) {
          const customExpire = expireDate - getServerTime();
          let shouldSkip = false;
          DEFAULT_EXPIRE_DATE.forEach((time, idx) => {
            if (shouldSkip) return;
            if (customExpire < time) {
              setCustomTimeLimit([
                ...TIME_LIMIT.slice(0, idx),
                formatHumanDate(t, expireDate * 1000, true, undefined, true),
                ...TIME_LIMIT.slice(idx),
              ]);
              setCustomDefaultExpireDate([
                ...DEFAULT_EXPIRE_DATE.slice(0, idx),
                customExpire,
                ...DEFAULT_EXPIRE_DATE.slice(idx),
              ]);
              setSelectedExpireOption(idx);
              shouldSkip = true;
              return;
            }
          });
        } else {
          setCustomTimeLimit(TIME_LIMIT);
          setSelectedExpireOption(TIME_LIMIT.length - 1);
        }
        if (editingIsRequestNeeded) {
          setIsRequestNeeded(true);
        }
      }
    },
    [editingInvite]
  );

  return (
    <div className='settings-invitation'>
      <div className='settings-create-link'>
        <div className='title'>{t('Link.Title')}</div>
        <InputText
          className='underline'
          label={String(t('Link.Name'))}
          value={title}
          is_required
          onChange={handleTitleChange}
        />
        <p className='text-gray text-center mt-6 mb-4'>
          {t('Invitation.CreateTitle')}
        </p>
        <div className='input-group'>
          <div className='col-6'>
            <div className='title'>{t('Invitation.LimitUsers')}</div>
            <RangeSlider
              options={COUNT_USERS}
              value={selectedUsageOption}
              onChange={setSelectedUsageOption}
              className='thumbs-5'
            />
            <p className='text-center mb-5'>
              {COUNT_USERS[selectedUsageOption]}
            </p>
            <p className='text-gray'>{t('Invitation.LimitUsersDescription')}</p>
          </div>
          <div className='col-6'>
            <div className='title'>{t('Invitation.LimitTime')}</div>
            <RangeSlider
              options={customTimeLimit}
              value={selectedExpireOption}
              onChange={setSelectedExpireOption}
              className={`thumbs-${customTimeLimit.length ?? '4'}`}
            />
            <p className='link-value mb-5'>
              <span>Will be reset</span>
              <span className='text-secondary'>
                {formatTimeDuration(
                  t,
                  customDefaultExpireDate[selectedExpireOption]
                )}
              </span>
            </p>
            <p className='text-gray'>{t('Invitation.LimitTimeDescription')}</p>
          </div>
        </div>
        <div className='form-submit'>
          <Button
            size='smaller'
            fullWidth
            isShiny
            className='mt-2'
            onClick={handleSaveClick}
            disabled={isSubmitBlocked}
            ariaLabel={String(
              editingInvite ? t('Link.Save') : t('Link.Create')
            )}
          >
            {editingInvite ? t('Link.Save') : t('Link.Create')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { currentUserId } = global;
    const chat = currentUserId ? selectChat(global, currentUserId) : undefined;
    if (!chat) return { currentUserId };
    const { editingInvite } =
      selectTabState(global).management.byChatId[chat.id];

    return {
      currentUserId,
      chat,
      editingInvite,
    };
  })(SettingsInvitationLink)
);
