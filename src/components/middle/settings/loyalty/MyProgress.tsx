import React, { FC, memo, useMemo } from 'react';
import IconSvgSettings from '../icons/IconSvgSettings';
import { getMoneyFormat } from '../../../../util/convertMoney';
import Button from '../../../ui/Button';
import { copyTextToClipboard } from '../../../../util/clipboard';
import { getActions, withGlobal } from '../../../../global';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../../ui/IconSvg';
import { ILoyalty } from '../../../../global/types';
import { TEAM_HOSTNAME } from '../../../../config';
import { ETab } from './LoyaltyProgram';
import renderText from '../../../common/helpers/renderText';
import useLastCallback from '../../../../hooks/useLastCallback';

type OwnProps = {
  loyalty: ILoyalty;
  currentUserId: string;
  setTab: (tab: ETab) => void;
};

const MyProgress: FC<OwnProps> = ({ loyalty, setTab, currentUserId }) => {
  const { showNotification, openForwardMenu } = getActions();
  const { t } = useTranslation();
  const {
    code,
    sum = 0,
    count_users = 0,
    bonus,
    is_default,
    is_business,
    percent,
  } = loyalty || {};

  function copy(text: string, entity: string) {
    copyTextToClipboard(text);
    showNotification({ message: `${entity} ${t('Copy.WasCopied')}` });
  }

  const codeLink = `${TEAM_HOSTNAME}invite_referral?code=${code}`;

  const handleShareCode = useLastCallback(() => {
    openForwardMenu({
      fromChatId: currentUserId!,
      refCode: codeLink,
    });
  });

  return (
    <div className='Loyalty-page custom-scroll'>
      {!is_default && (
        <div className='btn-group tab-nav full-width'>
          <div className='Button text active'>My progress</div>
          <div className='Button text' onClick={() => setTab(ETab.referrals)}>
            My referrals
          </div>
        </div>
      )}
      <div className='heading-banner'>
        <div className='mb-3'>
          <IconSvgSettings name='present' />
        </div>
        <h4>Earned revenue</h4>

        <h2 className='amount'>
          <IconSvg name='dollar' w='26' h='26' />
          {getMoneyFormat(sum, 2, 2) ?? 0}
        </h2>
      </div>
      <div className='settings-container mt-5'>
        <div className='info-item'>
          <div className='main-content'>
            <div className='title-icon color-bg-13'>
              <IconSvgSettings name='three-users' />
            </div>
            <div className='title'>
              <b>{count_users}</b>{' '}
              {t('Loyalty.Referral', { count: count_users })}
            </div>
          </div>
        </div>
        <div className='referral-description'>
          {is_default && (
            <>
              <div className='heading'>
                {renderText(t('Loyalty.InviteFriend', { bonus }), ['br'])}
              </div>
              <p>{renderText(t('Loyalty.ReferralDescription'), ['br'])}</p>
            </>
          )}
          {is_business && (
            <div className='heading'>
              <span>{loyalty.name}</span>
            </div>
          )}
        </div>
        <div className='info-item'>
          <div className='main-content'>
            <div className='title'>{t('Settings.ReferralCodeLink')}</div>
          </div>
          <Button
            round
            color='translucent'
            size='tiny'
            onClick={() => copy(codeLink, t('Settings.ReferralCodeLink'))}
            ariaLabel='Copy'
          >
            <i className='icon-svg'>
              <IconSvg name='copy' w='24' h='24' />
            </i>
          </Button>
        </div>
        <div className='info-item'>
          <div className='main-content'>
            <div className='title'>
              <span className='subtitle'>{t('Settings.ReferralCode')}</span>
              {code}
            </div>
          </div>
          <Button
            round
            color='translucent'
            size='tiny'
            onClick={() => copy(code!, t('Settings.ReferralCode'))}
            ariaLabel='Copy'
          >
            <i className='icon-svg'>
              <IconSvg name='copy' w='24' h='24' />
            </i>
          </Button>
        </div>
        <div className='form-submit mt-4'>
          <Button isShiny onClick={handleShareCode}>
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(MyProgress);
