import React, { memo } from 'react';
import type { FC } from 'react';
import type { OwnProps } from './EditTopic';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';
import Loading from '../ui/Loading';

const EditTopicAsync: FC<OwnProps> = (props) => {
  const EditTopic = useModuleLoader(Bundles.Extra, 'EditTopic');

  // eslint-disable-next-line react/jsx-props-no-spreading
  return EditTopic ? <EditTopic {...props} /> : <Loading />;
};

export default memo(EditTopicAsync);
