import type { FC } from 'react';
import React, { memo } from 'react';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';
import Loading from '../ui/Loading';
import GifSearch from './GifSearch';

const GifSearchAsync: FC = (props) => {
  const GifSearchModule = useModuleLoader(Bundles.Extra, 'GifSearch');

  // eslint-disable-next-line react/jsx-props-no-spreading
  return GifSearchModule ? <GifSearch {...props} /> : <Loading />;
};

export default memo(GifSearchAsync);
