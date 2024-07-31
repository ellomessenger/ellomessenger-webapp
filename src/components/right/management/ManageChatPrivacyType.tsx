import React, {
  FC,
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getActions, getGlobal, withGlobal } from '../../../global';

import type { ApiChat, ApiUsername } from '../../../api/types';
import { ManagementProgress, ManagementScreens } from '../../../types';

import {
  PURCHASE_USERNAME,
  TME_LINK_PREFIX,
  USERNAME_PURCHASE_ERROR,
} from '../../../config';
import { selectTabState, selectManagement } from '../../../global/selectors';
import {
  isChatChannel,
  isChatCourse,
  isChatGroup,
  isChatPublic,
  isChatSubscription,
} from '../../../global/helpers';
import { selectCurrentLimit } from '../../../global/selectors/limits';

import useFlag from '../../../hooks/useFlag';
import useHistoryBack from '../../../hooks/useHistoryBack';
import usePrevious from '../../../hooks/usePrevious';

import SafeLink from '../../common/SafeLink';
import ListItem from '../../ui/ListItem';
import RadioGroup from '../../ui/RadioGroup';
import Loading from '../../ui/Loading';
import Spinner from '../../ui/Spinner';
import FloatingActionButton from '../../ui/FloatingActionButton';
import UsernameInput from '../../common/UsernameInput';
import ConfirmDialog from '../../ui/ConfirmDialog';
import ManageUsernames from '../../common/ManageUsernames';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import Switcher from '../../ui/Switcher';
import InviteLink from '../../common/InviteLink';
import classNames from 'classnames';
import useLastCallback from '../../../hooks/useLastCallback';

type PrivacyType = 'private' | 'public';
type SubscriptionType = 'subscription';
type CourseType = 'online_course';

type OwnProps = {
  chat: ApiChat;
  onClose: NoneToVoidFunction;
  isActive: boolean;
  onScreenSelect: (screen: ManagementScreens) => void;
};

type StateProps = {
  isChannel: boolean;
  isPublic: boolean;
  progress?: ManagementProgress;
  isUsernameAvailable?: boolean;
  checkedUsername?: string;
  error?: string;
  isProtected?: boolean;
  maxPublicLinks: number;
  privateInviteLink?: string;
  usernames?: ApiUsername[];
  isCourse?: boolean;
  isSubscription?: boolean;
};

const ManageChatPrivacyType: FC<OwnProps & StateProps> = ({
  chat,
  isActive,
  isChannel,
  isPublic,
  isCourse,
  isSubscription,
  progress,
  isUsernameAvailable,
  checkedUsername,
  error,
  isProtected,
  maxPublicLinks,
  privateInviteLink,
  usernames,
  onClose,
  onScreenSelect,
}) => {
  const {
    updatePublicLink,
    updatePrivateLink,
    toggleIsProtected,
    openLimitReachedModal,
  } = getActions();

  const firstEditableUsername = usernames?.find(({ isEditable }) => isEditable);

  const currentUsername = firstEditableUsername?.username || '';

  const [isProfileFieldsTouched, setIsProfileFieldsTouched] = useState(false);
  const [privacyType, setPrivacyType] = useState<PrivacyType>(
    isPublic ? 'public' : 'private'
  );
  const [subscriptionType, setSubscriptionType] =
    useState<SubscriptionType>('subscription');
  const [courseType, setCourseType] = useState<CourseType>('online_course');
  const [editableUsername, setEditableUsername] = useState<string>();
  const [
    isRevokeConfirmDialogOpen,
    openRevokeConfirmDialog,
    closeRevokeConfirmDialog,
  ] = useFlag();
  const [
    isUsernameLostDialogOpen,
    openUsernameLostDialog,
    closeUsernameLostDialog,
  ] = useFlag();

  const previousIsUsernameAvailable = usePrevious(isUsernameAvailable);
  const renderingIsUsernameAvailable =
    isUsernameAvailable ?? previousIsUsernameAvailable;

  const canUpdate =
    isProfileFieldsTouched &&
    Boolean(
      (privacyType === 'public' &&
        (editableUsername || (currentUsername && editableUsername === '')) &&
        renderingIsUsernameAvailable) ||
        (privacyType === 'private' && isPublic)
    );

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  useEffect(() => {
    setIsProfileFieldsTouched(false);
  }, [currentUsername]);

  useEffect(() => {
    if (privacyType === 'private' && isPublic) {
      updatePrivateLink();
    }
  }, [privacyType, updatePrivateLink]);

  const handleUsernameChange = useCallback((value: string) => {
    setEditableUsername(value);
    setIsProfileFieldsTouched(true);
  }, []);

  const handleOptionChange = useLastCallback(
    (value: string, e: ChangeEvent<HTMLInputElement>) => {
      const myChats = Object.values(getGlobal().chats.byId).filter(
        ({ isCreator, usernames }) =>
          isCreator && usernames?.some((c) => c.isActive)
      );

      if (myChats.length >= maxPublicLinks && value === 'public') {
        openLimitReachedModal({ limit: 'channelsPublic' });
        const radioGroup = e.currentTarget.closest(
          '.radio-group'
        ) as HTMLDivElement;
        // Patch for Teact bug with controlled inputs
        // TODO Teact support added, this can now be removed
        (
          radioGroup.querySelector('[value=public]') as HTMLInputElement
        ).checked = false;
        (
          radioGroup.querySelector('[value=private]') as HTMLInputElement
        ).checked = true;
        return;
      }
      setPrivacyType(value as PrivacyType);
      setIsProfileFieldsTouched(true);
    }
  );

  const handleClickInvites = useCallback(() => {
    onScreenSelect(ManagementScreens.Invites);
  }, [onScreenSelect]);

  const handleForwardingToggle = useCallback(() => {
    toggleIsProtected({
      chatId: chat.id,
      isProtected: !isProtected,
    });
  }, [chat.id, toggleIsProtected, isProtected]);

  const handleSave = useCallback(() => {
    if (isPublic && privacyType === 'private') {
      openUsernameLostDialog();
    } else {
      updatePublicLink({
        username: privacyType === 'public' ? editableUsername || '' : '',
      });
    }
  }, [
    isPublic,
    openUsernameLostDialog,
    privacyType,
    updatePublicLink,
    editableUsername,
  ]);

  const handleMakeChannelPrivateConfirm = useCallback(() => {
    updatePublicLink({ username: '' });
    closeUsernameLostDialog();
  }, [closeUsernameLostDialog, updatePublicLink]);

  const handleRevokePrivateLink = useCallback(() => {
    closeRevokeConfirmDialog();
    updatePrivateLink();
  }, [closeRevokeConfirmDialog, updatePrivateLink]);

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  //const langPrefix1 = isChannel ? 'Channel' : 'Group'; //'Mega'
  const langPrefix2 = isChannel ? 'Channel' : 'Group';

  const options = [
    ...(isSubscription
      ? [
          {
            value: 'subscription',
            label: t('Channel.subscriptionChannel'),
            subLabel: t('Channel.SubscriptionInfo'),
          },
        ]
      : isCourse
      ? [
          {
            value: 'online_course',
            label: t('Channel.OnlineCourse'),
            subLabel: t('Channel.OnlineCourseInfo'),
          },
        ]
      : [
          {
            value: 'public',
            label: t(`${langPrefix2}.public`),
            subLabel: t(`${langPrefix2}.PublicInfo`),
          },

          {
            value: 'private',
            label: t(`${langPrefix2}.private`),
            subLabel: t(`${langPrefix2}.PrivateInfo`),
          },
        ]),
  ];

  const isLoading = progress === ManagementProgress.InProgress;

  const shouldRenderUsernamesManage =
    privacyType === 'public' && usernames && usernames.length > 1;

  function renderPurchaseLink() {
    const purchaseInfoLink = `${TME_LINK_PREFIX}${PURCHASE_USERNAME}`;

    return (
      <p className='section-info' dir='auto'>
        {(t('lng_username_purchase_available') as string)
          .replace('{link}', '%PURCHASE_LINK%')
          .split('%')
          .map((s) => {
            return s === 'PURCHASE_LINK' ? (
              <SafeLink url={purchaseInfoLink} text={`@${PURCHASE_USERNAME}`} />
            ) : (
              s
            );
          })}
      </p>
    );
  }

  return (
    <div className='Management'>
      <div className='custom-scroll'>
        <div className='section pr-3' dir={isRtl ? 'rtl' : undefined}>
          <h4 className='section-heading'>{t(`${langPrefix2}.Type`)}</h4>
          <RadioGroup
            selected={
              isSubscription
                ? subscriptionType
                : isCourse
                ? courseType
                : privacyType
            }
            name='edit-channel-type'
            options={options}
            onChange={handleOptionChange}
            size='smaller'
          />
        </div>
        {/* {!isChannel && privacyType === 'private' && (
          <p className='section-info' dir='auto'>
            {t(`${langPrefix2}.PrivatChangeInfo`)}
          </p>
        )} */}
        <div className='section'>
          <h4 className='section-heading'>
            {t(
              `Link.${
                privacyType === 'private'
                  ? 'Invite'
                  : isChannel
                  ? 'Permanent'
                  : 'Public-link'
              }`
            )}
          </h4>
          {privacyType === 'private' ? (
            <>
              {privateInviteLink ? (
                <>
                  <InviteLink
                    inviteLink={privateInviteLink}
                    onRevoke={openRevokeConfirmDialog}
                  />
                  <ConfirmDialog
                    isOpen={isRevokeConfirmDialogOpen}
                    onClose={closeRevokeConfirmDialog}
                    title={String(t('Link.Reset'))}
                    text={String(t('Link.ResetAlert'))}
                    confirmLabel={String(t('Link.Remove'))}
                    confirmHandler={handleRevokePrivateLink}
                    confirmIsDestructive
                  />
                </>
              ) : (
                <Loading />
              )}
            </>
          ) : (
            <>
              <UsernameInput
                asLink
                prefix={isChannel ? '@' : TME_LINK_PREFIX}
                currentUsername={currentUsername}
                isLoading={isLoading}
                placeholder={
                  isSubscription
                    ? 'channel_name'
                    : isCourse
                    ? 'course_name'
                    : 'group_name'
                }
                isUsernameAvailable={isUsernameAvailable}
                checkedUsername={checkedUsername}
                onChange={handleUsernameChange}
              />
            </>
          )}
        </div>
        {/* {error !== USERNAME_PURCHASE_ERROR && renderPurchaseLink()} */}
        {privacyType === 'public' && !isSubscription && !isCourse && (
          <p className='section-info' dir='auto'>
            {t(`${langPrefix2}.CreatePublicLinkHelp`)}
          </p>
        )}

        {privacyType === 'public' && chat.payType && (
          <p className='section-info' dir='auto'>
            {t(`${langPrefix2}.PaidChannelLinkHelp`)}
          </p>
        )}

        {privacyType === 'private' && (
          <p className='section-info' dir='auto'>
            {t('Invitation.PrivateGroupByFollowing')}
          </p>
        )}

        {!isSubscription && !isCourse && (
          <>
            <div className='section group-link'>
              <ListItem
                leftElement={
                  <i className='icon-svg'>
                    <IconSvg name='link' w='24' h='24' />
                  </i>
                }
                onClick={handleClickInvites}
              >
                <span className='middle'>{t('Invitation.Manage')}</span>
              </ListItem>
            </div>
            <p className='section-info' dir='auto'>
              {t('Invitation.CreateDescription')}
            </p>
          </>
        )}

        {shouldRenderUsernamesManage && (
          <ManageUsernames
            chatId={chat.id}
            usernames={usernames!}
            onEditUsername={handleUsernameChange}
          />
        )}
        {!isSubscription && (
          <>
            <div className='section pr-3' dir={isRtl ? 'rtl' : undefined}>
              <h3 className='section-heading'>
                {t(
                  isChannel
                    ? 'Channel.ForwardingTitle'
                    : 'Group.ForwardingTitle'
                )}
              </h3>
              <div className='mb-2 row-not-wrap'>
                <span className='label'>{t('Group.ForwardingLabel')}</span>
                <div
                  role='button'
                  className={classNames('switch-control', {
                    disabled: isCourse || isSubscription,
                  })}
                  onClick={handleForwardingToggle}
                >
                  <Switcher
                    label='Restrict Saving Content'
                    checked={isProtected}
                    disabled={isCourse || isSubscription}
                    color='reverse'
                  />
                </div>
              </div>
            </div>
            <p className='section-info'>
              {isChannel
                ? isCourse
                  ? t('Channel.CourseForwardingInfo')
                  : t('Channel.ForwardingInfo')
                : t('Group.ForwardingInfo')}
            </p>
          </>
        )}
      </div>
      <FloatingActionButton
        isShown={canUpdate}
        disabled={isLoading}
        ariaLabel={String(t('Save'))}
        onClick={handleSave}
      >
        {isLoading ? (
          <Spinner color='white' />
        ) : (
          <i className='icon-svg'>
            <IconSvg name='check-thin' />
          </i>
        )}
      </FloatingActionButton>
      <ConfirmDialog
        isOpen={isUsernameLostDialogOpen}
        onClose={closeUsernameLostDialog}
        text={String(
          t('Channel.VisibilityConfirmMakePrivate', {
            currentUsername,
          })
        )}
        confirmHandler={handleMakeChannelPrivateConfirm}
        confirmIsDestructive
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chat }): StateProps => {
    const { isUsernameAvailable, checkedUsername, error } =
      selectManagement(global, chat.id)! || {};

    const privateInviteLink = chat.fullInfo?.inviteLink;
    const usernames = chat.usernames!;
    const isSubscription = isChatSubscription(chat);
    const isCourse = isChatCourse(chat);
    return {
      isChannel: isChatChannel(chat)!,
      progress: selectTabState(global).management.progress,
      isCourse,
      isSubscription,
      error,
      isUsernameAvailable,
      checkedUsername,
      isProtected: chat?.isProtected,
      maxPublicLinks: selectCurrentLimit(global, 'channelsPublic'),
      privateInviteLink,
      isPublic: isChatPublic(chat)!,
      usernames,
    };
  })(ManageChatPrivacyType)
);
