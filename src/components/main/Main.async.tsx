import React, { FC, memo } from 'react';
import { Bundles } from '../../util/moduleLoader';

import type { OwnProps } from './Main';

import useModuleLoader from '../../hooks/useModuleLoader';

const MainAsync: FC<OwnProps> = (props) => {
  const Main = useModuleLoader(Bundles.Main, 'Main');

  // eslint-disable-next-line react/jsx-props-no-spreading
  return Main ? <Main {...props} /> : null;
};

export default memo(MainAsync);
