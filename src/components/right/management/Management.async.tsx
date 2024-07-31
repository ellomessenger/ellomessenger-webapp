import React, { FC, memo } from 'react';
import { Bundles } from '../../../util/moduleLoader';

import type { OwnProps } from './Management';

import useModuleLoader from '../../../hooks/useModuleLoader';

import Loading from '../../ui/Loading';
import Management from './Management';

const ManagementAsync: FC<OwnProps> = (props) => {
  const loader = useModuleLoader(Bundles.Extra, 'Management');

  return loader ? <Management {...props} /> : <Loading />;
};

export default memo(ManagementAsync);
