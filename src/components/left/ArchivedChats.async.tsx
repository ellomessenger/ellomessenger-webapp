import React, { FC, memo } from 'react';
import type { OwnProps } from './ArchivedChats';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';
import Loading from '../ui/Loading';
import ArchivedChats from './ArchivedChats';

const ArchivedChatsAsync: FC<OwnProps> = (props) => {
  const ArchivedChatsModule = useModuleLoader(Bundles.Extra, 'ArchivedChats');

  // eslint-disable-next-line react/jsx-props-no-spreading
  return ArchivedChatsModule ? <ArchivedChats {...props} /> : <Loading />;
};

export default memo(ArchivedChatsAsync);
