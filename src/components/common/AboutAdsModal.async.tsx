import React, { FC, memo } from 'react';
import type { OwnProps } from './AboutAdsModal';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';
import AboutAdsModal from './AboutAdsModal';

const AboutAdsModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;

  const AboutAdsModalModule = useModuleLoader(
    Bundles.Extra,
    'AboutAdsModal',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return AboutAdsModalModule ? <AboutAdsModal {...props} /> : null;
};

export default memo(AboutAdsModalAsync);
