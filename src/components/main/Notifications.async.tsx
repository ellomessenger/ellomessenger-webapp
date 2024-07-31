import type { FC } from 'react';
import React, { memo } from 'react';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';
import Notifications from './Notifications';

const NotificationsAsync: FC = ({ isOpen }) => {
  const NotificationsModule = useModuleLoader(
    Bundles.Extra,
    'Notifications',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return NotificationsModule ? <Notifications /> : undefined;
};

export default memo(NotificationsAsync);
