import React, { FC, memo, useCallback, useEffect } from 'react';
import { getActions, withGlobal } from '../../global';

import type {
  ApiConfirm,
  ApiContact,
  ApiError,
  ApiInviteInfo,
  ApiPhoto,
} from '../../api/types';
import {
  AnimationLevel,
  LeftColumnContent,
  MiddleColumnContent,
  SettingsScreens,
} from '../../types';

import {
  selectCurrentMessageList,
  selectTabState,
} from '../../global/selectors';
import getReadableErrorText from '../../util/getReadableErrorText';
import { pick } from '../../util/iteratees';
import renderText from '../common/helpers/renderText';
import useFlag from '../../hooks/useFlag';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Avatar from '../common/Avatar';

import './Dialogs.scss';
import { useTranslation } from 'react-i18next';
import { MessageList } from '../../global/types';
import ConfirmPayModal from '../payment/ConfirmPayModal';
import useLastCallback from '../../hooks/useLastCallback';

type OwnProps = {
  setSettingsScreen?: (screen: SettingsScreens) => void;
};

type StateProps = {
  dialogs: (ApiError | ApiInviteInfo | ApiContact | ApiConfirm)[];
  currentMessageList?: MessageList;
};

const Dialogs: FC<StateProps & OwnProps> = ({
  dialogs,
  currentMessageList,
  setSettingsScreen,
}) => {
  const {
    dismissDialog,
    acceptInviteConfirmation,
    sendMessage,
    showNotification,
    setMiddleScreen,
    setLeftScreen,
    openChat,
  } = getActions();
  const [isModalOpen, openModal, closeModal] = useFlag();

  const { t } = useTranslation();

  const handleTopUpWallet = useLastCallback(() => {
    setMiddleScreen({ screen: MiddleColumnContent.Settings });
    setSettingsScreen?.(SettingsScreens.Wallet);
    setLeftScreen({ screen: LeftColumnContent.Settings });
    closeModal();
  });

  useEffect(() => {
    if (dialogs.length > 0) {
      openModal();
    }
  }, [dialogs, openModal]);

  if (!dialogs.length) {
    return null;
  }

  function renderInviteHeader(title: string, photo?: ApiPhoto) {
    return (
      <>
        {photo && (
          <Avatar
            size='medium'
            className='mb-2'
            text={title}
            photo={photo}
            withVideo
          />
        )}
        <h3>{renderText(title)}</h3>
      </>
    );
  }

  const renderInvite = (invite: ApiInviteInfo) => {
    const {
      hash,
      title,
      about,
      participantsCount,
      isChannel,
      photo,
      isRequestNeeded,
    } = invite;

    const handleJoinClick = () => {
      if (isChannel) {
        //openChat({ id: result.id, tabId });
      } else {
        // acceptInviteConfirmation({
        //   hash,
        // });
      }
      acceptInviteConfirmation({
        hash,
      });

      if (isRequestNeeded) {
        showNotification({
          message: isChannel
            ? t('RequestToJoinChannelSentDescription')
            : t('RequestToJoinGroupSentDescription'),
        });
      }
      closeModal();
    };

    const participantsText = isChannel
      ? t('Channel.Subscribers', { count: participantsCount || 0 })
      : t('Group.Members', { count: participantsCount });

    const joinText = t(isChannel ? 'Channel.Subscribe' : 'Group.Join');
    const requestToJoinText = isChannel
      ? t('MemberRequests.RequestToJoinChannel')
      : t('MemberRequests.RequestToJoinGroup');

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className='confirm'
        onCloseAnimationEnd={dismissDialog}
        hasCloseButton
      >
        <div className='modal-content'>
          <div className='d-flex column align-center'>
            {renderInviteHeader(title, photo)}
            <p className='text-center'>{participantsText}</p>
          </div>

          {about && <p className='modal-about'>{renderText(about, ['br'])}</p>}
          {isRequestNeeded && (
            <p className='modal-help'>
              {isChannel
                ? t('MemberRequests.RequestToJoinDescriptionChannel')
                : t('MemberRequests.RequestToJoinDescriptionGroup')}
            </p>
          )}
          <div className='dialog-buttons'>
            <Button onClick={handleJoinClick}>
              {isRequestNeeded ? requestToJoinText : joinText}
            </Button>
            <Button outline onClick={closeModal}>
              {t('Cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  const renderContactRequest = (contactRequest: ApiContact) => {
    const handleConfirm = () => {
      if (!currentMessageList) {
        return;
      }

      sendMessage({
        contact: pick(contactRequest, ['firstName', 'lastName', 'phoneNumber']),
        messageList: currentMessageList,
      });
      closeModal();
    };

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className='confirm'
        title={String(t('ShareYouPhoneNumberTitle'))}
        onCloseAnimationEnd={dismissDialog}
      >
        {t('AreYouSureShareMyContactInfoBot')}
        <div className='dialog-buttons mt-2'>
          <Button
            className='confirm-dialog-button'
            isText
            onClick={handleConfirm}
          >
            {t('OK')}
          </Button>
          <Button className='confirm-dialog-button' isText onClick={closeModal}>
            {t('Cancel')}
          </Button>
        </div>
      </Modal>
    );
  };

  const renderError = (error: ApiError) => {
    return (
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCloseAnimationEnd={dismissDialog}
        className='error'
        title={getErrorHeader(error)}
      >
        <div className='modal-content'>
          {error.hasErrorKey
            ? getReadableErrorText(error)
            : renderText(error.message!, ['simple_markdown', 'emoji', 'br'])}
          <div className='dialog-buttons mt-2'>
            <Button isText onClick={closeModal}>
              {t('OK')}
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  const renderConfirm = (message: ApiConfirm) => {
    switch (message.success) {
      case 'not money':
        return (
          <ConfirmPayModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={t('Sorry')}
            text={t('Channel.NotHaveEnough')}
            payment={{ status: 'canceled' }}
            closeLabel='Back'
            confirmHandler={handleTopUpWallet}
            confirmLabel={t('Wallet.TopUp')}
            transactionType='deposit'
          />
        );
      case 'successfully subscribed':
        return (
          <ConfirmPayModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={t('Success')}
            payment={{ status: 'subscribed' }}
            closeLabel='Back'
            transactionType={
              message.peer_type === 'course' ? 'paidCourse' : 'paidSubscription'
            }
          />
        );
      default:
        return (
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            onCloseAnimationEnd={dismissDialog}
            className='confirm'
            centered
            header={t('ReportPeer.Report')}
            hasCloseButton
          >
            <div className='modal-content'>
              <p>{t(message.success)}</p>
            </div>
          </Modal>
        );
    }
  };

  const renderDialog = (
    dialog: ApiError | ApiInviteInfo | ApiContact | ApiConfirm
  ) => {
    if ('hash' in dialog) {
      return renderInvite(dialog);
    }

    if ('phoneNumber' in dialog) {
      return renderContactRequest(dialog);
    }

    if ('success' in dialog) {
      return renderConfirm(dialog);
    }

    return renderError(dialog);
  };

  return (
    <>{Boolean(dialogs.length) && renderDialog(dialogs[dialogs.length - 1])}</>
  );
};

function getErrorHeader(error: ApiError) {
  if (error.isSlowMode) {
    return 'Slowmode enabled';
  }

  if (!error.hasErrorKey) {
    return 'Ello';
  }

  return 'Something went wrong';
}

export default memo(
  withGlobal((global): StateProps => {
    return {
      dialogs: selectTabState(global).dialogs,
      currentMessageList: selectCurrentMessageList(global),
    };
  })(Dialogs)
);
