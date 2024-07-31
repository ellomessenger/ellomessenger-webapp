import type { FC } from 'react';
import React, { memo } from 'react';
import type { OwnProps } from './EmojiTooltip';
import { Bundles } from '../../../util/moduleLoader';

import useModuleLoader from '../../../hooks/useModuleLoader';

const EmojiTooltipAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const EmojiTooltip = useModuleLoader(Bundles.Extra, 'EmojiTooltip', !isOpen);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return EmojiTooltip ? <EmojiTooltip {...props} /> : undefined;
};

export default memo(EmojiTooltipAsync);
