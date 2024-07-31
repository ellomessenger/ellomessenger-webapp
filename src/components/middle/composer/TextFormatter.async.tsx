import type { FC } from 'react';
import React, { memo } from 'react';
import type { OwnProps } from './TextFormatter';
import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const TextFormatterAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const TextFormatter = useModuleLoader(
    Bundles.Extra,
    'TextFormatter',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return TextFormatter ? <TextFormatter {...props} /> : undefined;
};

export default memo(TextFormatterAsync);
