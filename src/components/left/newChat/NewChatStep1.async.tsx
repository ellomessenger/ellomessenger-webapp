import React, { FC, memo } from 'react';
import { Bundles } from '../../../util/moduleLoader';

import type { OwnProps } from './NewChatStep1';

import useModuleLoader from '../../../hooks/useModuleLoader';
import Loading from '../../ui/Loading';
import NewChatStep1 from './NewChatStep1';

const NewChatStep1Async: FC<OwnProps> = (props) => {
  const NewChatStep1Module = useModuleLoader(Bundles.Extra, 'NewChatStep1');

  return NewChatStep1Module ? <NewChatStep1 {...props} /> : <Loading />;
};

export default memo(NewChatStep1Async);
