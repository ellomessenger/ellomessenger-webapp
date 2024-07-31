import React, { FC, memo } from 'react';

import type { ApiFakeType } from '../../api/types';

import './FakeIcon.scss';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  fakeType: ApiFakeType;
};

const FakeIcon: FC<OwnProps> = ({ fakeType }) => {
  const { t } = useTranslation();

  return (
    <span className='FakeIcon'>
      {t(fakeType === 'fake' ? 'FakeMessage' : 'ScamMessage')}
    </span>
  );
};

export default memo(FakeIcon);
