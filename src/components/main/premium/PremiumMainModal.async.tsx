import type { FC } from 'react';
import React, { memo } from 'react';
import { Bundles } from '../../../util/moduleLoader';

import type { OwnProps } from './PremiumMainModal';

import useModuleLoader from '../../../hooks/useModuleLoader';

const PremiumMainModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const PremiumMainModal = useModuleLoader(
    Bundles.Extra,
    'PremiumMainModal',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return PremiumMainModal ? <PremiumMainModal {...props} /> : undefined;
};

export default memo(PremiumMainModalAsync);
