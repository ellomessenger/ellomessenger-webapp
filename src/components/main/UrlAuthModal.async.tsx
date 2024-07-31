import React, { memo } from 'react';
import { Bundles } from '../../util/moduleLoader';

import type { FC } from 'react';
import type { OwnProps } from './UrlAuthModal';

import useModuleLoader from '../../hooks/useModuleLoader';

const UrlAuthModalAsync: FC<OwnProps> = (props) => {
  const { urlAuth } = props;
  const UrlAuthModal = useModuleLoader(Bundles.Extra, 'UrlAuthModal', !urlAuth);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return UrlAuthModal ? <UrlAuthModal {...props} /> : undefined;
};

export default memo(UrlAuthModalAsync);
