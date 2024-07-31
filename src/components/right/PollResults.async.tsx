import type { FC } from 'react';
import React, { memo } from 'react';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';
import Loading from '../ui/Loading';
import PollResults from './PollResults';

const PollResultsAsync: FC = (props) => {
  const PollResultsModule = useModuleLoader(Bundles.Extra, 'PollResults');

  return PollResultsModule ? <PollResults {...props} /> : <Loading />;
};

export default memo(PollResultsAsync);
