import React, { FC, memo } from 'react';
import { Bundles } from '../../../util/moduleLoader';

import type { OwnProps } from './NewChat';

import useModuleLoader from '../../../hooks/useModuleLoader';
import Loading from '../../ui/Loading';
import NewChat from './NewChat';

const NewChatAsync: FC<OwnProps> = (props) => {
  const NewChatModule = useModuleLoader(Bundles.Extra, 'NewChat');

  return NewChatModule ? <NewChat {...props} /> : <Loading />;
};

export default memo(NewChatAsync);
