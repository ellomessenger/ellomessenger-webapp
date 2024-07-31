import React, { FC, memo } from 'react';
import { Bundles } from '../../util/moduleLoader';
import type { OwnProps } from './MessageSelectToolbar';

import useModuleLoader from '../../hooks/useModuleLoader';
import MessageSelectToolbar from './MessageSelectToolbar';

const MessageSelectToolbarAsync: FC<OwnProps> = (props) => {
  const { isActive } = props;
  const MessageSelectToolbarModule = useModuleLoader(
    Bundles.Extra,
    'MessageSelectToolbar',
    !isActive
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return MessageSelectToolbarModule ? (
    <MessageSelectToolbar {...props} />
  ) : null;
};

export default memo(MessageSelectToolbarAsync);
