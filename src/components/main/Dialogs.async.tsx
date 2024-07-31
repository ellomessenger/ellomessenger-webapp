import type { FC } from 'react';
import React, { memo } from 'react';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';
import Dialogs from './Dialogs';

const DialogsAsync: FC = ({ isOpen }) => {
  const DialogsModule = useModuleLoader(Bundles.Extra, 'Dialogs', !isOpen);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return DialogsModule ? <Dialogs /> : null;
};

export default memo(DialogsAsync);
