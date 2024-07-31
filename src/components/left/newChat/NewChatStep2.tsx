import React, {
  FC,
  useState,
  useCallback,
  useEffect,
  memo,
  useMemo,
} from 'react';
import { getActions, getGlobal, withGlobal } from '../../../global';

import { ChatCreationProgress, LeftColumnContent } from '../../../types';

import { selectTabState } from '../../../global/selectors';
import useHistoryBack from '../../../hooks/useHistoryBack';

import InputText from '../../ui/InputText';
import FloatingActionButton from '../../ui/FloatingActionButton';
import Spinner from '../../ui/Spinner';
import AvatarEditable from '../../ui/AvatarEditable';
import Button from '../../ui/Button';
import ListItem from '../../ui/ListItem';
import PrivateChatInfo from '../../common/PrivateChatInfo';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import TextArea from '../../ui/TextArea';
import RadioGroup from '../../ui/RadioGroup';
import { ApiChat, ApiCountryCode } from '../../../api/types';
import CountryCodeInput from '../../auth/CountryCodeInput';
import SelectDropdown from '../../ui/SelectDropdown';
import { ChannelType, ECreateCourse } from './NewChat';
import useEffectOnce from '../../../hooks/useEffectOnce';
import useLastCallback from '../../../hooks/useLastCallback';
import { IGenre } from '../../../global/types';
import Checkbox from '../../ui/Checkbox';
import {
  filterUsersByName,
  isDeletedUser,
  isUserBot,
  sortChatIds,
} from '../../../global/helpers';
import { unique } from '../../../util/iteratees';

export type OwnProps = {
  isChannel?: boolean;
  forChannelId?: string;
  isCourse?: boolean;
  isActive: boolean;
  memberIds: string[];
  channelType?: ChannelType;
  cost?: string;
  courseData?: ECreateCourse;
  onReset: (forceReturnToChatList?: boolean) => void;
  onSelectedIdsChange?: (ids: string[]) => void;
};

type StateProps = {
  creationProgress?: ChatCreationProgress;
  creationError?: string;
  maxGroupSize?: number;
  channelCategories: string[];
  channelGenres: IGenre[];
  localContactIds?: string[];
  searchQuery?: string;
  localUserIds?: string[];
  globalUserIds?: string[];
  chatsById: Record<string, ApiChat>;
};

const GROUP_MAX_DESCRIPTION = 255;

const NewChatStep2: FC<OwnProps & StateProps> = ({
  isChannel,
  isCourse,
  isActive,
  forChannelId,
  memberIds,
  maxGroupSize,
  creationProgress,
  creationError,
  channelCategories,
  channelGenres,
  channelType,
  cost,
  courseData,
  localContactIds,
  localUserIds,
  globalUserIds,
  searchQuery,
  chatsById,
  onReset,
  onSelectedIdsChange,
}) => {
  const {
    createGroupChat,
    createChannel,
    getCategoriesForChannel,
    getGenresForChannel,
    setLeftScreen,
  } = getActions();

  const { t } = useTranslation();

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [photo, setPhoto] = useState<File | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [ageLimit, setAgeLimit] = useState('0');
  const [country, setCountry] = useState<ApiCountryCode | undefined>();
  const [category, setCategory] = useState();
  const [genre, setGenre] = useState();
  const [subGenre, setSubGenre] = useState();

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
    );
  }, [localContactIds, chatsById, searchQuery, localUserIds, globalUserIds]);

  const formatGenre = channelGenres.map((el) => el.genre);

  const chatTitleEmptyError = "Chat title can't be empty";
  const channelTitleEmptyError = "Channel title can't be empty";
  const chatTooManyUsersError =
    'Sorry, creating supergroups is not yet supported';

  const isLoading = creationProgress === ChatCreationProgress.InProgress;

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;
      const newValue = value.replace(/^\s+/, '');

      setTitle(newValue);

      if (newValue !== value) {
        e.currentTarget.value = newValue;
      }
    },
    []
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAbout(e.target.value);
    },
    []
  );

  const handleCreateGroup = useCallback(() => {
    if (!title.length) {
      setError(chatTitleEmptyError);
      return;
    }

    if (maxGroupSize && memberIds && memberIds.length >= maxGroupSize) {
      setError(chatTooManyUsersError);
      return;
    }

    createChannel({
      title,
      about,
      photo,
      memberIds,
      megagroup: true,
      forChannelId,
    });
  }, [about, title, memberIds, maxGroupSize, createGroupChat, photo]);

  const handleCreateChannel = useLastCallback(() => {
    if (!title.length) {
      setError(channelTitleEmptyError);
      return;
    }

    const selectGenre =
      genre && category && channelCategories[category].toLowerCase() === 'music'
        ? channelGenres[genre]
        : undefined;

    const selectSubGenre =
      genre && subGenre ? channelGenres[subGenre] : undefined;

    createChannel({
      title,
      about,
      photo,
      memberIds,
      payType: channelType === 'subscription' ? 2 : undefined,
      cost,
      category: category && channelCategories[category],
      country: country?.countryCode,
      adult: Boolean(Number(ageLimit)) || undefined,
      channelType,
      genre: selectGenre?.genre,
      subGenre: selectSubGenre?.genre,
    });
  });

  const handleCreateCourse = useLastCallback(() => {
    if (!title.length) {
      setError(channelTitleEmptyError);
      return;
    }

    const selectGenre =
      genre && category && channelCategories[category].toLowerCase() === 'music'
        ? channelGenres[genre]
        : undefined;

    const selectSubGenre =
      genre && subGenre ? channelGenres[subGenre] : undefined;

    createChannel({
      ...courseData,
      payType: 1,
      cost,
      channelType: 'online',
      title,
      about,
      photo,
      memberIds,
      category: category && channelCategories[category],
      country: country?.countryCode,
      adult: Boolean(Number(ageLimit)) || undefined,
      genre: selectGenre?.genre,
      subGenre: selectSubGenre?.genre,
    });
  });

  const handleClickHere = useLastCallback(() => {
    setLeftScreen({
      screen: isCourse
        ? LeftColumnContent.AgeRestrictionForCourse
        : LeftColumnContent.AgeRestriction,
    });
  });

  const options = [
    {
      value: '1',
      label: t('Channel.AgeLimitTrue'),
    },
    {
      value: '0',
      label: t('Channel.AgeLimitFalse'),
    },
  ];

  const handleOptionChange = useCallback((value: string) => {
    setAgeLimit(value);
  }, []);

  const handleItemClick = useCallback(
    (id: string) => {
      const newSelectedIds = [...memberIds];
      if (newSelectedIds.includes(id)) {
        newSelectedIds.splice(newSelectedIds.indexOf(id), 1);
      } else {
        newSelectedIds.push(id);
      }

      if (onSelectedIdsChange) onSelectedIdsChange(newSelectedIds);
    },
    [memberIds, onSelectedIdsChange]
  );

  useEffect(() => {
    if (creationProgress === ChatCreationProgress.Complete) {
      onReset(true);
    }
  }, [creationProgress, onReset]);

  useEffectOnce(() => {
    getCategoriesForChannel();
    getGenresForChannel();
  });

  const renderedError =
    (creationError && t(creationError)) ||
    (error !== chatTitleEmptyError && error !== channelTitleEmptyError
      ? error
      : undefined);

  const canUpdate =
    Boolean(!renderedError && title.length !== 0) &&
    Boolean(isChannel ? category && country : true);

  return (
    <div className='NewChat'>
      {!forChannelId && (
        <div className='left-header'>
          <Button
            round
            size='smaller'
            color='translucent'
            onClick={() => onReset()}
            ariaLabel='Return to member selection'
            className='mr-2'
          >
            <i className='icon-svg'>
              <IconSvg name='arrow-left' />
            </i>
          </Button>
          <h4>
            {t(
              isChannel && isCourse
                ? 'Channel.NewCourse'
                : isChannel
                ? 'Channel.New'
                : 'Group.New'
            )}
          </h4>
        </div>
      )}
      <div id='step_2' className='NewChat-inner custom-scroll step-2'>
        <AvatarEditable onChange={setPhoto} label={String(t('AddPhoto'))} />
        <InputText
          value={title}
          as_disabled
          onChange={handleTitleChange}
          label={String(
            t(isChannel ? 'Channel.ChannelTitle' : 'Group.GroupTitle')
          )}
          error={
            error === chatTitleEmptyError || error === channelTitleEmptyError
              ? error
              : undefined
          }
        />

        {!forChannelId && (
          <>
            <TextArea
              value={about}
              as_disabled
              onChange={handleDescriptionChange}
              label={String(t('DescriptionOptionalPlaceholder'))}
              maxLength={GROUP_MAX_DESCRIPTION}
              maxLengthIndicator={(
                GROUP_MAX_DESCRIPTION - about.length
              ).toString()}
            />
            <p className='note'>
              {t(
                isChannel ? 'Channel.DescriptionNote' : 'Group.DescriptionNote'
              )}
            </p>
          </>
        )}

        {renderedError && <p className='error'>{renderedError}</p>}

        {!isChannel && displayedIds && displayedIds.length > 0 && (
          <>
            <h3 className='chat-members-heading'>
              {t('Group.ParticipantCount', { length: memberIds.length })}
            </h3>

            <div className='chat-members-list custom-scroll'>
              {displayedIds.map((id) => (
                <ListItem
                  className='chat-item-clickable  picker-list-item'
                  onClick={() => handleItemClick(id)}
                >
                  <Checkbox label='' square checked={memberIds.includes(id)} />

                  <PrivateChatInfo userId={id} />
                </ListItem>
              ))}
            </div>
          </>
        )}
        {isChannel && (
          <>
            <RadioGroup
              id='ageLimit'
              selected={ageLimit}
              name='age-limit'
              options={options}
              onChange={handleOptionChange}
              size='smaller'
              className='left-top'
            />
            <p className='text-smaller text-secondary'>
              <span
                className='text-primary text-bold'
                role='button'
                onClick={handleClickHere}
              >
                {t('ClickHere')}
              </span>{' '}
              {t('Policy.MoreAge')}
            </p>
            <div className='channel-selects'>
              <p className='sublabel required'>{t('Channel.SelectCategory')}</p>
              <SelectDropdown
                scrollId='step_2'
                dataList={{ ...channelCategories }}
                value={category}
                handleChange={setCategory}
                label='Category'
                positionY='bottom'
              />
              {category &&
                channelCategories[category].toLowerCase() === 'music' && (
                  <>
                    <p className='sublabel required'>
                      {t('Channel.SelectGenre')}
                    </p>
                    <SelectDropdown
                      scrollId='step_2'
                      dataList={{ ...formatGenre }}
                      value={genre}
                      handleChange={setGenre}
                      label='Genre'
                    />
                    <p className='sublabel required'>
                      {t('Channel.SelectSubGenre')}
                    </p>
                    <SelectDropdown
                      scrollId='step_2'
                      dataList={{ ...formatGenre }}
                      value={subGenre}
                      handleChange={setSubGenre}
                      label='Sub-genre'
                    />
                  </>
                )}

              <p className='sublabel required'>
                {t('Registration.label_country')}
              </p>
              <CountryCodeInput
                scrollId='step_2'
                id='country_select'
                onChange={setCountry}
                value={country}
              />
            </div>
          </>
        )}
      </div>

      <FloatingActionButton
        isShown={canUpdate}
        onClick={
          isCourse
            ? handleCreateCourse
            : isChannel
            ? handleCreateChannel
            : handleCreateGroup
        }
        disabled={isLoading}
        ariaLabel={String(
          isChannel ? t('ChannelIntro.CreateChannel') : t('Group.Create')
        )}
      >
        {isLoading ? (
          <Spinner color='white' />
        ) : (
          <i className='icon-svg'>
            <IconSvg name='arrow-right' />
          </i>
        )}
      </FloatingActionButton>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { progress: creationProgress, error: creationError } =
      selectTabState(global).chatCreation || {};
    const {
      query: searchQuery,
      localResults,
      globalResults,
    } = selectTabState(global).globalSearch;
    const { channelCategories, channelGenres, contactList, chats } = global;

    const { userIds: globalUserIds } = globalResults || {};
    const { userIds: localUserIds } = localResults || {};

    return {
      creationProgress,
      creationError,
      maxGroupSize: global.config?.maxGroupSize,
      channelCategories,
      channelGenres,
      localContactIds: contactList?.userIds,
      searchQuery,
      localUserIds,
      globalUserIds,
      chatsById: chats.byId,
    };
  })(NewChatStep2)
);
