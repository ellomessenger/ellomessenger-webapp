import React, { FC, memo, useRef } from 'react';

import type { ApiMessageOutgoingStatus } from '../../api/types';

import './MessageOutgoingStatus.scss';
import Transition from '../ui/Transition';
import IconSvg from '../ui/IconSvg';

type OwnProps = {
  status: ApiMessageOutgoingStatus;
};

enum Keys {
  failed,
  pending,
  succeeded,
  read,
}
const MessageOutgoingStatus: FC<OwnProps> = ({ status }) => {
  return (
    <div className='MessageOutgoingStatus'>
      <Transition name='reveal' activeKey={Keys[status]}>
        {status === 'failed' ? (
          <div className='MessageOutgoingStatus--failed'>
            <i className='icon-message-failed' />
          </div>
        ) : (
          <i className='icon-svg'>
            <IconSvg name={`message-${status}`} />
          </i>
        )}
      </Transition>
    </div>
  );
};

export default memo(MessageOutgoingStatus);
