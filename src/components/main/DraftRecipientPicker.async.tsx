import type { FC } from 'react';
import React, { memo } from 'react';
import { Bundles } from '../../util/moduleLoader';
import type { OwnProps } from './DraftRecipientPicker';

import useModuleLoader from '../../hooks/useModuleLoader';

const DraftRecipientPickerAsync: FC<OwnProps> = (props) => {
  const { requestedDraft } = props;
  const DraftRecipientPicker = useModuleLoader(
    Bundles.Extra,
    'DraftRecipientPicker',
    !requestedDraft
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return DraftRecipientPicker ? <DraftRecipientPicker {...props} /> : undefined;
};

export default memo(DraftRecipientPickerAsync);
