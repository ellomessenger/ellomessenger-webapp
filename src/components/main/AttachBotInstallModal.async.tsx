import type { FC } from 'react';
import React, { memo } from 'react';
import { Bundles } from '../../util/moduleLoader';

import type { OwnProps } from './AttachBotInstallModal';

import useModuleLoader from '../../hooks/useModuleLoader';

const AttachBotInstallModalAsync: FC<OwnProps> = (props) => {
  const { bot } = props;
  const AttachBotInstallModal = useModuleLoader(
    Bundles.Extra,
    'AttachBotInstallModal',
    !bot
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return AttachBotInstallModal ? (
    <AttachBotInstallModal {...props} />
  ) : undefined;
};

export default memo(AttachBotInstallModalAsync);
