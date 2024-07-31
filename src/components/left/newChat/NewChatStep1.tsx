import React, { FC, useCallback, useMemo, memo, useState } from 'react';
import { getActions, getGlobal, withGlobal } from '../../../global';

import type { ApiChat } from '../../../api/types';

import { selectTabState } from '../../../global/selectors';
import { unique } from '../../../util/iteratees';
import {
  filterUsersByName,
  isDeletedUser,
  isUserBot,
  sortChatIds,
} from '../../../global/helpers';
import useHistoryBack from '../../../hooks/useHistoryBack';

import Picker from '../../common/Picker';
import FloatingActionButton from '../../ui/FloatingActionButton';
import Button from '../../ui/Button';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import { ChannelType } from './NewChat';

import LogoSubscriber from '../../../assets/images/monthly-subscription.png';
import InputText from '../../ui/InputText';
import { getMoneyFormat } from '../../../util/convertMoney';
import { MAIL_INFO } from '../../../config';
import useLastCallback from '../../../hooks/useLastCallback';

export type OwnProps = {
  isChannel?: boolean;
  isActive: boolean;
  channelType?: ChannelType;
  selectedMemberIds: string[];
  cost: string;
  onSelectedMemberIdsChange: (ids: string[]) => void;
  onNextStep: () => void;
  onReset: () => void;
  setCost: (cost: string) => void;
};

type StateProps = {
  chatsById: Record<string, ApiChat>;
  localContactIds?: string[];
  searchQuery?: string;
  isSearching?: boolean;
  localUserIds?: string[];
  globalUserIds?: string[];
};

const NewChatStep1: FC<OwnProps & StateProps> = ({
  isChannel,
  isActive,
  selectedMemberIds,
  onSelectedMemberIdsChange,
  onNextStep,
  onReset,
  setCost,
  chatsById,
  localContactIds,
  searchQuery,
  isSearching,
  localUserIds,
  globalUserIds,
  channelType,
  cost,
}) => {
  const { setGlobalSearchQuery } = getActions();

  const { t } = useTranslation();

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  const handleFilterChange = useCallback(
    (query: string) => {
      setGlobalSearchQuery({ query });
    },
    [setGlobalSearchQuery]
  );

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget: target } = e;
    setCost(getMoneyFormat(target.value, 0, 2));
  };

  const handleClearPrice = () => {
    setCost('');
  };

  const handlePromoteClick = useLastCallback(() => {
    window.open(
      `mailto:${MAIL_INFO}?subject=Channel recommendation inquiry`,
      '_blank'
    );
  });

  const displayedIds = useMemo(() => {
    const usersById = getGlobal().users.byId;
    const foundContactIds = localContactIds
      ? filterUsersByName(localContactIds, usersById, searchQuery)
      : [];

    return sortChatIds(
      unique([
        ...foundContactIds,
        ...(localUserIds || []),
        ...(globalUserIds || []),
      ]).filter((contactId) => {
        const user = usersById[contactId];
        if (!user) {
          return true;
        }
        return (
          !isDeletedUser(user) &&
          !user.isSelf &&
          (user.canBeInvitedToGroup || !isUserBot(user))
        );
      }),
      chatsById
      // false,
      // selectedMemberIds
    );
  }, [
    localContactIds,
    chatsById,
    searchQuery,
    localUserIds,
    globalUserIds,
    selectedMemberIds,
  ]);

  const handleNextStep = useCallback(() => {
    if (selectedMemberIds.length || isChannel) {
      setGlobalSearchQuery({ query: '' });
      onNextStep();
    }
  }, [selectedMemberIds.length, isChannel, setGlobalSearchQuery, onNextStep]);

  return (
    <div className='NewChat step-1'>
      <div className='left-header'>
        <Button
          round
          size='smaller'
          color='translucent'
          onClick={onReset}
          ariaLabel='Return to Chat List'
          className='mr-2'
        >
          <i className='icon-svg'>
            <IconSvg name='arrow-left' />
          </i>
        </Button>
        <h4>
          {t(
            isChannel
              ? channelType === 'subscription'
                ? 'Channel.subscriptionChannel'
                : channelType === 'public'
                ? 'Channel.AddSubscribers'
                : 'Contacts'
              : 'Group.AddMembers'
          )}
        </h4>
      </div>

      {channelType === 'subscription' ? (
        <div className='NewChat-inner step-2 custom-scroll subscription'>
          <div className='inset-block'>
            <h3 className='text-center'>{t('Channel.SubscriptionMonth')}</h3>
            <div className='AvatarEditable'>
              <img src={LogoSubscriber} alt='' />
            </div>
            <p className='sublabel'>{t('Sale.Price')}</p>
            <InputText
              className='prefix-inside'
              prefix={<IconSvg name='dollar' w='24' h='24' />}
              label='0'
              as_disabled
              inputMode='numeric'
              value={cost}
              onChange={handlePriceChange}
              clearValue={handleClearPrice}
            />
          </div>

          <div className='fees'>
            <h4>
              <IconSvg name='info-circle' w='24' h='24' /> Fees
            </h4>
            <span>{t('Channel.Fees')}</span>
          </div>

          <Button
            fullWidth
            size='smaller'
            disabled={!cost}
            onClick={handleNextStep}
          >
            {t('Confirm')}
          </Button>
        </div>
      ) : (
        <div className='NewChat-inner step-1'>
          <Picker
            whileСreating
            itemIds={displayedIds}
            selectedIds={selectedMemberIds}
            filterValue={searchQuery}
            filterPlaceholder={String(t('SearchContactsAndUsernames'))}
            searchInputId='new-group-picker-search'
            isLoading={isSearching}
            onSelectedIdsChange={onSelectedMemberIdsChange}
            onFilterChange={handleFilterChange}
            isChannel={isChannel}
            channelType={channelType}
          />
          {!displayedIds.length && isChannel && channelType === 'public' && (
            <Button fullWidth onClick={handlePromoteClick}>
              Promote channel
            </Button>
          )}
          <FloatingActionButton
            isShown={Boolean(selectedMemberIds.length || isChannel)}
            onClick={handleNextStep}
            ariaLabel={
              isChannel ? 'Continue To Channel Info' : 'Continue To Group Info'
            }
          >
            <i className='icon-svg'>
              <IconSvg name='arrow-right' />
            </i>
          </FloatingActionButton>
        </div>
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { userIds: localContactIds } = global.contactList || {};
    const { byId: chatsById } = global.chats;

    const {
      query: searchQuery,
      fetchingStatus,
      globalResults,
      localResults,
    } = selectTabState(global).globalSearch;
    const { userIds: globalUserIds } = globalResults || {};
    const { userIds: localUserIds } = localResults || {};

    return {
      chatsById,
      localContactIds,
      searchQuery,
      isSearching: fetchingStatus?.chats,
      globalUserIds,
      localUserIds,
    };
  })(NewChatStep1)
);
