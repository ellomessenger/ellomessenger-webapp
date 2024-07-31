import type { FC } from 'react';
import React, { memo } from 'react';
import { Bundles } from '../../util/moduleLoader';
import type { OwnProps } from './ForwardRecipientPicker';

import useModuleLoader from '../../hooks/useModuleLoader';

const ForwardRecipientPickerAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const ForwardRecipientPicker = useModuleLoader(
    Bundles.Extra,
    'ForwardRecipientPicker',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return ForwardRecipientPicker ? <ForwardRecipientPicker {...props} /> : null;
};

export default memo(ForwardRecipientPickerAsync);
