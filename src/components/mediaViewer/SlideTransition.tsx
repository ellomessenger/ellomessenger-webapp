import type { FC } from 'react';
import React from 'react';

import { IS_TOUCH_ENV } from '../../util/windowEnvironment';

import type { ChildrenFn, TransitionProps } from '../ui/Transition';
import Transition from '../ui/Transition';

const SlideTransition: FC<TransitionProps & { children: ChildrenFn }> = ({
  children,
  ...props
}) => {
  if (IS_TOUCH_ENV) return children(true, true, 1);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Transition {...props}>{children}</Transition>;
};

export default SlideTransition;
