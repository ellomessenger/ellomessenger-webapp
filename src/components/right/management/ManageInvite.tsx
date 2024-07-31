import React, { FC, ChangeEvent, memo, useCallback, useState } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiExportedInvite } from '../../../api/types';
import { ManagementScreens } from '../../../types';

import { selectTabState } from '../../../global/selectors';
import useHistoryBack from '../../../hooks/useHistoryBack';
import useFlag from '../../../hooks/useFlag';
import { getServerTime } from '../../../util/serverTime';

import InputText from '../../ui/InputText';

import FloatingActionButton from '../../ui/FloatingActionButton';
import useSyncEffect from '../../../hooks/useSyncEffect';
import { useTranslation } from 'react-i18next';
import RangeSlider from '../../ui/RangeSlider';
import ListItem from '../../ui/ListItem';
import IconSvg from '../../ui/IconSvg';
import ConfirmDialog from '../../ui/ConfirmDialog';
import useLastCallback from '../../../hooks/useLastCallback';
import {
  formatFullDate,
  formatHumanDate,
  formatMediaDateTime,
  formatTimeDuration,
} from '../../../util/dateFormat';

const DEFAULT_USAGE_LIMITS = [1, 10, 50, 100, 0];
const DEFAULT_EXPIRE_DATE = [3600, 86400, 604800, 0];

const COUNT_USERS = ['1', '10', '50', '100', 'No limit'];

const TIME_LIMIT = ['1 hour', '1 Day', '1 Week', 'No limit'];

type OwnProps = {
  chatId: string;
  onClose: NoneToVoidFunction;
  onScreenSelect: (screen: ManagementScreens) => void;
  isActive: boolean;
};

type StateProps = {
  editingInvite?: ApiExportedInvite;
};

const ManageInvite: FC<OwnProps & StateProps> = ({
  chatId,
  editingInvite,
  isActive,
  onClose,
  onScreenSelect,
}) => {
  const { editExportedChatInvite, exportChatInvite } = getActions();

  const { t } = useTranslation();
  const [isRevokeDialogOpen, openRevokeDialog, closeRevokeDialog] = useFlag();
  const [isRequestNeeded, setIsRequestNeeded] = useState(false);
  const [title, setTitle] = useState('');
  const [customDefaultExpireDate, setCustomDefaultExpireDate] =
    useState(DEFAULT_EXPIRE_DATE);

  const [customTimeLimit, setCustomTimeLimit] = useState(TIME_LIMIT);

  const [selectedExpireOption, setSelectedExpireOption] = useState(
    TIME_LIMIT.length - 1
  );
  const [selectedUsageOption, setSelectedUsageOption] = useState(
    COUNT_USERS.length - 1
  );
  const [isSubmitBlocked, setIsSubmitBlocked] = useState(false);

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

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

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleRevoke = useCallback(() => {
    if (editingInvite) {
      const { link, title, isRequestNeeded, expireDate, usageLimit } =
        editingInvite;
      editExportedChatInvite({
        chatId,
        link,
        title,
        isRequestNeeded,
        expireDate,
        usageLimit,
        isRevoked: true,
      });
    }

    closeRevokeDialog();
    onClose();
  }, [closeRevokeDialog, editingInvite]);

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
        chatId,
        title,
        isRequestNeeded,
        expireDate,
        usageLimit,
      });
    } else {
      exportChatInvite({
        chatId,
        title,
        isRequestNeeded,
        expireDate,
        usageLimit,
      });
    }
    onScreenSelect(ManagementScreens.Invites);
  }, [
    chatId,
    editExportedChatInvite,
    editingInvite,
    exportChatInvite,
    isRequestNeeded,
    selectedExpireOption,
    selectedUsageOption,
    title,
    onScreenSelect,
  ]);

  return (
    <div className='Management ManageInvite'>
      <div className='custom-scroll'>
        <div className='section'>
          <InputText
            className='underline'
            label={String(t('Link.Name'))}
            value={title}
            is_required
            onChange={handleTitleChange}
          />
        </div>
        <p className='text-gray section-help'>{t('Invitation.CreateTitle')}</p>
        <div className='section'>
          <h4 className='section-heading'>{t('Invitation.LimitUsers')}</h4>
          <RangeSlider
            options={COUNT_USERS}
            value={selectedUsageOption}
            onChange={setSelectedUsageOption}
            className='thumbs-5'
          />
          <p className='text-center mb-3'>{COUNT_USERS[selectedUsageOption]}</p>
        </div>
        <p className='text-gray section-help'>
          {t('Invitation.LimitUsersDescription')}
        </p>
        <div className='section'>
          <h4 className='section-heading'>{t('Invitation.LimitTime')}</h4>
          <RangeSlider
            options={customTimeLimit}
            value={selectedExpireOption}
            onChange={setSelectedExpireOption}
            className={`thumbs-${customTimeLimit.length ?? '4'}`}
          />
          <p className='link-value mb-3'>
            <span>Will be reset</span>
            <span className='text-secondary'>
              {formatTimeDuration(
                t,
                customDefaultExpireDate[selectedExpireOption]
              )}
            </span>
          </p>
        </div>
        <p className='text-gray section-help'>
          {t('Invitation.LimitTimeDescription')}
        </p>
        {editingInvite && (
          <div className='section group-link'>
            <ListItem
              leftElement={
                <i className='icon-svg destructive'>
                  <IconSvg name='delete' />
                </i>
              }
              onClick={openRevokeDialog}
            >
              <span className='title'>{t('Link.Reset')}</span>
            </ListItem>
          </div>
        )}

        <FloatingActionButton
          isShown
          onClick={handleSaveClick}
          disabled={isSubmitBlocked}
          ariaLabel={String(editingInvite ? t('Link.Save') : t('Link.Create'))}
        >
          <i className='icon-svg'>
            <IconSvg name='check-thin' />
          </i>
        </FloatingActionButton>
      </div>
      <ConfirmDialog
        isOpen={isRevokeDialogOpen}
        onClose={closeRevokeDialog}
        title={String(t('Link.Reset'))}
        text={String(t('Link.ResetAlert'))}
        confirmIsDestructive
        confirmLabel={String(t('Link.Remove'))}
        confirmHandler={handleRevoke}
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const { editingInvite } =
      selectTabState(global).management.byChatId[chatId];

    return {
      editingInvite,
    };
  })(ManageInvite)
);
