import React, { FC, memo } from 'react';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';
import Loading from '../ui/Loading';
import StickerSearch, { OwnProps } from './StickerSearch';

const StickerSearchAsync: FC<OwnProps> = (props) => {
  const StickerSearchModule = useModuleLoader(Bundles.Extra, 'StickerSearch');
  return StickerSearchModule ? <StickerSearch {...props} /> : <Loading />;
};

export default memo(StickerSearchAsync);
