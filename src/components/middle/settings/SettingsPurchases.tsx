import React, { FC, useCallback, useState } from 'react';
import TabList from '../../ui/TabList';
import { useTranslation } from 'react-i18next';

import SettingsPurchasesItem from './SettingsPurchasesItem';

import './SettingsPurchases.scss';

const SettingsPurchases: FC = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    { title: t('Attach.All') },
    { title: t('Attach.Photo') },
    { title: t('Attach.Video') },
    { title: t('Attach.Audio') },
    { title: t('Attach.Other') },
  ];

  const handleSwitchTab = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  return (
    <div id='SettingsPurchases'>
      <div className='settings-container'>
        <TabList
          tabs={TABS}
          activeTab={activeTab}
          onSwitchTab={handleSwitchTab}
          areFolders
        />
        <div className='purchases-list'>
          <SettingsPurchasesItem />
          <SettingsPurchasesItem />
        </div>
      </div>
    </div>
  );
};

export default SettingsPurchases;
