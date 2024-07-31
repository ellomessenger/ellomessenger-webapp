import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getActions, withGlobal } from '../../global';

import type { GlobalState } from '../../global/types';
import type {
  ApiChat,
  ApiCountryCode,
  ApiExportedInvite,
  ApiUser,
  ApiUsername,
} from '../../api/types';
import { MAIN_THREAD_ID } from '../../api/types';

import { APP_LINK_PREFIX } from '../../config';
import {
  selectChat,
  selectChatFullInfo,
  selectCurrentMessageList,
  selectNotifyExceptions,
  selectNotifySettings,
  selectTabState,
  selectUser,
} from '../../global/selectors';
import {
  getChatDescription,
  getChatLink,
  getTopicLink,
  getHasAdminRight,
  isChatChannel,
  isUserId,
  isUserRightBanned,
  selectIsChatMuted,
  isChatGroup,
  isChatSubscription,
  isChatCourse,
  getUserFullName,
} from '../../global/helpers';
import renderText from './helpers/renderText';
import { copyTextToClipboard } from '../../util/clipboard';
import { debounce } from '../../util/schedulers';

import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import IconSvg from '../ui/IconSvg';
import InvitationLinkModal from '../middle/settings/InvitationLinkModal';
import { SettingsScreens } from '../../types';
import Switcher from '../ui/Switcher';
import stopEvent from '../../util/stopEvent';
import useLastCallback from '../../hooks/useLastCallback';
import ListItem from '../ui/ListItem';
import { formatDateToString } from '../../util/dateFormat';
import { getMoneyFormat } from '../../util/convertMoney';
import IconSvgSettings from '../middle/settings/icons/IconSvgSettings';
import Avatar from './Avatar';
import useFlag from '../../hooks/useFlag';
import ConfirmDialog from '../ui/ConfirmDialog';
import QRCodeStyling from 'qr-code-styling';
import Logo from '../../assets/Logo_qr.png';

type PrivacyType = 'private' | 'public';

type OwnProps = {
  chatOrUserId: string;
  forceShowSelf?: boolean;
  onScreenSelect?: (screen: SettingsScreens) => void;
};

type StateProps = {
  user?: ApiUser;
  chat?: ApiChat;
  canInviteUsers?: boolean;
  isMuted?: boolean;
  topicId?: number;
  chatInviteLink?: string;
  exportedInvites?: ApiExportedInvite[];
  isSubscription?: boolean;
  isCourse?: boolean;
  startDate?: string;
  endDate?: string;
  subscriptionCost?: string;
  isCreator?: boolean;
  nextPayDate?: number;
} & Pick<GlobalState, 'lastSyncTime'>;

const runDebounced = debounce((cb) => cb(), 500, false);

const QR_SIZE = 310;

const qrCode = new QRCodeStyling({
  width: QR_SIZE,
  height: QR_SIZE,
  type: 'svg',

  dotsOptions: {
    type: 'rounded',
    color: '#fff',
  },
  backgroundOptions: {
    color: '#6CA5F9',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
  },
  image: Logo,
  imageOptions: {
    imageSize: 0.3,
    margin: 3,
  },
  qrOptions: {
    errorCorrectionLevel: 'Q',
  },
});

const ChatExtra: FC<OwnProps & StateProps> = ({
  lastSyncTime,
  user,
  chat,
  forceShowSelf,
  canInviteUsers,
  isMuted,
  topicId,
  chatInviteLink,
  exportedInvites,
  isCourse,
  isSubscription,
  startDate,
  endDate,
  subscriptionCost,
  isCreator,
  nextPayDate,
  onScreenSelect,
}) => {
  const {
    loadFullUser,
    showNotification,
    updateTopicMutedState,
    updateChatMutedState,
    getPaidSubscriptions,
    exportChatInvite,
    apiUpdate,
    signOut,
  } = getActions();

  const { id: userId, fullInfo, usernames, isSelf, isPublic } = user || {};
  const { id: chatId, usernames: chatUsernames } = chat || {};

  if ((isSelf && !forceShowSelf) || (chat && chat.isRestricted)) {
    return null;
  }

  const { t } = useTranslation();
  const [isOpenLink, setIsOpenLink] = useState(false);
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(
    !isMuted
  );
  const [isLogOutOpen, openLogOut, closeLogOut] = useFlag();

  const openInvitationLinkModal = useLastCallback(() => {
    setIsOpenLink(true);
  });

  const closeInvitationLinkModal = useLastCallback(() => {
    setIsOpenLink(false);
  });

  const isTopicInfo = Boolean(topicId && topicId !== MAIN_THREAD_ID);

  const activeUsernames = useMemo(() => {
    const result = usernames?.filter((u) => u.isActive);

    return result?.length ? result : undefined;
  }, [usernames]);

  const activeChatUsernames = useMemo(() => {
    const result = !user
      ? chatUsernames?.filter((u) => u.username && u.isActive)
      : undefined;

    return result?.length ? result : undefined;
  }, [chatUsernames, user]);

  const invite =
    isSelf &&
    !isPublic &&
    exportedInvites?.find((el) => !el.usageLimit && !el.expireDate)?.link;

  const link = useMemo(() => {
    if (!chat) {
      return `${APP_LINK_PREFIX}${activeUsernames?.[0].username}`;
    }
    return isTopicInfo
      ? getTopicLink(chat.id, activeChatUsernames?.[0].username, topicId)
      : isSelf && !isPublic
      ? invite
      : getChatLink(chat);
  }, [
    chat,
    user,
    isTopicInfo,
    invite,
    activeChatUsernames,
    topicId,
    chatInviteLink,
  ]);

  function copy(text: string, entity: string) {
    copyTextToClipboard(text);
    showNotification({ message: `${entity} ${t('Copy.WasCopied')}` });
  }

  const handleNotificationChange = useCallback(() => {
    setAreNotificationsEnabled((current) => {
      const newAreNotificationsEnabled = !current;

      runDebounced(() => {
        if (isTopicInfo) {
          updateTopicMutedState({
            chatId: chatId!,
            topicId: topicId!,
            isMuted: !newAreNotificationsEnabled,
          });
        } else {
          updateChatMutedState({
            chatId: chatId!,
            isMuted: !newAreNotificationsEnabled,
          });
        }
      });

      return newAreNotificationsEnabled;
    });
  }, [
    chatId,
    isTopicInfo,
    topicId,
    updateChatMutedState,
    updateTopicMutedState,
  ]);

  const handleCopyInvite = useLastCallback(() => {
    if (link) {
      copy(link, t('Link.Invitation'));
    }
  });

  const goInviteLinkPage = useLastCallback(() => {
    onScreenSelect! && onScreenSelect(SettingsScreens.InvitationLink);
  });

  const description = fullInfo?.bio || getChatDescription(chat!);
  function renderSwitchNotification() {
    return (
      <div className='settings-item settings-item-header'>
        <span className='subtitle'>{t('Notifications')}</span>
        <div
          className='switcher-wrap'
          role='button'
          onClick={handleNotificationChange}
        >
          <Switcher
            id='group-notifications'
            label={
              userId ? 'Toggle User Notifications' : 'Toggle Chat Notifications'
            }
            checked={areNotificationsEnabled}
            inactive
            color='reverse'
          />
        </div>
      </div>
    );
  }

  const handleLogOut = useLastCallback(() => {
    openLogOut();
  });

  const handleAddAcount = useLastCallback(() => {
    apiUpdate({
      '@type': 'updateAuthorizationState',
      authorizationState: 'authorizationStateWaitPassword',
    });
  });

  const onDownloadQr = () => {
    qrCode.download({
      extension: 'jpeg',
    });
  };

  function renderUsernames(usernameList: ApiUsername[], isChat?: boolean) {
    const [mainUsername] = usernameList;
    const username = isChat
      ? isSelf && !isPublic
        ? invite
        : `${APP_LINK_PREFIX}${mainUsername.username}`
      : `@${mainUsername.username}`;
    return (
      <div className='settings-item settings-item-header'>
        <div
          className='invite-link'
          role='button'
          onClick={
            isChat
              ? openInvitationLinkModal
              : () => copy(String(username), t('Username'))
          }
        >
          <p className='subtitle' dir='auto'>
            {t(isChat ? 'Link.Invite' : 'Login.place_username')}
          </p>
          <p className='title link'>{username}</p>
        </div>
        {isChat && (
          <div className='ChatExtraActions'>
            <Button
              round
              color='translucent'
              className='activated'
              onClick={() =>
                copy(String(username), t(isChat ? 'Link.Invite' : 'Username'))
              }
              ariaLabel='Copy'
            >
              <i className='icon-svg'>
                <IconSvg name='copy' w='24' h='24' />
              </i>
            </Button>
            <Button
              round
              color='translucent'
              className='activated'
              onClick={goInviteLinkPage}
              ariaLabel='Go invite link page'
            >
              <i className='icon-svg'>
                <IconSvg name='qr' />
              </i>
            </Button>
          </div>
        )}
      </div>
    );
  }

  const handleSignOutMessage = useLastCallback(() => {
    closeLogOut();
    signOut({ forceInitApi: true });
  });

  useEffect(() => {
    if (lastSyncTime) {
      if (userId) {
        loadFullUser({ userId });
      } else {
        getPaidSubscriptions();
      }
    }
  }, [loadFullUser, userId, lastSyncTime, getPaidSubscriptions]);

  useEffect(() => {
    if (chat && exportedInvites && !exportedInvites?.length && !isPublic) {
      exportChatInvite({ chatId: chat!.id });
    }
  }, [exportedInvites, isPublic, chat]);

  useEffect(() => {
    if (link) qrCode.update({ data: link });
  }, [link]);

  return (
    <div className='ChatExtra'>
      {/* {forceShowSelf && (
        <>
          <ListItem
            className='settings-item settings-item-header svg-rotate'
            isStatic={true}
            leftElement={<Avatar peer={user} size='tiny' />}
            secondaryIcon='filled'
            contextActions={[
              {
                title: t('Settings.Logout'),
                icon: 'logout',
                handler: handleLogOut,
              },
            ]}
          >
            <div className='middle'>{getUserFullName(user as ApiUser)}</div>
          </ListItem>
          <ListItem
            className='settings-item settings-item-header'
            onClick={handleAddAcount}
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='plus' color='#0A49A5' />
              </i>
            }
          >
            <div className='middle'>{t('Settings.AddAccount')}</div>
          </ListItem>
        </>
      )} */}
      {(isSubscription || isCourse) && (
        <div className='section group-link'>
          {isCourse && (
            <>
              <ListItem
                className='underline'
                isStatic={!isCreator}
                leftElement={
                  <i className='icon-svg'>
                    <IconSvg name='calendar' />
                  </i>
                }
              >
                <div className='middle'>{t('Channel.StartDateCourse')}</div>
                <span className='badge-counter'>
                  {formatDateToString(Number(startDate))}
                </span>
              </ListItem>
              <ListItem
                className='underline'
                isStatic={!isCreator}
                leftElement={
                  <i className='icon-svg'>
                    <IconSvg name='calendar' />
                  </i>
                }
              >
                <div className='middle'>{t('Channel.EndCourse')}</div>
                <span className='badge-counter'>
                  {formatDateToString(Number(endDate))}
                </span>
              </ListItem>
            </>
          )}
          {nextPayDate && (
            <ListItem
              className='underline'
              isStatic
              leftElement={
                <i className='icon-svg'>
                  <IconSvg name='calendar' />
                </i>
              }
            >
              <div className='middle'>{t('Channel.NextDueDate')}</div>
              <span className='badge-counter'>
                {formatDateToString(Number(nextPayDate) * 1000)}
              </span>
            </ListItem>
          )}
          <ListItem
            isStatic={!isCreator}
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='withdraw' />
              </i>
            }
          >
            <div className='middle'>
              {t(
                isCourse
                  ? 'Channel.OnlineCourseFee'
                  : 'Channel.SubscriptionCost'
              )}
            </div>
            <span className='badge-counter amount'>
              <span className='price'>
                <IconSvg name='dollar' w='18' h='18' />
                {getMoneyFormat(subscriptionCost, 2, 2) ?? 0}
              </span>
            </span>
          </ListItem>
        </div>
      )}

      {activeUsernames &&
        isPublic &&
        renderUsernames(activeUsernames, user?.isSelf)}

      {isChatChannel(chat!) && activeChatUsernames && (
        <div className='settings-item settings-item-header'>
          <div className='invite-link' role='button' onClick={handleCopyInvite}>
            <p className='subtitle' dir='auto'>
              {t('Link.Channel')}
            </p>
            <p className='title text-primary'>{`@${
              activeChatUsernames![0].username
            }`}</p>
          </div>
        </div>
      )}

      {((activeChatUsernames && canInviteUsers && !isChatChannel(chat!)) ||
        isTopicInfo) && (
        <div className='settings-item settings-item-header'>
          <div className='invite-link'>
            <h5 className='text-primary'>{t('Link.Public')}</h5>
            <div className='title link'>
              <div role='button' onClick={handleCopyInvite}>
                <p className='title link'>{`@${
                  activeChatUsernames![0].username
                }`}</p>
                <p className='subtitle' dir='auto'>
                  {t('Link.Invite')}
                </p>
              </div>
              <Button
                round
                color='translucent'
                className='activated'
                onClick={onDownloadQr}
                ariaLabel='Get QR code'
              >
                <i className='icon-svg'>
                  <IconSvg name='qr' />
                </i>
              </Button>
            </div>
          </div>
        </div>
      )}

      {description && Boolean(description.length) && (
        <div className='settings-item settings-item-header'>
          <p className='word-break' dir='auto'>
            <span className='subtitle d-block'>Description</span>
            {renderText(description, ['br', 'links', 'emoji'])}
          </p>
        </div>
      )}
      {!forceShowSelf && renderSwitchNotification()}
      <InvitationLinkModal
        link={String(link)}
        isOpen={isOpenLink}
        onClose={closeInvitationLinkModal}
        handleCopy={handleCopyInvite}
        onScreenSelect={onScreenSelect}
      />
      <ConfirmDialog
        isOpen={isLogOutOpen}
        onClose={closeLogOut}
        title={String(t('Settings.Logout'))}
        text={String(t('Settings.SureLogout'))}
        confirmLabel={String(t('Settings.Logout'))}
        confirmHandler={handleSignOutMessage}
        confirmIsDestructive
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatOrUserId }): StateProps => {
    const { lastSyncTime, subscriptionsList } = global;
    const { management } = selectTabState(global);
    const chat = chatOrUserId ? selectChat(global, chatOrUserId) : undefined;

    const { invites } = management.byChatId[chat?.id!] || {};
    const user = isUserId(chatOrUserId)
      ? selectUser(global, chatOrUserId)
      : undefined;
    const isForum = chat?.isForum;
    const isMuted =
      chat &&
      selectIsChatMuted(
        chat,
        selectNotifySettings(global),
        selectNotifyExceptions(global)
      );
    const { threadId } = selectCurrentMessageList(global) || {};
    const topicId = isForum ? Number(threadId) : undefined;

    const chatInviteLink = chat
      ? selectChatFullInfo(global, chat.id)?.inviteLink
      : undefined;
    const canInviteUsers =
      chat &&
      !user &&
      ((!isChatChannel(chat) && !isUserRightBanned(chat, 'inviteUsers')) ||
        getHasAdminRight(chat, 'inviteUsers'));

    const isSubscription = chat && isChatSubscription(chat);
    const isCourse = chat && isChatCourse(chat);
    const isCreator = chat?.isCreator;
    const subscription = subscriptionsList.find(
      ({ peer_id, is_active }) =>
        peer_id && peer_id.toString() === chat?.id.slice(1) && is_active
    );

    return {
      lastSyncTime,
      chat,
      user,
      canInviteUsers,
      isMuted,
      topicId,
      chatInviteLink,
      exportedInvites: invites,
      isCourse,
      isSubscription,
      subscriptionCost: chat?.cost,
      startDate: chat?.startDate,
      endDate: chat?.endDate,
      isCreator,
      nextPayDate: subscription?.expire_at,
    };
  })(ChatExtra)
);
