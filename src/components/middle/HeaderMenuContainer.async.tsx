import React, { FC, memo } from 'react';
import type { OwnProps } from './HeaderMenuContainer';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';
import HeaderMenuContainer from './HeaderMenuContainer';

const HeaderMenuContainerAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const HeaderMenuContainerModule = useModuleLoader(
    Bundles.Extra,
    'HeaderMenuContainer',
    !isOpen
  );

  return HeaderMenuContainerModule ? <HeaderMenuContainer {...props} /> : null;
};

export default memo(HeaderMenuContainerAsync);
