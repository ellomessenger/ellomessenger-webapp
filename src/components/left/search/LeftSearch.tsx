import React, { FC, memo, useCallback, useState, useMemo, useRef } from 'react';
import { getActions, withGlobal } from '../../../global';

import { GlobalSearchContent } from '../../../types';

import { selectTabState } from '../../../global/selectors';
import { parseDateString } from '../../../util/dateFormat';
import useKeyboardListNavigation from '../../../hooks/useKeyboardListNavigation';
import useHistoryBack from '../../../hooks/useHistoryBack';

import TabList from '../../ui/TabList';
import Transition from '../../ui/Transition';
import ChatResults from './ChatResults';
import ChatMessageResults from './ChatMessageResults';
import MediaResults from './MediaResults';
import LinkResults from './LinkResults';
import FileResults from './FileResults';
import AudioResults from './AudioResults';

import './LeftSearch.scss';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  searchQuery?: string;
  searchDate?: number;
  isActive: boolean;
  onReset: () => void;
};

type StateProps = {
  currentContent?: GlobalSearchContent;
  chatId?: string;
};

const TABS = [
  { type: GlobalSearchContent.ChatList, title: 'SearchAllChatsShort' },
  { type: GlobalSearchContent.Media, title: 'Shared.MediaTab2' },
  { type: GlobalSearchContent.Links, title: 'Shared.LinksTab2' },
  { type: GlobalSearchContent.Files, title: 'Shared.FilesTab2' },
  { type: GlobalSearchContent.Music, title: 'Shared.MusicTab2' },
  { type: GlobalSearchContent.Voice, title: 'Shared.VoiceTab2' },
];

const CHAT_TABS = [
  { type: GlobalSearchContent.ChatList, title: 'All Messages' },
  ...TABS.slice(1),
];

const TRANSITION_RENDER_COUNT = Object.keys(GlobalSearchContent).length / 2;

const LeftSearch: FC<OwnProps & StateProps> = ({
  searchQuery,
  searchDate,
  isActive,
  currentContent = GlobalSearchContent.ChatList,
  chatId,
  onReset,
}) => {
  const { setGlobalSearchContent, setGlobalSearchDate } = getActions();

  const { i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const [activeTab, setActiveTab] = useState(currentContent);
  const dateSearchQuery = useMemo(
    () => parseDateString(searchQuery),
    [searchQuery]
  );

  const handleSwitchTab = useCallback(
    (index: number) => {
      const tab = TABS[index];
      setGlobalSearchContent({ content: tab.type });
      setActiveTab(index);
    },
    [setGlobalSearchContent]
  );

  const handleSearchDateSelect = useCallback(
    (value: Date) => {
      setGlobalSearchDate({ date: value.getTime() / 1000 });
    },
    [setGlobalSearchDate]
  );

  // eslint-disable-next-line no-null/no-null
  const containerRef = useRef<HTMLDivElement>(null);
  const handleKeyDown = useKeyboardListNavigation(
    containerRef,
    isActive,
    undefined,
    '.ListItem-button',
    true
  );

  return (
    <div className='LeftSearch' ref={containerRef} onKeyDown={handleKeyDown}>
      <TabList
        activeTab={activeTab}
        tabs={chatId ? CHAT_TABS : TABS}
        onSwitchTab={handleSwitchTab}
      />
      <Transition
        name={isRtl ? 'slide-optimized-rtl' : 'slide-optimized'}
        renderCount={TRANSITION_RENDER_COUNT}
        activeKey={currentContent}
      >
        {(() => {
          switch (currentContent) {
            case GlobalSearchContent.ChatList:
              if (chatId) {
                return (
                  <ChatMessageResults
                    searchQuery={searchQuery}
                    dateSearchQuery={dateSearchQuery}
                    onReset={onReset}
                    onSearchDateSelect={handleSearchDateSelect}
                  />
                );
              }
              return (
                <ChatResults
                  searchQuery={searchQuery}
                  searchDate={searchDate}
                  dateSearchQuery={dateSearchQuery}
                  onReset={onReset}
                  onSearchDateSelect={handleSearchDateSelect}
                />
              );
            case GlobalSearchContent.Media:
              return <MediaResults searchQuery={searchQuery} />;
            case GlobalSearchContent.Links:
              return <LinkResults searchQuery={searchQuery} />;
            case GlobalSearchContent.Files:
              return <FileResults searchQuery={searchQuery} />;
            case GlobalSearchContent.Music:
              return <AudioResults key='audio' searchQuery={searchQuery} />;
            case GlobalSearchContent.Voice:
              return (
                <AudioResults key='voice' isVoice searchQuery={searchQuery} />
              );
            default:
              return undefined;
          }
        })()}
      </Transition>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { currentContent, chatId } = selectTabState(global).globalSearch;

    return { currentContent, chatId };
  })(LeftSearch)
);
