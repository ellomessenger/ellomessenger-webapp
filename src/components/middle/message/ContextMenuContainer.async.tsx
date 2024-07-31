import React, { FC, memo } from 'react';
import type { OwnProps } from './ContextMenuContainer';
import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';
import ContextMenuContainer from './ContextMenuContainer';

const ContextMenuContainerAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const ContextMenuContainerModule = useModuleLoader(
    Bundles.Extra,
    'ContextMenuContainer',
    !isOpen
  );

  return ContextMenuContainerModule ? (
    <ContextMenuContainer {...props} />
  ) : null;
};

export default memo(ContextMenuContainerAsync);
