import type { FC } from 'react';
import React, { memo } from 'react';
import type { OwnProps } from './CustomEmojiSetsModal';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const CustomEmojiSetsModalAsync: FC<OwnProps> = (props) => {
  const { customEmojiSetIds } = props;
  const CustomEmojiSetsModal = useModuleLoader(
    Bundles.Extra,
    'CustomEmojiSetsModal',
    !customEmojiSetIds
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return CustomEmojiSetsModal ? <CustomEmojiSetsModal {...props} /> : undefined;
};

export default memo(CustomEmojiSetsModalAsync);
