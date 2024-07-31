import React, { FC, memo } from 'react';
import { Bundles } from '../../../util/moduleLoader';

import type { OwnProps } from './NewChatStep2';

import useModuleLoader from '../../../hooks/useModuleLoader';
import Loading from '../../ui/Loading';
import NewChatStep2 from './NewChatStep2';

const NewChatStep2Async: FC<OwnProps> = (props) => {
  const NewChatStep2Module = useModuleLoader(Bundles.Extra, 'NewChatStep2');

  return NewChatStep2Module ? <NewChatStep2 {...props} /> : <Loading />;
};

export default memo(NewChatStep2Async);
