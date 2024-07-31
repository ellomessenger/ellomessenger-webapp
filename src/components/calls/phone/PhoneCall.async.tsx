import type { FC } from 'react';
import React, { memo } from 'react';
import useModuleLoader from '../../../hooks/useModuleLoader';
import { Bundles } from '../../../util/moduleLoader';

type OwnProps = {
  isActive?: boolean;
};

const PhoneCallAsync: FC<OwnProps> = (props) => {
  const { isActive } = props;
  const PhoneCall = useModuleLoader(Bundles.Calls, 'PhoneCall', !isActive);

  return PhoneCall ? <PhoneCall /> : undefined;
};

export default memo(PhoneCallAsync);
