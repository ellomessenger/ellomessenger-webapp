import React, { FC, memo, useCallback, useEffect } from 'react';

import type { ApiLimitTypeWithModal } from '../../../../global/types';

import renderText from '../../../common/helpers/renderText';
import { formatFileSize } from '../../../../util/textFormat';
import { getActions, withGlobal } from '../../../../global';
import {
  selectIsCurrentUserPremium,
  selectIsPremiumPurchaseBlocked,
} from '../../../../global/selectors';
import {
  CHAT_SMALL_HEIGHT_PX,
  MAIL_INFO,
  MAX_UPLOAD_FILEPART_SIZE,
} from '../../../../config';
import useFlag from '../../../../hooks/useFlag';

import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import PremiumLimitsCompare from './PremiumLimitsCompare';

import styles from './PremiumLimitReachedModal.module.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../../../ui/IconSvg';
import useLastCallback from '../../../../hooks/useLastCallback';
import InfiniteScroll from '../../../ui/InfiniteScroll';
import ListItem from '../../../ui/ListItem';
import GroupChatInfo from '../../../common/GroupChatInfo';
import Loading from '../../../ui/Loading';
import ChatOwned from '../../../common/ChatOwned';

const LIMIT_DESCRIPTION: Record<ApiLimitTypeWithModal, string> = {
  dialogFiltersChats: 'LimitReachedChatInFolders',
  uploadMaxFileparts: 'LimitReachedFileSize',
  dialogFilters: 'LimitReachedFolders',
  dialogFolderPinned: 'LimitReachedPinDialogs',
  channelsPublic: 'LimitReachedPublicLinks',
  channels: 'LimitReachedCommunities',
};

const LIMIT_DESCRIPTION_BLOCKED: Record<ApiLimitTypeWithModal, string> = {
  dialogFiltersChats: 'LimitReachedChatInFoldersLocked',
  uploadMaxFileparts: 'LimitReachedFileSizeLocked',
  dialogFilters: 'LimitReachedFoldersLocked',
  dialogFolderPinned: 'LimitReachedPinDialogsLocked',
  channelsPublic: 'LimitReachedPublicLinksLocked',
  channels: 'LimitReachedCommunitiesLocked',
};

const LIMIT_DESCRIPTION_PREMIUM: Record<ApiLimitTypeWithModal, string> = {
  dialogFiltersChats: 'LimitReachedChatInFoldersPremium',
  uploadMaxFileparts: 'LimitReachedFileSizePremium',
  dialogFilters: 'LimitReachedFoldersPremium',
  dialogFolderPinned: 'LimitReachedPinDialogsPremium',
  channelsPublic: 'LimitReachedPublicLinksPremium',
  channels: 'LimitReachedCommunitiesPremium',
};

const LIMIT_ICON: Record<ApiLimitTypeWithModal, string> = {
  dialogFiltersChats: 'icon-chat-badge',
  uploadMaxFileparts: 'icon-file-badge',
  dialogFilters: 'icon-folder-badge',
  dialogFolderPinned: 'icon-pin-badge',
  channelsPublic: 'link',
  channels: 'channel',
};

const LIMIT_VALUE_FORMATTER: Partial<
  Record<ApiLimitTypeWithModal, (...args: any[]) => string>
> = {
  uploadMaxFileparts: (lang: any, value: number) => {
    // The real size is not exactly 4gb, so we need to round it
    if (value === 8000) return lang('FileSize.GB', '4');
    if (value === 4000) return lang('FileSize.GB', '2');
    return formatFileSize(lang, value * MAX_UPLOAD_FILEPART_SIZE);
  },
};

function getLimiterDescription({
  lang,
  limitType,
  isPremium,
  canBuyPremium,
  defaultValue,
  premiumValue,
  valueFormatter,
}: {
  lang: any;
  limitType?: ApiLimitTypeWithModal;
  isPremium?: boolean;
  canBuyPremium?: boolean;
  defaultValue?: number;
  premiumValue?: number;
  valueFormatter?: (...args: any[]) => string;
}) {
  if (!limitType) {
    return undefined;
  }

  const defaultValueFormatted = valueFormatter
    ? valueFormatter(lang, defaultValue)
    : defaultValue;
  const premiumValueFormatted = valueFormatter
    ? valueFormatter(lang, premiumValue)
    : premiumValue;

  if (isPremium) {
    return lang(LIMIT_DESCRIPTION_PREMIUM[limitType], premiumValueFormatted);
  }

  return canBuyPremium
    ? lang(
        LIMIT_DESCRIPTION[limitType],
        limitType === 'channelsPublic'
          ? premiumValueFormatted
          : [defaultValueFormatted, premiumValueFormatted]
      )
    : lang(LIMIT_DESCRIPTION_BLOCKED[limitType], {
        limit: defaultValueFormatted,
      });
}

export type OwnProps = {
  limit?: ApiLimitTypeWithModal;
};

type StateProps = {
  defaultValue?: number;
  premiumValue?: number;
  isPremium?: boolean;
  canBuyPremium?: boolean;
  activeListIds?: string[];
};

const PremiumLimitReachedModal: FC<OwnProps & StateProps> = ({
  defaultValue,
  premiumValue,
  limit,
  isPremium,
  canBuyPremium,
  activeListIds,
}) => {
  const { closeLimitReachedModal, openPremiumModal } = getActions();
  const { t } = useTranslation();

  const [isClosing, startClosing, stopClosing] = useFlag();

  const handleClick = useCallback(() => {
    openPremiumModal();
    startClosing();
  }, [openPremiumModal, startClosing]);

  const handleClickREquest = useLastCallback(() => {
    limit === 'channelsPublic' && window.open(`mailto:${MAIL_INFO}`, '_blank');
    startClosing();
  });

  useEffect(() => {
    if (!limit && isClosing) stopClosing();
  }, [isClosing, limit, stopClosing]);

  const title = t('LimitReached');
  const valueFormatter = limit && LIMIT_VALUE_FORMATTER[limit];

  const description = getLimiterDescription({
    lang: t,
    limitType: limit,
    isPremium,
    canBuyPremium,
    defaultValue,
    premiumValue,
    valueFormatter,
  });
  const icon = limit && LIMIT_ICON[limit];
  const canUpgrade = canBuyPremium && !isPremium;

  return (
    <Modal
      onClose={startClosing}
      onCloseAnimationEnd={closeLimitReachedModal}
      isOpen={Boolean(limit) && !isClosing}
      className={styles.root}
      hasCloseButton
      notScroll
    >
      <h3 className='text-center'>{title}</h3>
      {!canUpgrade && (
        <div className={styles.limitBadge}>
          <i className={styles.limitIcon}>
            <IconSvg name={icon!} w='24' h='24' />
          </i>

          <div className={styles.limitValue}>
            {valueFormatter?.(t, isPremium ? premiumValue : defaultValue) ||
              (isPremium ? premiumValue : defaultValue)}
          </div>
        </div>
      )}

      {canUpgrade && (
        <PremiumLimitsCompare
          className={styles.limitCompare}
          leftValue={
            valueFormatter?.(t, defaultValue) || defaultValue?.toString()
          }
          rightValue={
            valueFormatter?.(t, premiumValue) || premiumValue?.toString()
          }
          floatingBadgeIcon={icon}
        />
      )}

      <div className={styles.limitDescription}>
        {renderText(description || '', ['simple_markdown', 'br'])}
      </div>
      {limit === 'channelsPublic' && (
        <div className={classNames(styles.pickerList, 'custom-scroll')}>
          {activeListIds?.length ? (
            activeListIds.map((id) => <ChatOwned key={id} chatId={id} />)
          ) : (
            <Loading />
          )}
        </div>
      )}

      <div className={styles.dialogButtons}>
        <Button onClick={handleClickREquest} fullWidth>
          {t(
            canUpgrade
              ? 'Cancel'
              : limit === 'channelsPublic'
              ? 'IncreaseLimit'
              : 'Ok'
          )}
        </Button>
        {canUpgrade && (
          <Button
            className={classNames(
              'confirm-dialog-button',
              styles.subscribeButton
            )}
            isShiny
            fullWidth
            onClick={handleClick}
            color='primary'
          >
            {t('IncreaseLimit')}
            <i className={classNames(styles.buttonIcon, 'icon-double-badge')} />
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { limit }): StateProps => {
    const {
      chats: { listIds },
      appConfig,
    } = global;
    const { limits } = appConfig || {};
    const isPremium = selectIsCurrentUserPremium(global);

    return {
      defaultValue: limit ? limits?.[limit][0] : undefined,
      premiumValue: limit ? limits?.[limit][1] : undefined,
      canBuyPremium: !selectIsPremiumPurchaseBlocked(global),
      isPremium,
      activeListIds: listIds.active,
    };
  })(PremiumLimitReachedModal)
);
