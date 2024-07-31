import React, { FC, memo, useCallback, useEffect } from 'react';
import { getActions, withGlobal } from '../../global';

import type { MessageListType } from '../../global/types';

import {
  selectCanDeleteSelectedMessages,
  selectCanDownloadSelectedMessages,
  selectCanForwardMessages,
  selectCanReportSelectedMessages,
  selectCurrentMessageList,
  selectTabState,
  selectHasProtectedMessage,
  selectSelectedMessagesCount,
} from '../../global/selectors';
import captureKeyboardListeners from '../../util/captureKeyboardListeners';

import useFlag from '../../hooks/useFlag';
import usePrevious from '../../hooks/usePrevious';
import useCopySelectedMessages from './hooks/useCopySelectedMessages';

import Button from '../ui/Button';
import DeleteSelectedMessageModal from './DeleteSelectedMessageModal';
import ReportModal from '../common/ReportModal';

import './MessageSelectToolbar.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../ui/IconSvg';

export type OwnProps = {
  isActive?: boolean;
  canPost?: boolean;
  messageListType?: MessageListType;
};

type StateProps = {
  isSchedule: boolean;
  selectedMessagesCount?: number;
  canDeleteMessages?: boolean;
  canReportMessages?: boolean;
  canDownloadMessages?: boolean;
  canForwardMessages?: boolean;
  hasProtectedMessage?: boolean;
  isAnyModalOpen?: boolean;
  selectedMessageIds?: number[];
};

const MessageSelectToolbar: FC<OwnProps & StateProps> = ({
  canPost,
  isActive,
  messageListType,
  isSchedule,
  selectedMessagesCount,
  canDeleteMessages,
  canReportMessages,
  canDownloadMessages,
  canForwardMessages,
  hasProtectedMessage,
  isAnyModalOpen,
  selectedMessageIds,
}) => {
  const {
    exitMessageSelectMode,
    openForwardMenuForSelectedMessages,
    downloadSelectedMessages,
    copySelectedMessages,
    showNotification,
  } = getActions();
  const { t } = useTranslation();

  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useFlag();
  const [isReportModalOpen, openReportModal, closeReportModal] = useFlag();

  useCopySelectedMessages(isActive);

  const handleExitMessageSelectMode = useCallback(() => {
    exitMessageSelectMode();
  }, [exitMessageSelectMode]);

  useEffect(() => {
    return isActive &&
      !isDeleteModalOpen &&
      !isReportModalOpen &&
      !isAnyModalOpen
      ? captureKeyboardListeners({
          onBackspace: canDeleteMessages ? openDeleteModal : undefined,
          onDelete: canDeleteMessages ? openDeleteModal : undefined,
          onEsc: handleExitMessageSelectMode,
        })
      : undefined;
  }, [
    isActive,
    isDeleteModalOpen,
    isReportModalOpen,
    openDeleteModal,
    handleExitMessageSelectMode,
    isAnyModalOpen,
    canDeleteMessages,
  ]);

  const handleCopy = useCallback(() => {
    copySelectedMessages();
    exitMessageSelectMode();
  }, [copySelectedMessages, exitMessageSelectMode]);

  const handleDownload = useCallback(() => {
    downloadSelectedMessages();
    exitMessageSelectMode();
  }, [downloadSelectedMessages, exitMessageSelectMode]);

  const prevSelectedMessagesCount = usePrevious(
    selectedMessagesCount || undefined,
    true
  );
  const renderingSelectedMessagesCount = isActive
    ? selectedMessagesCount
    : prevSelectedMessagesCount;

  const formattedMessagesCount = t('Chat.MessagesSelected', {
    renderingSelectedMessagesCount,
  });

  const className = classNames('MessageSelectToolbar', {
    'with-composer': canPost,
    shown: isActive,
  });

  const renderButton = (
    icon: string,
    label: string,
    onClick: AnyToVoidFunction,
    destructive?: boolean
  ) => {
    return (
      <div
        role='button'
        tabIndex={0}
        className={classNames('item', { destructive })}
        onClick={onClick}
        title={label}
      >
        <i className={`icon-svg ${icon}`}>
          <IconSvg name={icon} w='24' h='24' />
        </i>
      </div>
    );
  };

  return (
    <div className={className}>
      <div className='MessageSelectToolbar-inner'>
        <Button
          color='translucent'
          round
          onClick={handleExitMessageSelectMode}
          ariaLabel='Exit select mode'
        >
          <i className='icon-svg'>
            <IconSvg name='close' />
          </i>
        </Button>
        <span
          className='MessageSelectToolbar-count'
          title={formattedMessagesCount}
        >
          {formattedMessagesCount}
        </span>

        {Boolean(selectedMessagesCount) && (
          <div className='MessageSelectToolbar-actions'>
            {messageListType !== 'scheduled' &&
              canForwardMessages &&
              renderButton(
                'forward',
                t('Chat.ForwardActionHeader'),
                openForwardMenuForSelectedMessages
              )}
            {canReportMessages &&
              renderButton('flag', t('ReportMessages'), openReportModal)}
            {canDownloadMessages &&
              !hasProtectedMessage &&
              renderButton('download', t('lng_media_download'), handleDownload)}
            {!hasProtectedMessage &&
              renderButton(
                'copy',
                t('Copy.ContextCopySelectedItems'),
                handleCopy
              )}
            {canDeleteMessages &&
              renderButton('delete', t('Chat.Delete'), openDeleteModal, true)}
          </div>
        )}
      </div>
      <DeleteSelectedMessageModal
        isOpen={isDeleteModalOpen}
        isSchedule={isSchedule}
        onClose={closeDeleteModal}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        messageIds={selectedMessageIds}
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const tabState = selectTabState(global);
    const { type: messageListType, chatId } =
      selectCurrentMessageList(global) || {};
    const isSchedule = messageListType === 'scheduled';
    const { canDelete } = selectCanDeleteSelectedMessages(global);
    const canReport = Boolean(
      !isSchedule && selectCanReportSelectedMessages(global)
    );
    const canDownload = selectCanDownloadSelectedMessages(global);
    const { messageIds: selectedMessageIds } = tabState.selectedMessages || {};
    const hasProtectedMessage = chatId
      ? selectHasProtectedMessage(global, chatId, selectedMessageIds)
      : false;
    const canForward =
      !isSchedule && chatId
        ? selectCanForwardMessages(global, chatId, selectedMessageIds)
        : false;
    const isForwardModalOpen = tabState.forwardMessages.isModalShown;
    const isAnyModalOpen = Boolean(
      isForwardModalOpen ||
        tabState.requestedDraft ||
        tabState.requestedAttachBotInChat ||
        tabState.requestedAttachBotInstall
    );

    return {
      isSchedule,
      selectedMessagesCount: selectSelectedMessagesCount(global),
      canDeleteMessages: canDelete,
      canReportMessages: canReport,
      canDownloadMessages: canDownload,
      canForwardMessages: canForward,
      selectedMessageIds,
      hasProtectedMessage,
      isAnyModalOpen,
    };
  })(MessageSelectToolbar)
);
