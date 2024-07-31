import React, { FC, memo } from 'react';

import type { OwnProps } from './ReactionPicker';

import { Bundles } from '../../../util/moduleLoader';
import useModuleLoader from '../../../hooks/useModuleLoader';
import ReactionPicker from './ReactionPicker';

interface LocalOwnProps {
  shouldLoad?: boolean;
}

const ReactionPickerAsync: FC<OwnProps & LocalOwnProps> = (props) => {
  const { isOpen, shouldLoad } = props;
  const ReactionPickerModule = useModuleLoader(
    Bundles.Extra,
    'ReactionPicker',
    !isOpen && !shouldLoad
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return ReactionPickerModule ? <ReactionPicker {...props} /> : null;
};

export default memo(ReactionPickerAsync);
