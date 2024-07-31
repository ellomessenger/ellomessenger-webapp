import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import QRCodeStyling from 'qr-code-styling';
import { ApiChat, ApiExportedInvite, ApiUser } from '../../../api/types';

import './SettingsInvitationLink.scss';
import { isUserId } from '../../../global/helpers';
import { getActions, withGlobal } from '../../../global';
import {
  selectChat,
  selectTabState,
  selectUser,
} from '../../../global/selectors';
import ListItem from '../../ui/ListItem';
import IconSvg from '../../ui/IconSvg';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';
import { copyTextToClipboard } from '../../../util/clipboard';
import { SettingsScreens } from '../../../types';
import Transition from '../../ui/Transition';
import SettingsCreateInviteLink from './SettingsCreateInviteLink';
import useHistoryBack from '../../../hooks/useHistoryBack';

import Logo from '../../../assets/logo-qr.png';
import InviteLink from '../../common/InviteLink';
import { APP_LINK_PREFIX } from '../../../config';
import Avatar from '../../common/Avatar';
import useFlag from '../../../hooks/useFlag';
import { getServerTime } from '../../../util/serverTime';
import { formatCountdown } from '../../../util/dateFormat';
import classNames from 'classnames';
import ConfirmDialog from '../../ui/ConfirmDialog';

type StateProps = {
  chat?: ApiChat;
  user?: ApiUser;
  currentUserId?: string;
  exportedInvites?: ApiExportedInvite[];
  revokedExportedInvites?: ApiExportedInvite[];
  lastSyncTime?: number;
};

type OwnProps = {
  shownScreen: SettingsScreens;
  onScreenSelect: (screen: SettingsScreens) => void;
  isActive?: boolean;
  onReset: () => void;
};

const QR_SIZE = 203;

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

const BULLET = '\u2022';

function inviteComparator(i1: ApiExportedInvite, i2: ApiExportedInvite) {
  const { isPermanent: i1IsPermanent, usage: i1Usage = 0, date: i1Date } = i1;
  const { isPermanent: i2IsPermanent, usage: i2Usage = 0, date: i2Date } = i2;
  if (i1IsPermanent || i2IsPermanent)
    return Number(i1IsPermanent) - Number(i2IsPermanent);
  if (i1Usage || i2Usage) return i2Usage - i1Usage;
  return i2Date - i1Date;
}

const SettingsInvitationLink: FC<StateProps & OwnProps> = ({
  chat,
  user,
  shownScreen,
  onScreenSelect,
  isActive,
  onReset,
  exportedInvites,
  revokedExportedInvites,
  lastSyncTime,
}) => {
  const {
    showNotification,
    loadExportedChatInvites,
    setEditingExportedInvite,
    editExportedChatInvite,
    deleteExportedChatInvite,
    deleteRevokedExportedChatInvites,
    setLeftScreen,
    setMiddleScreen,
  } = getActions();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { usernames, isPublic } = user || {};

  const [deletingInvite, setDeletingInvite] = useState<
    ApiExportedInvite | undefined
  >();
  const [revokingInvite, setRevokingInvite] = useState<
    ApiExportedInvite | undefined
  >();
  const [isDeleteDialogOpen, openDeleteDialog, closeDeleteDialog] = useFlag();
  const [isRevokeDialogOpen, openRevokeDialog, closeRevokeDialog] = useFlag();
  const [
    isDeleteRevokeAllDialogOpen,
    openDeleteRevokeAllDialog,
    closeDeleteRevokeAllDialog,
  ] = useFlag();

  const temporalInvites = useMemo(() => {
    const invites = usernames
      ? exportedInvites
      : exportedInvites?.filter(({ isPermanent }) => !isPermanent);
    return invites?.sort(inviteComparator);
  }, [chat?.usernames, exportedInvites]);

  const activeUsernames = useMemo(() => {
    const result = usernames?.filter((u) => u.isActive);

    return result?.length ? result : undefined;
  }, [usernames]);

  const invite = exportedInvites?.find(
    (el) => !el.usageLimit && !el.expireDate
  )?.link;

  const link = useMemo(() => {
    return !isPublic
      ? invite
      : `${APP_LINK_PREFIX}${activeUsernames?.[0].username}`;
  }, [activeUsernames, invite]);

  function copy(text: string, entity: string) {
    copyTextToClipboard(text);
    showNotification({ message: `${entity} was copied` });
  }

  const handleCreateNewLink = useCallback(() => {
    onScreenSelect(SettingsScreens.CreateLink);
  }, []);

  const copyLink = useCallback(
    (link: string) => {
      copyTextToClipboard(link);
      showNotification({
        message: t('Link.Copied'),
      });
    },
    [showNotification]
  );

  const editInvite = (invite: ApiExportedInvite) => {
    if (chat) {
      setEditingExportedInvite({ chatId: chat.id, invite });
      onScreenSelect(SettingsScreens.CreateLink);
    }
  };

  const askToDelete = useCallback(
    (invite: ApiExportedInvite) => {
      setDeletingInvite(invite);
      openDeleteDialog();
    },
    [openDeleteDialog]
  );

  const askToRevoke = useCallback(
    (invite: ApiExportedInvite) => {
      setRevokingInvite(invite);
      openRevokeDialog();
    },
    [openRevokeDialog]
  );

  const revokeInvite = useCallback(
    (invite: ApiExportedInvite) => {
      const { link, title, isRequestNeeded, expireDate, usageLimit } = invite;
      editExportedChatInvite({
        chatId: chat?.id!,
        link,
        title,
        isRequestNeeded,
        expireDate,
        usageLimit,
        isRevoked: true,
      });
    },
    [chat, editExportedChatInvite]
  );

  const handleRevoke = useCallback(() => {
    if (!revokingInvite) return;
    revokeInvite(revokingInvite);
    setRevokingInvite(undefined);
    closeRevokeDialog();
  }, [closeRevokeDialog, revokeInvite, revokingInvite]);

  const deleteInvite = useCallback(
    (invite: ApiExportedInvite) => {
      deleteExportedChatInvite({ chatId: chat?.id!, link: invite.link });
    },
    [chat, deleteExportedChatInvite]
  );

  const handleDelete = useCallback(() => {
    if (!deletingInvite) return;
    deleteInvite(deletingInvite);
    setDeletingInvite(undefined);
    closeDeleteDialog();
  }, [closeDeleteDialog, deleteInvite, deletingInvite]);

  const handleDeleteAllRevoked = useCallback(() => {
    deleteRevokedExportedChatInvites({ chatId: chat?.id! });
    closeDeleteRevokeAllDialog();
  }, [chat, closeDeleteRevokeAllDialog, deleteRevokedExportedChatInvites]);

  const prepareContextActions = (invite: ApiExportedInvite) => {
    const actions = [
      {
        title: t('Link.Copy'),
        icon: 'copy',
        handler: () => copyLink(invite.link),
      },
    ];

    if (!invite.isPermanent && !invite.isRevoked) {
      actions.push({
        title: t('Edit'),
        icon: 'edit',
        handler: () => editInvite(invite),
      });
    }

    if (invite.isRevoked) {
      actions.push({
        title: t('Link.Delete'),
        icon: 'delete',
        handler: () => askToDelete(invite),
      });
    } else {
      actions.push({
        title: t('Link.Revoke'),
        icon: 'delete',
        handler: () => askToRevoke(invite),
      });
    }

    return actions;
  };

  const prepareUsageText = (invite: ApiExportedInvite) => {
    const {
      usage = 0,
      usageLimit,
      expireDate,
      isPermanent,
      requested,
      isRevoked,
    } = invite;
    let text = '';
    if (!isRevoked && usageLimit && usage < usageLimit) {
      text = t('Link.CanJoin', { count: usageLimit - usage });
    } else if (usage) {
      text = t('Link.PeopleJoined', { count: usage });
    } else {
      text = t('Link.NoOneJoined');
    }

    if (isRevoked) {
      text += ` ${BULLET} ${t('Revoked')}`;
      return text;
    }

    if (requested) {
      text += ` ${BULLET} ${t('Link.JoinRequests', { requested })}`;
    }

    if (usageLimit !== undefined && usage === usageLimit) {
      text += ` ${BULLET} ${t('LimitReached')}`;
    } else if (expireDate) {
      const diff = (expireDate - getServerTime()) * 1000;
      text += ` ${BULLET} `;
      if (diff > 0) {
        text += t('Link.ExpiresIn', {
          link: String(formatCountdown(t, diff)),
        });
      } else {
        text += t('Link.Expired');
      }
    } else if (isPermanent) {
      text += ` ${BULLET} ${t('Link.Primary')}`;
    }

    return text;
  };

  const getInviteIconClass = (invite: ApiExportedInvite) => {
    const { usage = 0, usageLimit, isRevoked, expireDate } = invite;
    if (isRevoked) {
      return 'invite-link-inactive';
    }
    if (usageLimit && usage < usageLimit) {
      return 'link-status-icon-green';
    }
    if (expireDate) {
      const diff = (expireDate - getServerTime()) * 1000;
      if (diff <= 0) {
        return 'link-status-icon-red';
      }
    }
    return 'link-status-icon-blue';
  };

  useEffect(() => {
    qrCode.append(qrCodeRef.current!);
  }, []);

  useEffect(() => {
    qrCode.update({ data: link });
  }, [link]);

  useEffect(() => {
    if (lastSyncTime && chat) {
      loadExportedChatInvites({ chatId: chat.id, isRevoked: true });
    }
  }, [chat, loadExportedChatInvites, lastSyncTime]);

  function renderCurrentSectionContent() {
    switch (shownScreen) {
      case SettingsScreens.CreateLink:
        return (
          <SettingsCreateInviteLink
            isActive={isActive}
            onReset={onReset}
            onScreenSelect={onScreenSelect}
          />
        );
      default:
        return (
          <div className='settings-invitation'>
            <div className='qr-inner'>
              <div className='qr-wrapper'>
                <Avatar peer={user || chat} size='jumbo' />
                <div className='qr-container' ref={qrCodeRef} />
                <h3>{`@${activeUsernames?.[0].username}`}</h3>
              </div>

              <div className='title'>{t('Link.Invite')}</div>
              <InviteLink
                inviteLink={link || ''}
                onRevoke={!chat?.usernames ? () => true : undefined}
              />
              <Button
                isLink
                className='mb-1 mt-3'
                onClick={handleCreateNewLink}
              >
                <i className='icon-add mr-3' /> {t('Link.CreateNew')}
              </Button>

              <div className='links-list'>
                {temporalInvites?.map((invite) => (
                  <ListItem
                    ripple
                    leftElement={
                      <i className='icon-svg'>
                        <IconSvg name='link' />
                      </i>
                    }
                    secondaryIcon='filled'
                    className='invite-link chat-item-clickable smaller underline'
                    contextActions={prepareContextActions(invite)}
                    key={invite.link}
                  >
                    <div className='info'>
                      <div className='link-title'>
                        {invite.title ||
                          invite.link.replace(`${APP_LINK_PREFIX}+`, '')}
                      </div>
                      <div className='subtitle'>{prepareUsageText(invite)}</div>
                    </div>
                  </ListItem>
                ))}
              </div>
              {revokedExportedInvites &&
                Boolean(revokedExportedInvites.length) && (
                  <>
                    <div className='title'>{t('Link.Revoked')}</div>
                    <div className='links-list'>
                      {revokedExportedInvites?.map((invite) => (
                        <ListItem
                          ripple
                          leftElement={
                            <i className='icon-svg'>
                              <IconSvg name='link' />
                            </i>
                          }
                          secondaryIcon='filled'
                          className={classNames(
                            'invite-link chat-item-clickable smaller underline',
                            getInviteIconClass(invite)
                          )}
                          contextActions={prepareContextActions(invite)}
                          key={invite.link}
                        >
                          <div className='info'>
                            <div className='link-title'>
                              {invite.title ||
                                invite.link.replace(`${APP_LINK_PREFIX}+`, '')}
                            </div>
                            <div className='subtitle'>
                              {prepareUsageText(invite)}
                            </div>
                          </div>
                        </ListItem>
                      ))}
                    </div>
                    <Button
                      isLink
                      color='danger'
                      className='mb-1'
                      onClick={openDeleteRevokeAllDialog}
                    >
                      <i className='icon-svg mr-3'>
                        <IconSvg name='delete' />
                      </i>
                      {t('Link.RemoveAll')}
                    </Button>
                  </>
                )}
            </div>
          </div>
        );
    }
  }

  return (
    <div className='settings-container'>
      <Transition name='fade' activeKey={shownScreen}>
        {renderCurrentSectionContent()}
      </Transition>

      <ConfirmDialog
        isOpen={isRevokeDialogOpen}
        onClose={closeRevokeDialog}
        title={String(t('Link.Reset'))}
        text={String(t('Link.ResetAlert'))}
        confirmIsDestructive
        confirmLabel={String(t('Link.Remove'))}
        confirmHandler={handleRevoke}
      />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        title={String(t('Link.Remove'))}
        text={String(t('Link.RevokeAlert'))}
        confirmIsDestructive
        confirmLabel={String(t('Delete'))}
        confirmHandler={handleDelete}
      />
      <ConfirmDialog
        isOpen={isDeleteRevokeAllDialogOpen}
        onClose={closeDeleteRevokeAllDialog}
        title={String(t('Link.DeleteAllRevoked'))}
        text={String(t('Link.DeleteAllRevokedLinkHelp'))}
        confirmIsDestructive
        confirmLabel={String(t('DeleteAll'))}
        confirmHandler={handleDeleteAllRevoked}
      />
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { currentUserId } = global;
    const { management } = selectTabState(global);

    const user = isUserId(currentUserId!)
      ? selectUser(global, currentUserId!)
      : undefined;
    const chat = currentUserId ? selectChat(global, currentUserId) : undefined;
    const { invites, revokedInvites } = management.byChatId[chat?.id!] || {};

    return {
      currentUserId,
      chat,
      user,
      lastSyncTime: global.lastSyncTime,
      exportedInvites: invites,
      revokedExportedInvites: revokedInvites,
    };
  })(SettingsInvitationLink)
);
