import type { FC } from 'react';
import React, { memo } from 'react';
import type { OwnProps } from './DeleteMessageModal';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const DeleteMessageModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const DeleteMessageModal = useModuleLoader(
    Bundles.Extra,
    'DeleteMessageModal',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return DeleteMessageModal ? <DeleteMessageModal {...props} /> : undefined;
};

export default memo(DeleteMessageModalAsync);
