import type { FC } from 'react';
import React, { memo } from 'react';
import type { OwnProps } from './CalendarModal';
import { Bundles } from '../../util/moduleLoader';

import useModuleLoader from '../../hooks/useModuleLoader';

const CalendarModalAsync: FC<OwnProps> = (props) => {
  const { isOpen } = props;
  const CalendarModal = useModuleLoader(
    Bundles.Extra,
    'CalendarModal',
    !isOpen
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return CalendarModal ? <CalendarModal {...props} /> : undefined;
};

export default memo(CalendarModalAsync);
