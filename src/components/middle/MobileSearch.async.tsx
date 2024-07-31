import type { FC } from 'react';
import React, { memo } from 'react';
import type { OwnProps } from './MobileSearch';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const MobileSearchAsync: FC<OwnProps> = (props) => {
  const { isActive } = props;
  const MobileSearch = useModuleLoader(
    Bundles.Extra,
    'MobileSearch',
    !isActive,
    true
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return MobileSearch ? <MobileSearch {...props} /> : undefined;
};

export default memo(MobileSearchAsync);
