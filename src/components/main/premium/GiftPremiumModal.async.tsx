import type { FC } from 'react';
import React, { memo } from 'react';
import { Bundles } from '../../../util/moduleLoader';

import type { OwnProps } from './GiftPremiumModal';

import useModuleLoader from '../../../hooks/useModuleLoader';

const GiftPremiumModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const GiftPremiumModal = useModuleLoader(
    Bundles.Extra,
    'GiftPremiumModal',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return GiftPremiumModal ? <GiftPremiumModal {...props} /> : undefined;
};

export default memo(GiftPremiumModalAsync);
