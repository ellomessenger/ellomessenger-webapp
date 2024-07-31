import React, { FC, memo, useCallback, useEffect } from 'react';
import { getActions, withGlobal } from '../../global';

import { selectTabState, selectUser } from '../../global/selectors';
import useFlag from '../../hooks/useFlag';

import RecipientPicker from '../common/RecipientPicker';
import { useTranslation } from 'react-i18next';
import { ApiContact } from '../../api/types';

export type OwnProps = {
  isOpen: boolean;
};

interface StateProps {
  currentUserId?: string;
  isManyMessages?: boolean;
  contactRequest?: ApiContact | undefined;
  refCode?: string;
  link?: string;
}

const ForwardRecipientPicker: FC<OwnProps & StateProps> = ({
  isOpen,
  currentUserId,
  isManyMessages,
  contactRequest,
  refCode,
  link,
}) => {
  const {
    setForwardChatOrTopic,
    exitForwardMode,
    forwardToSavedMessages,
    showNotification,
    forwardContact,
    forwardReferralCode,
    forwardLink,
  } = getActions();

  const { t } = useTranslation();

  const [isShown, markIsShown, unmarkIsShown] = useFlag();
  useEffect(() => {
    if (isOpen) {
      markIsShown();
    }
  }, [isOpen, markIsShown]);

  const handleSelectRecipient = useCallback(
    (recipientId: string, threadId?: number) => {
      if (contactRequest) {
        forwardContact({
          chatId: recipientId,
          contactRequest,
        });
      } else if (refCode) {
        forwardReferralCode({ chatId: recipientId, refCode });
      } else if (link) {
        forwardLink({ chatId: recipientId, link });
      } else if (recipientId === currentUserId) {
        forwardToSavedMessages();
        showNotification({
          message: t(
            isManyMessages
              ? 'ForwardTooltip.SavedMessages.Many'
              : 'ForwardTooltip.SavedMessages.One'
          ),
        });
      } else {
        setForwardChatOrTopic({ chatId: recipientId, topicId: threadId });
      }
    },
    [
      currentUserId,
      contactRequest,
      refCode,
      link,
      forwardToSavedMessages,
      isManyMessages,
      setForwardChatOrTopic,
      showNotification,
    ]
  );

  const handleClose = useCallback(() => {
    exitForwardMode();
  }, [exitForwardMode]);

  if (!isOpen && !isShown) {
    return null;
  }

  return (
    <RecipientPicker
      isOpen={isOpen}
      searchPlaceholder={t('ForwardTo')}
      onSelectRecipient={handleSelectRecipient}
      onClose={handleClose}
      onCloseAnimationEnd={unmarkIsShown}
    />
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { messageIds, contactId, refCode, link } =
      selectTabState(global).forwardMessages;

    const {
      firstName,
      lastName = '',
      usernames,
    } = selectUser(global, contactId!) || {};
    const contactRequest =
      firstName && contactId
        ? {
            userId: contactId,
            firstName,
            lastName,
            phoneNumber: usernames ? usernames[0].username : '',
          }
        : undefined;
    return {
      currentUserId: global.currentUserId,
      isManyMessages: (messageIds?.length || 0) > 1,
      contactRequest,
      refCode,
      link,
    };
  })(ForwardRecipientPicker)
);
