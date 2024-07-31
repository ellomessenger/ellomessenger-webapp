import type { FC } from 'react';
import React, { memo } from 'react';
import { Bundles } from '../../util/moduleLoader';

import type { OwnProps } from './WebAppModal';

import useModuleLoader from '../../hooks/useModuleLoader';

const WebAppModalAsync: FC<OwnProps> = (props) => {
  const { webApp } = props;
  const WebAppModal = useModuleLoader(Bundles.Extra, 'WebAppModal', !webApp);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return WebAppModal ? <WebAppModal {...props} /> : undefined;
};

export default memo(WebAppModalAsync);
