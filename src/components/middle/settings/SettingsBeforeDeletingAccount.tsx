import React, { FC, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';
import useLastCallback from '../../../hooks/useLastCallback';
import { getMoneyFormat } from '../../../util/convertMoney';
import IconSvg from '../../ui/IconSvg';
import {
  LeftColumnContent,
  MiddleColumnContent,
  SettingsScreens,
} from '../../../types';
import DeleteAccountModal from './DeleteAccountModal';
import useFlag from '../../../hooks/useFlag';
import { getActions, withGlobal } from '../../../global';
import {
  GlobalState,
  IDeleteInfo,
  ISubsriptionItem,
} from '../../../global/types';

import SubscriptionsItem from './SubscriptionsItem';
import { historyPushState } from '../../../util/routing';
import IconSvgPayment from '../../payment/IconSvgPayment';

import TextBackground from '../../../assets/payment/gradienta-LeG68PrXA6Y-unsplash.jpg';
import ImgBackground from '../../../assets/payment/image-bg.jpg';
import { selectChat } from '../../../global/selectors';
import { isChatCourse } from '../../../global/helpers';
import { AI_BOT_ID } from '../../../config';

type StateProps = {
  accountDeleteInfo?: IDeleteInfo;
  paidChannels?: ISubsriptionItem[];
};

type OwnProps = {
  onScreenSelect: (screen: SettingsScreens) => void;
};

const SettingsBeforeDeletingAccount: FC<OwnProps & StateProps> = ({
  onScreenSelect,
  accountDeleteInfo,
  paidChannels,
}) => {
  const { getInfoBeforeDeletion, setLeftScreen, setMiddleScreen, openChatBot } =
    getActions();
  const { t } = useTranslation();
  const [isOpenDeleteModal, openDeleteModal, closeDeleteModal] = useFlag();
  const { wallets, paid_channels_owner, ai_sub_info } = accountDeleteInfo || {};

  const mainWallet = wallets?.wallets
    ? wallets?.wallets.find((w) => w.type === 'main')
    : undefined;

  const earnWallet = wallets?.wallets
    ? wallets?.wallets.find((w) => w.type === 'earning')
    : undefined;

  const cannotBeDeleted = Boolean(
    wallets &&
      paid_channels_owner &&
      paidChannels &&
      ai_sub_info?.text_total &&
      ai_sub_info?.img_total
  );

  const handleClickGoElloPay = useLastCallback(() => {
    onScreenSelect(SettingsScreens.Wallet);
  });

  const handleClickGoSubscription = useLastCallback(() => {
    onScreenSelect(SettingsScreens.Subscriptions);
  });

  const handleClickGoPurchases = useLastCallback(() => {
    onScreenSelect(SettingsScreens.Purchases);
  });

  const handleClickGoAi = useLastCallback(() => {
    openChatBot({ id: AI_BOT_ID });
  });

  const handleClickGoChats = useLastCallback(() => {
    onScreenSelect(SettingsScreens.Main);
    setLeftScreen({ screen: LeftColumnContent.ChatList });
    setMiddleScreen({ screen: MiddleColumnContent.Messages });
    historyPushState({
      data: {
        leftScreen: LeftColumnContent.ChatList,
        middleScreen: MiddleColumnContent.Messages,
      },
      //hash: `#chats`,
    });
  });

  useEffect(() => {
    getInfoBeforeDeletion();
  }, []);

  return (
    <div className='settings-container'>
      <div className='settings-privacy before-delete'>
        <div className='settings-item-middle'>
          <h5 className='title'>{t('Settings.ElloPay')}</h5>
          <dl>
            <dd>
              <span>{t('Wallet.Title_main')}</span>
              <span className='amount'>
                <span className='price'>
                  <IconSvg name='dollar' w='14' h='14' />
                  {getMoneyFormat(mainWallet?.amount || 0, 2, 2)}
                </span>
              </span>
            </dd>
            <dd>
              <span>{t('Wallet.Title_earning')}</span>
              <span className='amount'>
                <span className='price'>
                  <IconSvg name='dollar' w='14' h='14' />
                  {getMoneyFormat(earnWallet?.amount || 0, 2, 2)}
                </span>
              </span>
            </dd>
            {/* <dd>
              <span>{t('Wallet.Title_cashback')}</span>
              <span>{`$${getMoneyFormat('0.0', 2, 2)}`}</span>
            </dd> */}
          </dl>
          <div className='button-to-go-wrapper'>
            <Button className='button-to-go' onClick={handleClickGoElloPay}>
              {t('Settings.GoElloPay')}
            </Button>
          </div>
        </div>
        <div className='settings-item-middle'>
          <h5 className='title'>{t('Settings.MyPaidSubscriptions')}</h5>
          {paidChannels ? (
            <div className='items-wrapper'>
              {paidChannels?.map((chat) => (
                <SubscriptionsItem item={chat} />
              ))}
            </div>
          ) : (
            <dl>
              <p className='settings-item-description'>
                {t('Settings.YouDontHaveSubscriptionsChannels')}
              </p>
            </dl>
          )}

          <div className='button-to-go-wrapper'>
            <Button
              className='button-to-go'
              onClick={handleClickGoSubscription}
            >
              {t('Settings.GoToMySubscriptions')}
            </Button>
          </div>
        </div>
        <div className='settings-item-middle'>
          <h5 className='title'>{t('Settings.MyPayedChannels')}</h5>
          {paid_channels_owner?.chats ? (
            <div className='items-wrapper'>
              {paid_channels_owner.chats.map((chat) => (
                <SubscriptionsItem item={chat} />
              ))}
            </div>
          ) : (
            <dl>
              <p className='settings-item-description'>
                {t('Settings.YouDontHavePayedChannels')}
              </p>
            </dl>
          )}

          <div className='button-to-go-wrapper'>
            <Button className='button-to-go' onClick={handleClickGoChats}>
              {t('Settings.GoToMyPayedChannels')}
            </Button>
          </div>
        </div>
        <div className='settings-item-middle'>
          <h5 className='title'>{t('AI.Packs')}</h5>
          {ai_sub_info ? (
            <dl>
              <dd>
                <span>
                  <div
                    className='Avatar size-mini no-photo'
                    style={{ backgroundImage: `url(${TextBackground})` }}
                  >
                    <IconSvgPayment name='text' w='12' h='12' />
                  </div>{' '}
                  {t('AI.Text')}
                </span>
                <span>
                  {t('AI.request', { count: ai_sub_info?.text_total || 0 })}
                </span>
              </dd>
              <dd>
                <span>
                  <div
                    className='Avatar size-mini no-photo'
                    style={{ backgroundImage: `url(${ImgBackground})` }}
                  >
                    <IconSvgPayment name='image' w='12' h='12' />
                  </div>{' '}
                  {t('AI.Image')}
                </span>
                <span>
                  {t('AI.request', { count: ai_sub_info?.img_total || 0 })}
                </span>
              </dd>
            </dl>
          ) : (
            <dl>
              <p className='settings-item-description'>
                {t('Settings.YouDontHaveAIPacks')}
              </p>
            </dl>
          )}

          <div className='button-to-go-wrapper'>
            <Button className='button-to-go' onClick={handleClickGoAi}>
              {t('AI.GoToAi')}
            </Button>
          </div>
        </div>
        {/* <div className='settings-item-middle'>
          <h5 className='title'>{t('Settings.Purchases')}</h5>
          <dl>
            <p className='settings-item-description'>
              {t('Settings.YouDontHavePurchases')}
            </p>
          </dl>
          <div className='button-to-go-wrapper'>
            <Button className='button-to-go' onClick={handleClickGoPurchases}>
              {t('Settings.GoToPurchases')}
            </Button>
          </div>
        </div> */}
        {cannotBeDeleted ? (
          <p className='text-error mt-4 mb-4'>
            <IconSvg name='error' /> {t('Settings.YouCannotDelete')}
          </p>
        ) : (
          <p className='text-success mt-4 mb-4'>
            <IconSvg name='check-circle' /> {t('Settings.CanBeDeleted')}
          </p>
        )}

        <div className='form-submit'>
          <Button
            color='danger'
            disabled={cannotBeDeleted}
            onClick={openDeleteModal}
          >
            {t('Settings.DeleteAccount')}
          </Button>
        </div>
      </div>
      <DeleteAccountModal
        isOpen={isOpenDeleteModal}
        onClose={closeDeleteModal}
      />
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { accountDeleteInfo } = global;

    const paidChannels =
      accountDeleteInfo?.paid_channels_subscribe.chats &&
      accountDeleteInfo.paid_channels_subscribe.chats.filter((channel) => {
        const chat = selectChat(global, `-${channel.id}`);
        const isChannelCourse = chat! && isChatCourse(chat);
        return !isChannelCourse;
      });

    return {
      accountDeleteInfo,
      paidChannels,
    };
  })(SettingsBeforeDeletingAccount)
);
