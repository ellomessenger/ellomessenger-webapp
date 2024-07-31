import type { FC } from 'react';
import React, { memo } from 'react';
import useModuleLoader from '../../../hooks/useModuleLoader';
import { Bundles } from '../../../util/moduleLoader';
import type { OwnProps } from './GroupCall';

const GroupCallAsync: FC<OwnProps> = (props) => {
  const { groupCallId } = props;
  const GroupCall = useModuleLoader(Bundles.Calls, 'GroupCall', !groupCallId);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return GroupCall ? <GroupCall {...props} /> : undefined;
};

export default memo(GroupCallAsync);
