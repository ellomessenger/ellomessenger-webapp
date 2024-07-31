import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiChat, ApiExportedInvite } from '../../../api/types';
import { ManagementScreens } from '../../../types';

import { APP_LINK_PREFIX, TME_LINK_PREFIX } from '../../../config';
import { formatCountdown, MILLISECONDS_IN_DAY } from '../../../util/dateFormat';
import { getMainUsername, isChatChannel } from '../../../global/helpers';
import { selectChat, selectTabState } from '../../../global/selectors';
import { copyTextToClipboard } from '../../../util/clipboard';
import { getServerTime } from '../../../util/serverTime';
import useHistoryBack from '../../../hooks/useHistoryBack';
import useInterval from '../../../hooks/useInterval';
import useForceUpdate from '../../../hooks/useForceUpdate';
import useFlag from '../../../hooks/useFlag';
import useAppLayout from '../../../hooks/useAppLayout';

import ListItem from '../../ui/ListItem';
import NothingFound from '../../common/NothingFound';
import Button from '../../ui/Button';

import ConfirmDialog from '../../ui/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { STICKER_SIZE_INVITES } from '../../../config';
import { LOCAL_TGS_URLS } from '../../common/helpers/animatedAssets';

import IconSvg from '../../ui/IconSvg';
import InviteLink from '../../common/InviteLink';
import classNames from 'classnames';
import AnimatedIcon from '../../common/AnimatedIcon';

type OwnProps = {
  chatId: string;
  onClose: NoneToVoidFunction;
  onScreenSelect: (screen: ManagementScreens) => void;
  isActive: boolean;
};

type StateProps = {
  chat?: ApiChat;
  isChannel?: boolean;
  exportedInvites?: ApiExportedInvite[];
  revokedExportedInvites?: ApiExportedInvite[];
};

const BULLET = '\u2022';

function inviteComparator(i1: ApiExportedInvite, i2: ApiExportedInvite) {
  const { isPermanent: i1IsPermanent, usage: i1Usage = 0, date: i1Date } = i1;
  const { isPermanent: i2IsPermanent, usage: i2Usage = 0, date: i2Date } = i2;
  if (i1IsPermanent || i2IsPermanent)
    return Number(i1IsPermanent) - Number(i2IsPermanent);
  if (i1Usage || i2Usage) return i2Usage - i1Usage;
  return i2Date - i1Date;
}

const ManageInvites: FC<OwnProps & StateProps> = ({
  chatId,
  chat,
  exportedInvites,
  revokedExportedInvites,
  isActive,
  isChannel,
  onClose,
  onScreenSelect,
}) => {
  const {
    setEditingExportedInvite,
    showNotification,
    editExportedChatInvite,
    deleteExportedChatInvite,
    deleteRevokedExportedChatInvites,
    setOpenedInviteInfo,
  } = getActions();

  const { t } = useTranslation();

  const [
    isDeleteRevokeAllDialogOpen,
    openDeleteRevokeAllDialog,
    closeDeleteRevokeAllDialog,
  ] = useFlag();
  const [isRevokeDialogOpen, openRevokeDialog, closeRevokeDialog] = useFlag();
  const [revokingInvite, setRevokingInvite] = useState<
    ApiExportedInvite | undefined
  >();
  const [isDeleteDialogOpen, openDeleteDialog, closeDeleteDialog] = useFlag();
  const [deletingInvite, setDeletingInvite] = useState<
    ApiExportedInvite | undefined
  >();
  const { isMobile } = useAppLayout();

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const hasDetailedCountdown = useMemo(() => {
    if (!exportedInvites) return undefined;
    return exportedInvites.some(
      ({ expireDate }) =>
        expireDate && expireDate - getServerTime() < MILLISECONDS_IN_DAY / 1000
    );
  }, [exportedInvites]);
  const forceUpdate = useForceUpdate();
  useInterval(
    () => {
      forceUpdate();
    },
    hasDetailedCountdown ? 1000 : undefined
  );

  const chatMainUsername = useMemo(() => chat && getMainUsername(chat), [chat]);
  const primaryInvite = exportedInvites?.find(({ isPermanent }) => isPermanent);

  const primaryInviteLink = chatMainUsername
    ? `${APP_LINK_PREFIX}${chatMainUsername}`
    : chat?.fullInfo?.inviteLink;

  const temporalInvites = useMemo(() => {
    const invites = chat?.usernames
      ? exportedInvites
      : exportedInvites?.filter(
          ({ link }) => link !== chat?.fullInfo?.inviteLink
        );
    return invites?.sort(inviteComparator);
  }, [chat?.usernames, exportedInvites]);

  const editInvite = (invite: ApiExportedInvite) => {
    setEditingExportedInvite({ chatId, invite });
    onScreenSelect(ManagementScreens.EditInvite);
  };

  const revokeInvite = useCallback(
    (invite: ApiExportedInvite) => {
      const { link, title, isRequestNeeded, expireDate, usageLimit } = invite;
      editExportedChatInvite({
        chatId,
        link,
        title,
        isRequestNeeded,
        expireDate,
        usageLimit,
        isRevoked: true,
      });
    },
    [chatId, editExportedChatInvite]
  );

  const askToRevoke = useCallback(
    (invite: ApiExportedInvite) => {
      setRevokingInvite(invite);
      openRevokeDialog();
    },
    [openRevokeDialog]
  );

  const handleRevoke = useCallback(() => {
    if (!revokingInvite) return;
    revokeInvite(revokingInvite);
    setRevokingInvite(undefined);
    closeRevokeDialog();
  }, [closeRevokeDialog, revokeInvite, revokingInvite]);

  const handleCreateNewClick = useCallback(() => {
    onScreenSelect(ManagementScreens.EditInvite);
  }, [onScreenSelect]);

  const handlePrimaryRevoke = useCallback(() => {
    if (primaryInvite) {
      askToRevoke(primaryInvite);
    }
  }, [askToRevoke, primaryInvite]);

  const handleDeleteAllRevoked = useCallback(() => {
    deleteRevokedExportedChatInvites({ chatId });
    closeDeleteRevokeAllDialog();
  }, [chatId, closeDeleteRevokeAllDialog, deleteRevokedExportedChatInvites]);

  const showInviteInfo = useCallback(
    (invite: ApiExportedInvite) => {
      setOpenedInviteInfo({ chatId, invite });
      onScreenSelect(ManagementScreens.InviteInfo);
    },
    [chatId, onScreenSelect, setOpenedInviteInfo]
  );

  const deleteInvite = useCallback(
    (invite: ApiExportedInvite) => {
      deleteExportedChatInvite({ chatId, link: invite.link });
    },
    [chatId, deleteExportedChatInvite]
  );

  const askToDelete = useCallback(
    (invite: ApiExportedInvite) => {
      setDeletingInvite(invite);
      openDeleteDialog();
    },
    [openDeleteDialog]
  );

  const handleDelete = useCallback(() => {
    if (!deletingInvite) return;
    deleteInvite(deletingInvite);
    setDeletingInvite(undefined);
    closeDeleteDialog();
  }, [closeDeleteDialog, deleteInvite, deletingInvite]);

  const copyLink = useCallback(
    (link: string) => {
      copyTextToClipboard(link);
      showNotification({
        message: t('Link.Copied'),
      });
    },
    [showNotification]
  );

  const handleCopyPrimaryClicked = useCallback(() => {
    copyLink(primaryInviteLink!);
  }, [copyLink, primaryInviteLink]);

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

  const prepareContextActions = (invite: ApiExportedInvite) => {
    const actions: any = [];
    actions.push({
      title: t('Link.Copy'),
      icon: 'copy',
      handler: () => copyLink(invite.link),
    });

    if (!invite.isPermanent && !invite.isRevoked) {
      actions.push({
        title: t('Edit'),
        icon: 'edit',
        handler: () => editInvite(invite),
      });
    }

    actions.push({
      title: t('Link.Share'),
      icon: 'share',
      handler: () => true,
    });

    actions.push({
      title: t('Link.Delete'),
      icon: 'delete',
      handler: () => askToDelete(invite),
    });

    return actions;
  };

  const PrimaryLinkMenuButton: FC<{ onTrigger: () => void; isOpen?: boolean }> =
    useMemo(() => {
      return ({ onTrigger, isOpen }) => (
        <Button
          round
          ripple={!isMobile}
          size='smaller'
          color='translucent'
          className={isOpen ? 'active' : ''}
          onClick={onTrigger}
          ariaLabel='Actions'
        >
          <i className='icon-more' />
        </Button>
      );
    }, [isMobile]);

  return (
    <div className='Management ManageInvites'>
      <div className='custom-scroll'>
        <div className='AvatarEditable'>
          <AnimatedIcon
            tgsUrl={LOCAL_TGS_URLS.Invite}
            size={STICKER_SIZE_INVITES}
          />
        </div>

        <p className='text-center text-gray section-help'>
          {isChannel
            ? t('Invitation.Description')
            : t('Invitation.Description2')}
        </p>

        {primaryInviteLink && (
          <div className='section settings-invitation'>
            <h4 className='section-heading'>{t('Link.Invite')}</h4>
            <InviteLink
              inviteLink={primaryInviteLink}
              //onRevoke={!chat?.usernames ? handlePrimaryRevoke : undefined}
            />
          </div>
        )}

        {/* {exportedInvites && exportedInvites[0].link && !primaryInviteLink && (
          <div className='section'>
            <h4 className='section-heading'>
              {t('Link.Invite')
                }
            </h4>
            <InviteLink inviteLink={exportedInvites[0].link} />
          </div>
        )} */}

        <div className='section settings-invitation' teactFastList>
          <Button isLink className='mb-1 mt-3' onClick={handleCreateNewClick}>
            <i className='icon-add mr-3' /> {t('Link.Create')}
          </Button>

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
                <div className='link-title'>{invite.title || invite.link}</div>
                <div className='subtitle'>{prepareUsageText(invite)}</div>
              </div>
            </ListItem>
          ))}
        </div>
        <p className='section-info'>{t('Invitation.ManageLinksInfoHelp')}</p>
        {revokedExportedInvites && Boolean(revokedExportedInvites.length) && (
          <>
            <div className='section settings-invitation' teactFastList>
              <h4 className='section-heading' key='title'>
                {t('Link.Revoked')}
              </h4>
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
                      {invite.title || invite.link}
                    </div>
                    <div className='subtitle'>{prepareUsageText(invite)}</div>
                  </div>
                </ListItem>
              ))}
            </div>
            <div className='section group-link'>
              <ListItem
                leftElement={
                  <i className='icon-svg destructive'>
                    <IconSvg name='delete' />
                  </i>
                }
                key='delete'
                onClick={openDeleteRevokeAllDialog}
              >
                <span className='title'>{t('Link.DeleteAllRevoked')}</span>
              </ListItem>
            </div>
          </>
        )}
      </div>
      <ConfirmDialog
        isOpen={isDeleteRevokeAllDialogOpen}
        onClose={closeDeleteRevokeAllDialog}
        title={String(t('Link.DeleteAllRevoked'))}
        text={String(t('Link.DeleteAllRevokedLinkHelp'))}
        confirmIsDestructive
        confirmLabel={String(t('DeleteAll'))}
        confirmHandler={handleDeleteAllRevoked}
      />
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
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const { invites, revokedInvites } =
      selectTabState(global).management.byChatId[chatId];
    const chat = selectChat(global, chatId);

    const isChannel = chat && isChatChannel(chat);

    return {
      exportedInvites: invites,
      revokedExportedInvites: revokedInvites,
      chat,
      isChannel,
    };
  })(ManageInvites)
);
