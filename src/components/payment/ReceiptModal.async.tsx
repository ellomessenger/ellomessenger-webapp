import type { FC } from 'react';
import React, { memo } from 'react';
import type { OwnProps } from './ReceiptModal';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const ReceiptModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const ReceiptModal = useModuleLoader(Bundles.Extra, 'ReceiptModal', !isOpen);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return ReceiptModal ? <ReceiptModal {...props} /> : undefined;
};

export default memo(ReceiptModalAsync);
