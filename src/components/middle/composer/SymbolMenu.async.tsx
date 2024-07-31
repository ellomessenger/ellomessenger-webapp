import React, { FC, memo } from 'react';
import type { OwnProps } from './SymbolMenu';
import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';
import SymbolMenu from './SymbolMenu';

const SymbolMenuAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const SymbolMenuModule = useModuleLoader(
    Bundles.Extra,
    'SymbolMenu',
    !isOpen
  );

  return SymbolMenuModule ? <SymbolMenu {...props} /> : null;
};

export default memo(SymbolMenuAsync);
