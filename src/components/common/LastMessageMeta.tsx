import React, { FC, memo } from 'react';

import type { ApiMessage, ApiMessageOutgoingStatus } from '../../api/types';

import { formatPastTimeShort } from '../../util/dateFormat';

import MessageOutgoingStatus from './MessageOutgoingStatus';

import './LastMessageMeta.scss';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  message: ApiMessage;
  outgoingStatus?: ApiMessageOutgoingStatus;
};

const LastMessageMeta: FC<OwnProps> = ({ message, outgoingStatus }) => {
  const { t } = useTranslation();
  return (
    <div className='LastMessageMeta'>
      {outgoingStatus && <MessageOutgoingStatus status={outgoingStatus} />}
      <span className='time'>
        {formatPastTimeShort(t, message.date * 1000)}
      </span>
    </div>
  );
};

export default memo(LastMessageMeta);
