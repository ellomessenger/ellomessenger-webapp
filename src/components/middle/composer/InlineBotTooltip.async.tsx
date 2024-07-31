import type { FC } from 'react';
import React, { memo } from 'react';
import type { OwnProps } from './InlineBotTooltip';
import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';
import InlineBotTooltip from './InlineBotTooltip';

const InlineBotTooltipAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const InlineBotTooltipModule = useModuleLoader(
    Bundles.Extra,
    'InlineBotTooltip',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return InlineBotTooltipModule ? <InlineBotTooltip {...props} /> : null;
};

export default memo(InlineBotTooltipAsync);
