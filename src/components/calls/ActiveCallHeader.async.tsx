import type { FC } from 'react';
import React, { memo } from 'react';
import useModuleLoader from '../../hooks/useModuleLoader';
import { Bundles } from '../../util/moduleLoader';

type OwnProps = {
  isActive?: boolean;
};

const ActiveCallHeaderAsync: FC<OwnProps> = (props) => {
  const { isActive } = props;
  const ActiveCallHeader = useModuleLoader(
    Bundles.Calls,
    'ActiveCallHeader',
    !isActive
  );

  return ActiveCallHeader ? <ActiveCallHeader /> : undefined;
};

export default memo(ActiveCallHeaderAsync);
