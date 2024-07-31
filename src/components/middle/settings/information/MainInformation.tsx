import React, { FC, memo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import IconSvg from '../../../ui/IconSvg';

import { ApiUser } from '../../../../api/types';
import ListItem from '../../../ui/ListItem';
import { withGlobal } from '../../../../global';
import { selectUser } from '../../../../global/selectors';
import './information.scss';
import { LANDING_HOSTNAME } from '../../../../config';

type StateProps = {
  user: ApiUser | undefined;
};

const MainInformation: FC<StateProps> = ({ user }) => {
  const { t } = useTranslation();

  const openLinkInNewTab = useCallback((link: string) => {
    window.open(`${LANDING_HOSTNAME}/${link}`, '_blanc');
  }, []);

  return (
    <div className='settings-container information-content'>
      <h3>{t('Information.Title')}</h3>
      <dl>
        <dd>
          <div className='text-secondary text-small'>User Name</div>
          <div>
            {user?.firstName} {user?.lastName}
          </div>
        </dd>
        <dd>
          <div className='text-secondary text-small'>User ID</div>
          <div>{user?.id}</div>
        </dd>
        <dd>
          <div className='text-secondary text-small'>Registered email</div>
          <div>{user?.fullInfo?.email}</div>
        </dd>
      </dl>
      <div className='information-item-middle'>
        <ListItem
          leftElement={
            <div className='title-icon color-bg-2 mr-4'>
              <IconSvg name='key' w='20' h='20' />
            </div>
          }
          onClick={() => openLinkInNewTab('privacy-policy')}
        >
          {t('Information.PrivacyPolicy')}
        </ListItem>
        <ListItem
          leftElement={
            <div className='title-icon color-bg-12 mr-4'>
              <IconSvg name='info-circle' w='20' h='20' />
            </div>
          }
          onClick={() => openLinkInNewTab('terms')}
        >
          {t('Information.TermsAndConditions')}
        </ListItem>

        {/* <ListItem
          leftElement={
            <div className='title-icon mr-4 color-bg-5'>
              <IconSvg name='medal-star' w='20' h='20' />
            </div>
          }
          onClick={() => true}
        >
          {t('Information.Licenses')}
        </ListItem> */}
        <ListItem
          leftElement={
            <div className='title-icon mr-4 color-bg-9'>
              <IconSvg name='security-safe' w='20' h='20' />
            </div>
          }
          onClick={() => openLinkInNewTab('ai-terms')}
        >
          {t('Information.AiPolicy')}
        </ListItem>
        {/* <ListItem
          leftElement={
            <div className='title-icon mr-4 color-bg-3'>
              <IconSvg name='payment-plus' w='20' h='20' />
            </div>
          }
          onClick={() => true}
        >
          {t('Information.MediaSalePolicy')}
        </ListItem> */}
      </div>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const userId = global.currentUserId;
    const user = selectUser(global, userId!);
    return {
      user,
    };
  })(MainInformation)
);
