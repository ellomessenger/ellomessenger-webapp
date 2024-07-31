import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiChat } from '../../../api/types';
import { ManagementScreens } from '../../../types';

import { STICKER_SIZE_DISCUSSION_GROUPS } from '../../../config';
import { LOCAL_TGS_URLS } from '../../common/helpers/animatedAssets';
import { selectChat } from '../../../global/selectors';
import useHistoryBack from '../../../hooks/useHistoryBack';

import ListItem from '../../ui/ListItem';
import NothingFound from '../../common/NothingFound';
import GroupChatInfo from '../../common/GroupChatInfo';
import ConfirmDialog from '../../ui/ConfirmDialog';
import useFlag from '../../../hooks/useFlag';
import renderText from '../../common/helpers/renderText';
import Avatar from '../../common/Avatar';
import { isChatChannel } from '../../../global/helpers';
import AnimatedIcon from '../../common/AnimatedIcon';
import Checkbox from '../../ui/Checkbox';
import { useTranslation } from 'react-i18next';

import IconSvg from '../../ui/IconSvg';
import useLastCallback from '../../../hooks/useLastCallback';
import Switcher from '../../ui/Switcher';
import Button from '../../ui/Button';

type OwnProps = {
  chatId: string;
  onScreenSelect: (screen: ManagementScreens) => void;
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

type StateProps = {
  chat?: ApiChat;
  chatsByIds: Record<string, ApiChat>;
  linkedChat?: ApiChat;
  forDiscussionIds?: string[];
  isChannel?: boolean;
};

const ManageDiscussion: FC<OwnProps & StateProps> = ({
  chat,
  onClose,
  isActive,
  chatId,
  chatsByIds,
  linkedChat,
  forDiscussionIds,
  isChannel,
  onScreenSelect,
}) => {
  const {
    loadGroupsForDiscussion,
    linkDiscussionGroup,
    unlinkDiscussionGroup,
    toggleJoinRequest,
    toggleJoinToSend,
  } = getActions();

  const [linkedGroupId, setLinkedGroupId] = useState<string>();
  const [
    isConfirmUnlinkGroupDialogOpen,
    openConfirmUnlinkGroupDialog,
    closeConfirmUnlinkGroupDialog,
  ] = useFlag();
  const [
    isConfirmLinkGroupDialogOpen,
    openConfirmLinkGroupDialog,
    closeConfirmLinkGroupDialog,
  ] = useFlag();

  const { t } = useTranslation();
  const linkedChatId = linkedChat?.id;

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  useEffect(() => {
    loadGroupsForDiscussion();
  }, [loadGroupsForDiscussion]);

  const handleUnlinkGroupSessions = useCallback(() => {
    closeConfirmUnlinkGroupDialog();
    unlinkDiscussionGroup({ channelId: isChannel ? chatId : linkedChatId! });
    loadGroupsForDiscussion();
    if (!isChannel) {
      onScreenSelect(ManagementScreens.Initial);
    }
  }, [
    closeConfirmUnlinkGroupDialog,
    unlinkDiscussionGroup,
    loadGroupsForDiscussion,
    isChannel,
    chatId,
    linkedChatId,
    onScreenSelect,
  ]);

  const handleLinkGroupSessions = useCallback(() => {
    closeConfirmLinkGroupDialog();
    linkDiscussionGroup({ channelId: chatId, chatId: linkedGroupId! });
  }, [closeConfirmLinkGroupDialog, linkDiscussionGroup, chatId, linkedGroupId]);

  const handleJoinToSendCheck = useLastCallback(() => {
    toggleJoinToSend({
      chatId: linkedChatId!,
      isEnabled: !linkedChat?.isJoinToSend,
    });
  });

  const handleJoinRequestCheck = useLastCallback(() => {
    toggleJoinRequest({
      chatId: linkedChatId!,
      isEnabled: !linkedChat?.isJoinRequest,
    });
  });

  const onDiscussionClick = (groupId: string) => {
    setLinkedGroupId(groupId);
    openConfirmLinkGroupDialog();
  };

  const handleCreateNewGroup = useLastCallback(() => {
    onScreenSelect(ManagementScreens.NewGroup);
  });

  function renderUnlinkGroupHeader() {
    return (
      <div className='modal-header justify-center'>
        <div className='pair-icon'>
          <Avatar peer={linkedChat} />
          <Avatar className='main' peer={chat} />
        </div>
      </div>
    );
  }

  function renderLinkGroupHeader() {
    if (!linkedGroupId) return undefined;
    const linkedGroup = chatsByIds[linkedGroupId];
    if (!linkedGroup) return undefined;

    return (
      <div className='modal-header justify-center'>
        <div className='pair-icon'>
          <Avatar peer={linkedGroup} />
          <Avatar className='main' peer={chat} />
        </div>
      </div>
    );
  }

  function renderLinkGroupConfirmText() {
    if (!linkedGroupId) return undefined;
    const linkedGroup = chatsByIds[linkedGroupId];
    if (!linkedGroup) return undefined;

    return (
      <>
        {renderLinkGroupHeader()}
        {renderText(
          // eslint-disable-next-line max-len
          `Do you want make **${
            linkedGroup.title
          }** the discussion board for **${chat!.title}**?`,
          ['br', 'simple_markdown']
        )}
      </>
    );
  }

  function renderLinkedGroup() {
    return (
      <div className='section group-link'>
        <ListItem className='chat-item-clickable' inactive>
          <GroupChatInfo chatId={linkedChat!.id} />
        </ListItem>
        {/* <ListItem
          leftElement={
            <i className='icon-svg destructive'>
              <IconSvg name='minus-outline' />
            </i>
          }
          ripple
          onClick={openConfirmUnlinkGroupDialog}
        >
          {t(isChannel ? 'Group.DiscussionUnlink' : 'Channel.DiscussionUnlink')}
        </ListItem> */}
        <ConfirmDialog
          isOpen={isConfirmUnlinkGroupDialogOpen}
          onClose={closeConfirmUnlinkGroupDialog}
          header={renderUnlinkGroupHeader()}
          textParts={renderText(
            t(
              isChannel
                ? 'Channel.DiscussionUnlinkAlert'
                : 'Group.DiscussionUnlinkAlert',
              { title: linkedChat!.title }
            ).toString(),
            ['br', 'simple_markdown']
          )}
          confirmLabel={t(
            isChannel ? 'Group.DiscussionUnlink' : 'Channel.DiscussionUnlink'
          ).toString()}
          confirmHandler={handleUnlinkGroupSessions}
          confirmIsDestructive
        />
      </div>
    );
  }

  function renderDiscussionGroups() {
    return (
      <>
        <div className='section'>
          <ListItem
            key='create-group'
            buttonClassName='is_link'
            leftElement={
              <i className='icon-svg mr-4'>
                <IconSvg name='plus' />
              </i>
            }
            onClick={handleCreateNewGroup}
          >
            {t('Channel.CommentsAndDiscussions')}
          </ListItem>

          {forDiscussionIds ? (
            forDiscussionIds.map((id, i) => (
              <ListItem
                key={id}
                teactOrderKey={i + 1}
                className='chat-item-clickable scroll-item'
                onClick={() => {
                  onDiscussionClick(id);
                }}
              >
                <GroupChatInfo chatId={id} />
              </ListItem>
            ))
          ) : (
            <NothingFound
              key='nothing-found'
              teactOrderKey={0}
              text='No discussion groups found'
            />
          )}
        </div>
        <ConfirmDialog
          isOpen={isConfirmLinkGroupDialogOpen}
          onClose={closeConfirmLinkGroupDialog}
          textParts={renderLinkGroupConfirmText()}
          confirmLabel={String(t('Group.DiscussionLink'))}
          confirmHandler={handleLinkGroupSessions}
          confirmIsDestructive
        />
      </>
    );
  }

  return (
    <div className='Management'>
      <div className='custom-scroll'>
        <div className='AvatarEditable mt-3'>
          <AnimatedIcon
            tgsUrl={LOCAL_TGS_URLS.DiscussionGroups}
            size={STICKER_SIZE_DISCUSSION_GROUPS}
            className='section-icon'
          />
        </div>

        <p className='text-center text-gray section-help'>
          {t(
            linkedChat
              ? 'Channel.DiscussionHelpLinked'
              : 'Channel.DiscussionHelpUnlinked'
          )}
        </p>

        {linkedChat && (
          <>
            {renderLinkedGroup()}
            <div className='settings-main-menu'>
              <Button
                fullWidth
                color='danger'
                onClick={openConfirmUnlinkGroupDialog}
              >
                Unbind a group
              </Button>
            </div>
          </>
        )}
        {!linkedChat && renderDiscussionGroups()}

        {/* {linkedChat && (
          <>
            <div className='section switcher-list'>
              <h3 className='section-heading'>
                {t('Channel.SettingsJoinTitle')}
              </h3>
              <div className='row row-not-wrap'>
                <span className='label'>{t('Restrictions.Send')}</span>
                <div className='switcher-wrap' role='button'>
                  <Switcher
                    name='joinSend'
                    label={t('Channel.SettingsJoinToSend')}
                    color='reverse'
                    checked={linkedChat?.isJoinToSend}
                    onChange={handleJoinToSendCheck}
                  />
                </div>
              </div>

              {linkedChat?.isJoinToSend && (
                <div className='row'>
                  <span className='label'>{t('Restrictions.Send')}</span>
                  <div className='switcher-wrap' role='button'>
                    <Switcher
                      name='joinRequest'
                      label={t('Channel.SettingsJoinRequest')}
                      color='reverse'
                      checked={linkedChat?.isJoinRequest}
                      onChange={handleJoinRequestCheck}
                    />
                  </div>
                </div>
              )}
            </div>
            <p className='section-info' dir='auto'>
              {linkedChat?.isJoinToSend
                ? t('Channel.SettingsJoinRequestInfo')
                : t('Channel.SettingsJoinToSendInfo')}
            </p>
          </>
        )} */}
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);
    const { forDiscussionIds, byId: chatsByIds } = global.chats;
    const linkedChat = chat?.fullInfo?.linkedChatId
      ? selectChat(global, chat.fullInfo.linkedChatId)
      : undefined;

    return {
      chat,
      chatsByIds,
      forDiscussionIds,
      linkedChat,
      isChannel: chat && isChatChannel(chat),
    };
  })(ManageDiscussion)
);
