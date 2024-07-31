import React, { FC, memo, useCallback, useEffect } from 'react';
import { getActions, withGlobal } from '../../../global';

import type {
  ApiChatInviteImporter,
  ApiExportedInvite,
  ApiUser,
} from '../../../api/types';

import useHistoryBack from '../../../hooks/useHistoryBack';
import { copyTextToClipboard } from '../../../util/clipboard';
import { getServerTime } from '../../../util/serverTime';
import {
  formatFullDate,
  formatMediaDateTime,
  formatTime,
} from '../../../util/dateFormat';
import { isChatChannel } from '../../../global/helpers';
import { selectChat, selectTabState } from '../../../global/selectors';

import PrivateChatInfo from '../../common/PrivateChatInfo';
import ListItem from '../../ui/ListItem';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  chatId: string;
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

type StateProps = {
  invite?: ApiExportedInvite;
  importers?: ApiChatInviteImporter[];
  requesters?: ApiChatInviteImporter[];
  admin?: ApiUser;
  isChannel?: boolean;
};

const ManageInviteInfo: FC<OwnProps & StateProps> = ({
  chatId,
  invite,
  importers,
  requesters,
  isChannel,
  isActive,
  onClose,
}) => {
  const {
    showNotification,
    loadChatInviteImporters,
    loadChatInviteRequesters,
    openChat,
  } = getActions();

  const { t } = useTranslation();
  const { usage = 0, usageLimit, link, adminId } = invite || {};
  const expireDate =
    invite?.expireDate &&
    (invite.expireDate - getServerTime()) * 1000 + Date.now();
  const isExpired = (invite?.expireDate || 0) - getServerTime() < 0;

  useEffect(() => {
    if (link) {
      loadChatInviteImporters({ chatId, link });
      loadChatInviteRequesters({ chatId, link });
    }
  }, [chatId, link, loadChatInviteImporters, loadChatInviteRequesters]);

  const handleCopyClicked = useCallback(() => {
    copyTextToClipboard(invite!.link);
    showNotification({
      message: t('LinkCopied'),
    });
  }, [invite, showNotification]);

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const renderImporters = () => {
    if (!importers?.length && requesters?.length) return undefined;
    if (!importers) return <Spinner />;
    return (
      <div className='section'>
        <p>
          {importers.length ? t('PeopleJoined', { usage }) : t('NoOneJoined')}
        </p>
        <p className='text-muted'>
          {!importers.length &&
            (usageLimit
              ? t('PeopleCanJoinViaLinkCount', { usage: usageLimit - usage })
              : t('NoOneJoinedYet'))}
          {importers.map((importer) => (
            <ListItem
              className='chat-item-clickable scroll-item small-icon'
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => openChat({ id: importer.userId })}
            >
              <PrivateChatInfo
                userId={importer.userId}
                status={formatMediaDateTime(t, importer.date * 1000, true)}
                forceShowSelf
              />
            </ListItem>
          ))}
        </p>
      </div>
    );
  };

  const renderRequesters = () => {
    if (invite?.isRevoked) return undefined;
    if (!requesters && importers) return <Spinner />;
    if (!requesters?.length) return undefined;
    return (
      <div className='section'>
        <p>{isChannel ? t('SubscribeRequests') : t('MemberRequests')}</p>
        <p className='text-muted'>
          {requesters.map((requester) => (
            <ListItem
              className='chat-item-clickable scroll-item small-icon'
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => openChat({ id: requester.userId })}
            >
              <PrivateChatInfo
                userId={requester.userId}
                status={formatMediaDateTime(t, requester.date * 1000, true)}
                forceShowSelf
              />
            </ListItem>
          ))}
        </p>
      </div>
    );
  };

  return (
    <div className='Management ManageInviteInfo'>
      <div className='custom-scroll'>
        {!invite && <p className='text-muted'>{t('Loading')}</p>}
        {invite && (
          <>
            <div className='section'>
              <h3 className='link-title'>{invite.title || invite.link}</h3>
              <input
                className='form-control'
                value={invite.link}
                readOnly
                onClick={handleCopyClicked}
              />
              <Button className='copy-link' onClick={handleCopyClicked}>
                {t('CopyLink')}
              </Button>
              {Boolean(expireDate) && (
                <p className='text-muted'>
                  {isExpired
                    ? t('ExpiredLink')
                    : t('LinkExpiresIn', {
                        date: `${formatFullDate(t, expireDate)} ${formatTime(
                          t,
                          expireDate
                        )}`,
                      })}
                </p>
              )}
            </div>
            {adminId && (
              <div className='section'>
                <p>{t('LinkCreatedeBy')}</p>
                <ListItem
                  className='chat-item-clickable scroll-item small-icon'
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => openChat({ id: adminId })}
                >
                  <PrivateChatInfo
                    userId={adminId}
                    status={formatMediaDateTime(t, invite.date * 1000, true)}
                    forceShowSelf
                  />
                </ListItem>
              </div>
            )}
            {renderImporters()}
            {renderRequesters()}
          </>
        )}
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const { inviteInfo } = selectTabState(global).management.byChatId[chatId];
    const { invite, importers, requesters } = inviteInfo || {};
    const chat = selectChat(global, chatId);
    const isChannel = chat && isChatChannel(chat);

    return {
      invite,
      importers,
      requesters,
      isChannel,
    };
  })(ManageInviteInfo)
);
