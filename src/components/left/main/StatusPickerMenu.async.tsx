import React, { memo } from 'react';

import type { FC } from 'react';
import type { OwnProps } from './StatusPickerMenu';

import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const StatusPickerMenuAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const StatusPickerMenu = useModuleLoader(
    Bundles.Extra,
    'StatusPickerMenu',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return StatusPickerMenu ? <StatusPickerMenu {...props} /> : undefined;
};

export default memo(StatusPickerMenuAsync);
