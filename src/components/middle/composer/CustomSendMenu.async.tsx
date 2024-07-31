import type { FC } from 'react';
import React, { memo } from 'react';
import type { OwnProps } from './CustomSendMenu';
import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';
import CustomSendMenu from './CustomSendMenu';

const CustomSendMenuAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const CustomSendModule = useModuleLoader(
    Bundles.Extra,
    'CustomSendMenu',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return CustomSendModule ? <CustomSendMenu {...props} /> : null;
};

export default memo(CustomSendMenuAsync);
