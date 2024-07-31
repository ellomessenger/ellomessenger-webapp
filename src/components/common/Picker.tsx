import React, {
  FC,
  useCallback,
  useRef,
  useEffect,
  memo,
  useState,
} from 'react';

import { isUserId } from '../../global/helpers';

import InfiniteScroll from '../ui/InfiniteScroll';
import Checkbox from '../ui/Checkbox';
import InputText from '../ui/InputText';
import ListItem from '../ui/ListItem';
import PrivateChatInfo from './PrivateChatInfo';
import GroupChatInfo from './GroupChatInfo';
import PickerSelectedItem from './PickerSelectedItem';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

import Loading from '../ui/Loading';

import './Picker.scss';
import { useTranslation } from 'react-i18next';
import NothingFound from './NothingFound';
import IconSvg from '../ui/IconSvg';
import AnimatedIcon from './AnimatedIcon';
import { LOCAL_TGS_URLS } from './helpers/animatedAssets';
import { STICKER_SIZE_CREATE_CHANNEL } from '../../config';
import { ChannelType } from '../left/newChat/NewChat';

type OwnProps = {
  whileСreating?: boolean;
  itemIds: string[];
  selectedIds: string[];
  filterValue?: string;
  filterPlaceholder?: string;
  notFoundText?: string;
  searchInputId?: string;
  isLoading?: boolean;
  noScrollRestore?: boolean;
  onSelectedIdsChange: (ids: string[]) => void;
  onFilterChange: (value: string) => void;
  onLoadMore?: () => void;
  setScreen?: () => void;
  group?: boolean;
  isChannel?: boolean;
  channelType?: ChannelType;
  isPaidChannel?: boolean;
};

// Focus slows down animation, also it breaks transition layout in Chrome
const FOCUS_DELAY_MS = 500;

const MAX_FULL_ITEMS = 10;
const ALWAYS_FULL_ITEMS_COUNT = 5;

const Picker: FC<OwnProps> = ({
  whileСreating,
  itemIds,
  selectedIds,
  filterValue,
  filterPlaceholder,
  notFoundText,
  searchInputId,
  isLoading,
  noScrollRestore,
  onSelectedIdsChange,
  onFilterChange,
  onLoadMore,
  setScreen,
  isChannel,
  channelType,
  isPaidChannel,
}) => {
  // eslint-disable-next-line no-null/no-null
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldMinimize = selectedIds.length > MAX_FULL_ITEMS;

  const [lastSelection, setLastSelection] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        requestAnimationFrame(() => {
          inputRef.current!.focus();
        });
      }
    }, FOCUS_DELAY_MS);
  }, []);

  const handleItemClick = useCallback(
    (id: string) => {
      const newSelectedIds = [...selectedIds];
      if (newSelectedIds.includes(id)) {
        newSelectedIds.splice(newSelectedIds.indexOf(id), 1);
      } else {
        newSelectedIds.push(id);
      }
      onSelectedIdsChange(newSelectedIds);
      //onFilterChange('');
    },
    [selectedIds, onSelectedIdsChange, onFilterChange]
  );

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, selectionStart } = e.target;
      setLastSelection(selectionStart);
      onFilterChange(value);
    },
    [onFilterChange]
  );

  const [viewportIds, getMore] = useInfiniteScroll(
    onLoadMore,
    itemIds,
    Boolean(filterValue)
  );

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.setSelectionRange(lastSelection, lastSelection);
    }
  }, [inputRef, lastSelection, filterValue]);

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  return (
    <div className='Picker'>
      <div
        className='picker-header custom-scroll visible-scroll'
        dir={isRtl ? 'rtl' : undefined}
      >
        {selectedIds.map((id, i) => (
          <PickerSelectedItem
            chatOrUserId={id}
            isMinimized={
              shouldMinimize && i < selectedIds.length - ALWAYS_FULL_ITEMS_COUNT
            }
            canClose
            onClick={handleItemClick}
            clickArg={id}
          />
        ))}
        <InputText
          id={searchInputId}
          elRef={inputRef}
          value={filterValue}
          onChange={handleFilterChange}
          placeholder={filterPlaceholder || String(t('SelectChat'))}
        />
      </div>
      {!whileСreating && !isPaidChannel && (
        <ListItem
          buttonClassName='is_link'
          leftElement={
            <i className='icon-svg mr-4'>
              <IconSvg name='link' />
            </i>
          }
          onClick={setScreen}
        >
          {t(isChannel ? 'Link.InviteViaChannel' : 'Link.InviteViaGroup')}
        </ListItem>
      )}

      {viewportIds?.length ? (
        <InfiniteScroll
          className='picker-list custom-scroll'
          items={viewportIds}
          onLoadMore={getMore}
          noScrollRestore
        >
          {viewportIds.map((id) => (
            <ListItem
              key={id}
              className='chat-item-clickable picker-list-item'
              onClick={() => handleItemClick(id)}
              ripple
            >
              <Checkbox label='' square checked={selectedIds.includes(id)} />
              {isUserId(id) ? (
                <PrivateChatInfo userId={id} />
              ) : (
                <GroupChatInfo chatId={id} />
              )}
            </ListItem>
          ))}
        </InfiniteScroll>
      ) : !isLoading && filterValue && viewportIds && !viewportIds.length ? (
        <NothingFound
          teactOrderKey={0}
          key='nothing-found'
          text={notFoundText || 'Try a new search.'}
        />
      ) : !isLoading && viewportIds && !viewportIds.length ? (
        <div className='channel-type-description custom-scroll'>
          <div className='centered-block'>
            <div className='AvatarEditable'>
              <AnimatedIcon
                tgsUrl={LOCAL_TGS_URLS.NoContacts}
                size={STICKER_SIZE_CREATE_CHANNEL}
              />
            </div>
            <h2 className='text-center'>
              {t(
                isChannel
                  ? channelType === 'private'
                    ? 'HowAddUsersToChannel'
                    : 'HowAddsubscribersToChannel'
                  : 'HowAddUsersToGroup'
              )}
            </h2>
            <p className='text-secondary section-help'>
              {t(
                isChannel
                  ? channelType === 'private'
                    ? 'HowAddUsersToChannelInfo'
                    : 'HowAddsubscribersToChannelInfo'
                  : 'HowAddUsersToGroupInfo'
              )}
            </p>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default memo(Picker);
