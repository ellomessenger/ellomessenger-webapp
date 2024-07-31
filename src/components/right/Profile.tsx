import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react';
import { getActions, withGlobal } from '../../global';

import type {
  ApiMessage,
  ApiChat,
  ApiChatMember,
  ApiUser,
  ApiUserStatus,
} from '../../api/types';
import { MAIN_THREAD_ID } from '../../api/types';
import type {
  ISettings,
  ProfileState,
  ProfileTabType,
  SettingsScreens,
  SharedMediaType,
  ThreadId,
} from '../../types';
import {
  NewChatMembersProgress,
  MediaViewerOrigin,
  AudioOrigin,
  ManagementScreens,
} from '../../types';

import {
  MEMBERS_SLICE,
  PROFILE_SENSITIVE_AREA,
  SHARED_MEDIA_SLICE,
  SLIDE_TRANSITION_DURATION,
} from '../../config';
import { IS_TOUCH_ENV } from '../../util/windowEnvironment';
import {
  getCanAddContact,
  getHasAdminRight,
  isChatAdmin,
  isChatChannel,
  isChatCourse,
  isChatGroup,
  isChatSubscription,
  isUserBot,
  isUserId,
  isUserRightBanned,
} from '../../global/helpers';
import {
  selectChatMessages,
  selectChat,
  selectCurrentMediaSearch,
  selectIsRightColumnShown,
  selectTheme,
  selectActiveDownloads,
  selectUser,
} from '../../global/selectors';
import { captureEvents, SwipeDirection } from '../../util/captureEvents';
import { getSenderName } from '../left/search/helpers/getSenderName';
import useCacheBuster from '../../hooks/useCacheBuster';
import useProfileViewportIds from './hooks/useProfileViewportIds';
import useProfileState from './hooks/useProfileState';
import useTransitionFixes from './hooks/useTransitionFixes';
import useAsyncRendering from './hooks/useAsyncRendering';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import useEffectWithPrevDeps from '../../hooks/useEffectWithPrevDeps';

import Transition from '../ui/Transition';
import InfiniteScroll from '../ui/InfiniteScroll';
import TabList from '../ui/TabList';
import Spinner from '../ui/Spinner';
import ListItem from '../ui/ListItem';
import PrivateChatInfo from '../common/PrivateChatInfo';
import ProfileInfo from '../common/ProfileInfo';
import Document from '../common/Document';
import Audio from '../common/Audio';
import ChatExtra from '../common/ChatExtra';
import Media from '../common/Media';
import WebLink from '../common/WebLink';
import NothingFound from '../common/NothingFound';
import FloatingActionButton from '../ui/FloatingActionButton';
import DeleteMemberModal from './DeleteMemberModal';
import GroupChatInfo from '../common/GroupChatInfo';

import './Profile.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../ui/IconSvg';
import { formatInteger } from '../../util/textFormat';
import useLastCallback from '../../hooks/useLastCallback';
import { getMoneyFormat } from '../../util/convertMoney';
import { formatDateToString } from '../../util/dateFormat';
import Loading from '../ui/Loading';

type OwnProps = {
  chatId: string;
  threadId?: ThreadId;
  profileState: ProfileState;
  isMobile?: boolean;
  onProfileStateChange: (state: ProfileState) => void;
  onManagerScreenSelect: (state: ManagementScreens) => void;
};

type StateProps = {
  theme: ISettings['theme'];
  isCreator?: boolean;
  isChannel?: boolean;
  isGroup?: boolean;
  isAdmin?: boolean;
  currentUserId?: string;
  resolvedUserId?: string;
  messagesById?: Record<number, ApiMessage>;
  foundIds?: number[];
  mediaSearchType?: SharedMediaType;
  hasCommonChatsTab?: boolean;
  hasMembersTab?: boolean;
  areMembersHidden?: boolean;
  canAddMembers?: boolean;
  canDeleteMembers?: boolean;
  members?: ApiChatMember[];
  subscriptionCost?: string;
  membersCount?: number;
  adminMembersById?: Record<string, ApiChatMember>;
  commonChatIds?: string[];
  chatsById: Record<string, ApiChat>;
  usersById: Record<string, ApiUser>;
  userStatusesById: Record<string, ApiUserStatus>;
  isRightColumnShown: boolean;
  isRestricted?: boolean;
  lastSyncTime?: number;
  activeDownloadIds?: number[];
  isChatProtected?: boolean;
  startDate?: string;
  endDate?: string;
};

const TABS = [
  { type: 'media', title: 'Shared.MediaTab2' },
  { type: 'audio', title: 'Shared.MusicTab2' },
  { type: 'documents', title: 'Shared.FilesTab2' },
  { type: 'voice', title: 'Shared.VoiceTab2' },
  // { type: 'links', title: 'SharedLinksTab2' },
];

const HIDDEN_RENDER_DELAY = 1000;
const INTERSECTION_THROTTLE = 500;

const Profile: FC<OwnProps & StateProps> = ({
  chatId,
  threadId,
  profileState,
  onProfileStateChange,
  theme,
  isChannel,
  isCreator,
  isGroup,
  isAdmin,
  resolvedUserId,
  currentUserId,
  messagesById,
  foundIds,
  mediaSearchType,
  hasCommonChatsTab,
  hasMembersTab,
  areMembersHidden,
  canAddMembers,
  canDeleteMembers,
  commonChatIds,
  members,
  membersCount,
  subscriptionCost,
  adminMembersById,
  usersById,
  userStatusesById,
  chatsById,
  isRightColumnShown,
  isRestricted,
  lastSyncTime,
  activeDownloadIds,
  isChatProtected,
  startDate,
  endDate,
  onManagerScreenSelect,
}) => {
  const {
    setLocalMediaSearchType,
    loadMoreMembers,
    loadCommonChats,
    openChat,
    searchMediaMessagesLocal,
    openMediaViewer,
    openAudioPlayer,
    focusMessage,
    toggleManagement,
    loadProfilePhotos,
    setNewChatMembersDialogState,
    closeManagement,
  } = getActions();

  // eslint-disable-next-line no-null/no-null
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-null/no-null
  const transitionRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const [activeTab, setActiveTab] = useState(0);
  const [deletingUserId, setDeletingUserId] = useState<string | undefined>();

  const tabs = useMemo(
    () => [
      ...(hasMembersTab
        ? [
            {
              type: 'members',
              title: isChannel ? 'Channel.Subscribers' : 'Group.Members',
              badgeCount: membersCount || 0,
            },
          ]
        : []),
      ...TABS,
      // TODO The filter for voice messages currently does not work
      // in forum topics. Return it when it's fixed on the server side.
      // ...(!topicId ? [{ type: 'voice', title: 'SharedVoiceTab2' }] : []),
      ...(hasCommonChatsTab
        ? [{ type: 'commonChats', title: 'Shared.GroupsTab2' }]
        : []),
    ],
    [hasCommonChatsTab, hasMembersTab, isChannel, threadId, membersCount]
  );

  const renderingActiveTab =
    activeTab > tabs.length - 1 ? tabs.length - 1 : activeTab;
  const tabType = tabs[renderingActiveTab].type as ProfileTabType;

  const [resultType, viewportIds, getMore, noProfileInfo] =
    useProfileViewportIds(
      loadMoreMembers,
      loadCommonChats,
      searchMediaMessagesLocal,
      tabType,
      mediaSearchType,
      members,
      commonChatIds,
      usersById,
      userStatusesById,
      chatsById,
      messagesById,
      foundIds,
      lastSyncTime,
      threadId
    );

  const isFirstTab =
    resultType === 'members' || (!hasMembersTab && resultType === 'media');
  const activeKey = tabs.findIndex(({ type }) => type === resultType);

  const { handleScroll } = useProfileState(
    containerRef,
    resultType,
    profileState,
    onProfileStateChange
  );

  const { applyTransitionFix, releaseTransitionFix } =
    useTransitionFixes(containerRef);

  const [cacheBuster, resetCacheBuster] = useCacheBuster();

  const { observe: observeIntersectionForMedia } = useIntersectionObserver({
    rootRef: containerRef,
    throttleMs: INTERSECTION_THROTTLE,
  });

  const handleTransitionStop = useCallback(() => {
    releaseTransitionFix();
    resetCacheBuster();
  }, [releaseTransitionFix, resetCacheBuster]);

  const handleNewMemberDialogOpen = useCallback(() => {
    setNewChatMembersDialogState({
      newChatMembersProgress: NewChatMembersProgress.InProgress,
    });
  }, [setNewChatMembersDialogState]);

  // Update search type when switching tabs or forum topics
  useEffect(() => {
    setLocalMediaSearchType({ mediaType: tabType as SharedMediaType });
  }, [setLocalMediaSearchType, tabType, threadId]);

  const profileId = resolvedUserId || chatId;

  useEffect(() => {
    if (lastSyncTime) {
      loadProfilePhotos({ profileId });
    }
  }, [loadProfilePhotos, profileId, lastSyncTime]);

  const handleSelectMedia = useCallback(
    (mediaId: number) => {
      openMediaViewer({
        chatId: profileId,
        threadId: MAIN_THREAD_ID,
        mediaId,
        origin: MediaViewerOrigin.SharedMedia,
      });
    },
    [profileId, openMediaViewer]
  );

  const handlePlayAudio = useCallback(
    (messageId: number) => {
      openAudioPlayer({ chatId: profileId, messageId });
    },
    [profileId, openAudioPlayer]
  );

  const handleMemberClick = useLastCallback((id: string) => {
    closeManagement();
    openChat({ id });
  });

  const handleMessageFocus = useCallback(
    (messageId: number) => {
      focusMessage({ chatId: profileId, messageId });
    },
    [profileId, focusMessage]
  );

  const handleDeleteMembersModalClose = useCallback(() => {
    setDeletingUserId(undefined);
  }, []);

  const adminsCount = useMemo(() => {
    return Object.keys(adminMembersById || {}).length;
  }, [adminMembersById]);

  const handleClickAdministrators = useLastCallback(() => {
    toggleManagement();
    onManagerScreenSelect(ManagementScreens.ChatAdministrators);
  });

  const handleClickSubscribers = useLastCallback(() => {
    toggleManagement();
    onManagerScreenSelect(ManagementScreens.ChannelSubscribers);
  });

  useEffectWithPrevDeps(
    ([prevHasMemberTabs]) => {
      if (activeTab === 0 || prevHasMemberTabs === hasMembersTab) {
        return;
      }

      const newActiveTab = activeTab + (hasMembersTab ? 1 : -1);

      setActiveTab(Math.min(newActiveTab, tabs.length - 1));
    },
    [hasMembersTab, activeTab, tabs]
  );

  useEffect(() => {
    if (!transitionRef.current || !IS_TOUCH_ENV) {
      return undefined;
    }

    return captureEvents(transitionRef.current, {
      selectorToPreventScroll: '.Profile',
      onSwipe: (e, direction) => {
        if (direction === SwipeDirection.Left) {
          setActiveTab(Math.min(renderingActiveTab + 1, tabs.length - 1));
          return true;
        } else if (direction === SwipeDirection.Right) {
          setActiveTab(Math.max(0, renderingActiveTab - 1));
          return true;
        }

        return false;
      },
    });
  }, [renderingActiveTab, tabs.length]);

  let renderingDelay;
  // @optimization Used to unparallelize rendering of message list and profile media
  if (isFirstTab) {
    renderingDelay = !isRightColumnShown ? HIDDEN_RENDER_DELAY : 0;
    // @optimization Used to delay first render of secondary tabs while animating
  } else if (!viewportIds) {
    renderingDelay = SLIDE_TRANSITION_DURATION;
  }
  const canRenderContent = useAsyncRendering(
    [chatId, threadId, resultType, renderingActiveTab],
    renderingDelay
  );

  function renderContent() {
    if (!viewportIds || !canRenderContent || !messagesById) {
      const noSpinner = isFirstTab && !canRenderContent;
      const forceRenderHiddenMembers = Boolean(
        resultType === 'members' && areMembersHidden
      );

      return (
        <div className='content empty-list'>
          {!noSpinner && !forceRenderHiddenMembers && <Loading />}
          {forceRenderHiddenMembers && (
            <NothingFound text='You have no access to group members list.' />
          )}
        </div>
      );
    }

    if (!viewportIds.length) {
      let text: string;

      switch (resultType) {
        case 'members':
          text = areMembersHidden
            ? 'You have no access to group members list.'
            : 'No members found';
          break;
        case 'commonChats':
          text = t('UserInfo.GroupsEmpty');
          break;
        case 'documents':
          text = t('UserInfo.FileEmpty');
          break;
        case 'links':
          text = t('UserInfo.MediaLinkEmpty');
          break;
        case 'audio':
          text = t('UserInfo.MediaSongEmpty');
          break;
        case 'voice':
          text = t('UserInfo.AudioEmpty');
          break;
        default:
          text = t('UserInfo.MediaFileEmpty');
      }

      return (
        <div className='content empty-list'>
          <NothingFound text='' />
        </div>
      );
    }

    return (
      <div
        className={`content ${resultType}-list`}
        dir={isRtl && resultType === 'media' ? 'rtl' : undefined}
        teactFastList
      >
        {resultType === 'media' ? (
          (viewportIds as number[])!.map(
            (id) =>
              messagesById[id] && (
                <Media
                  key={id}
                  message={messagesById[id]}
                  isProtected={isChatProtected || messagesById[id].isProtected}
                  observeIntersection={observeIntersectionForMedia}
                  onClick={handleSelectMedia}
                />
              )
          )
        ) : resultType === 'documents' ? (
          (viewportIds as number[])!.map(
            (id) =>
              messagesById[id] && (
                <Document
                  key={id}
                  message={messagesById[id]}
                  withDate
                  smaller
                  className='scroll-item'
                  isDownloading={activeDownloadIds?.includes(id)}
                  observeIntersection={observeIntersectionForMedia}
                  onDateClick={handleMessageFocus}
                />
              )
          )
        ) : resultType === 'links' ? (
          (viewportIds as number[])!.map(
            (id) =>
              messagesById[id] && (
                <WebLink
                  key={id}
                  message={messagesById[id]}
                  isProtected={isChatProtected || messagesById[id].isProtected}
                  observeIntersection={observeIntersectionForMedia}
                  onMessageClick={handleMessageFocus}
                />
              )
          )
        ) : resultType === 'audio' ? (
          (viewportIds as number[])!.map(
            (id) =>
              messagesById[id] && (
                <Audio
                  key={id}
                  theme={theme}
                  message={messagesById[id]}
                  origin={AudioOrigin.SharedMedia}
                  date={messagesById[id].date}
                  lastSyncTime={lastSyncTime}
                  className='scroll-item'
                  onPlay={handlePlayAudio}
                  onDateClick={handleMessageFocus}
                  canDownload={
                    !isChatProtected && !messagesById[id].isProtected
                  }
                  isDownloading={activeDownloadIds?.includes(id)}
                />
              )
          )
        ) : resultType === 'voice' ? (
          (viewportIds as number[])!.map(
            (id) =>
              messagesById[id] && (
                <Audio
                  key={id}
                  theme={theme}
                  message={messagesById[id]}
                  senderTitle={getSenderName(
                    t,
                    messagesById[id],
                    chatsById,
                    usersById
                  )}
                  origin={AudioOrigin.Inline}
                  date={messagesById[id].date}
                  lastSyncTime={lastSyncTime}
                  className='scroll-item'
                  onPlay={handlePlayAudio}
                  onDateClick={handleMessageFocus}
                  canDownload={
                    !isChatProtected && !messagesById[id].isProtected
                  }
                  isDownloading={activeDownloadIds?.includes(id)}
                />
              )
          )
        ) : resultType === 'members' ? (
          <>
            {canAddMembers && !isChannel && isCreator && (
              <ListItem
                buttonClassName='is_link'
                leftElement={
                  <i className='icon-svg mr-4'>
                    <IconSvg name='user-plus' />
                  </i>
                }
                onClick={handleNewMemberDialogOpen}
              >
                {t('Group.AddMembers')}
              </ListItem>
            )}
            {(viewportIds as string[])!.map((id, i) => (
              <ListItem
                key={id}
                teactOrderKey={i}
                className='chat-item-clickable scroll-item small-icon underline'
                ripple
                secondaryIcon={
                  isCreator && currentUserId !== id ? 'filled' : undefined
                }
                onClick={() => handleMemberClick(id)}
                contextActions={
                  isCreator && currentUserId !== id
                    ? [
                        {
                          title: t('Group.CancelMember'),
                          icon: 'close-outline',
                          handler: () => setDeletingUserId(id),
                        },
                      ]
                    : undefined
                }
              >
                <PrivateChatInfo
                  userId={id}
                  adminMember={adminMembersById?.[id]}
                  forceShowSelf
                />
              </ListItem>
            ))}
          </>
        ) : resultType === 'commonChats' ? (
          (viewportIds as string[])!.map((id, i) => (
            <ListItem
              key={id}
              teactOrderKey={i}
              className='chat-item-clickable scroll-item underline'
            >
              <div
                role='button'
                className='info'
                onClick={() => openChat({ id })}
              >
                <GroupChatInfo chatId={id} />
              </div>
            </ListItem>
          ))
        ) : undefined}
      </div>
    );
  }

  return (
    <InfiniteScroll
      elRef={containerRef}
      className='Profile custom-scroll'
      itemSelector={buildInfiniteScrollItemSelector(resultType)}
      items={canRenderContent ? viewportIds : undefined}
      cacheBuster={cacheBuster}
      sensitiveArea={PROFILE_SENSITIVE_AREA}
      preloadBackwards={
        canRenderContent
          ? resultType === 'members'
            ? MEMBERS_SLICE
            : SHARED_MEDIA_SLICE
          : 0
      }
      // To prevent scroll jumps caused by reordering member list
      noScrollRestoreOnTop
      noFastList
      onLoadMore={getMore}
      onScroll={handleScroll}
    >
      {!noProfileInfo &&
        renderProfileInfo(
          chatId,
          resolvedUserId,
          isRightColumnShown && canRenderContent
        )}

      {isChannel && (isCreator || isAdmin) && (
        <div className='section group-link'>
          <ListItem
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='users' w='24' h='25' />
              </i>
            }
            onClick={handleClickSubscribers}
          >
            <div className='middle'>
              {t(isChannel ? 'Subscribers' : 'Group.AddMembers')}
            </div>
            <span className='badge-counter'>{membersCount ?? 0}</span>
          </ListItem>
          <ListItem
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='admin' />
              </i>
            }
            onClick={handleClickAdministrators}
          >
            <span className='middle'>{t('Administrators')}</span>
            <span className='badge-counter'>{formatInteger(adminsCount)}</span>
          </ListItem>
        </div>
      )}

      {!isRestricted && (
        <div className='shared-media'>
          <>
            <Transition
              elRef={transitionRef}
              name={isRtl ? 'slide-optimized-rtl' : 'slide-optimized'}
              activeKey={activeKey}
              renderCount={tabs.length}
              shouldRestoreHeight
              className='shared-media-transition'
              onStart={applyTransitionFix}
              onStop={handleTransitionStop}
            >
              {renderContent()}
            </Transition>

            <TabList
              big
              activeTab={renderingActiveTab}
              tabs={tabs}
              onSwitchTab={setActiveTab}
            />
          </>
        </div>
      )}

      {canAddMembers && !isChannel && (
        <FloatingActionButton
          isShown={resultType === 'members'}
          onClick={handleNewMemberDialogOpen}
          ariaLabel={String(t('AddUsers'))}
        >
          <i className='icon-svg'>
            <IconSvg name='user-plus' w='28' h='28' />
          </i>
        </FloatingActionButton>
      )}
      {canDeleteMembers && (
        <DeleteMemberModal
          isOpen={Boolean(deletingUserId)}
          userId={deletingUserId}
          onClose={handleDeleteMembersModalClose}
        />
      )}
    </InfiniteScroll>
  );
};

function renderProfileInfo(
  chatId: string,
  resolvedUserId: string | undefined,
  isReady: boolean
) {
  return (
    <div className='profile-info'>
      <ProfileInfo userId={resolvedUserId || chatId} canPlayVideo={isReady} />
      <ChatExtra chatOrUserId={resolvedUserId || chatId} />
    </div>
  );
}

function buildInfiniteScrollItemSelector(resultType: string) {
  return [
    // Used on first render
    `.shared-media-transition > div:only-child > .${resultType}-list > .scroll-item`,
    // Used after transition
    `.shared-media-transition > .Transition__slide--active > .${resultType}-list > .scroll-item`,
  ].join(', ');
}

export default memo(
  withGlobal<OwnProps>((global, { chatId, threadId, isMobile }): StateProps => {
    const chat = selectChat(global, chatId);
    const messagesById = selectChatMessages(global, chatId);
    const { currentType: mediaSearchType, resultsByType } =
      selectCurrentMediaSearch(global) || {};

    const { foundIds } =
      (resultsByType && mediaSearchType && resultsByType[mediaSearchType]) ||
      {};

    const { byId: usersById, statusesById: userStatusesById } = global.users;
    const { byId: chatsById } = global.chats;

    const isCreator = chat?.isCreator;
    const isGroup = chat && isChatGroup(chat);
    const isChannel = chat && isChatChannel(chat);
    const isAdmin = chat && isChatAdmin(chat);
    const subscriptionCost = chat?.cost;
    const startDate = chat?.startDate;
    const endDate = chat?.endDate;
    const isTopicInfo = Boolean(threadId && threadId !== MAIN_THREAD_ID);
    const hasMembersTab = !isTopicInfo && isGroup;
    const members = chat?.fullInfo?.members;
    const membersCount = chat?.membersCount;

    const adminMembersById = chat?.fullInfo?.adminMembersById;
    const areMembersHidden =
      hasMembersTab &&
      chat &&
      (chat.isForbidden || (chat.fullInfo && !chat.fullInfo.canViewMembers));
    const canAddMembers =
      hasMembersTab &&
      chat &&
      (getHasAdminRight(chat, 'inviteUsers') ||
        !isUserRightBanned(chat, 'inviteUsers') ||
        chat.isCreator);
    const canDeleteMembers =
      hasMembersTab &&
      chat &&
      (getHasAdminRight(chat, 'banUsers') || chat.isCreator);
    const activeDownloads = selectActiveDownloads(global, chatId);

    let hasCommonChatsTab;
    let resolvedUserId;
    let user;
    if (isUserId(chatId)) {
      resolvedUserId = chatId;
      user = selectUser(global, resolvedUserId);
      hasCommonChatsTab = user && !user.isSelf && !isUserBot(user);
    }

    return {
      theme: selectTheme(global),
      isCreator,
      isChannel,
      isGroup,
      isAdmin,
      resolvedUserId,
      messagesById,
      foundIds,
      mediaSearchType,
      hasCommonChatsTab,
      hasMembersTab,
      areMembersHidden,
      canAddMembers,
      canDeleteMembers,
      subscriptionCost,
      currentUserId: global.currentUserId,
      isRightColumnShown: selectIsRightColumnShown(global, isMobile),
      isRestricted: chat?.isRestricted,
      lastSyncTime: global.lastSyncTime,
      activeDownloadIds: activeDownloads?.ids,
      usersById,
      userStatusesById,
      chatsById,
      startDate,
      endDate,
      isChatProtected: chat?.isProtected,
      membersCount,
      ...(hasMembersTab && members && { members, adminMembersById }),
      ...(hasCommonChatsTab &&
        user && { commonChatIds: user.commonChats?.ids }),
    };
  })(Profile)
);
