import React, { FC, memo } from 'react';
import { Bundles } from '../../../util/moduleLoader';
import type { OwnProps } from './Settings';

import useModuleLoader from '../../../hooks/useModuleLoader';
import Loading from '../../ui/Loading';

const SettingsAsync: FC<OwnProps> = (props) => {
  const Settings = useModuleLoader(Bundles.Extra, 'Settings');

  return Settings ? <Settings {...props} /> : <Loading />;
};

export default memo(SettingsAsync);
