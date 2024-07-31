import type { FC } from 'react';
import React, { useCallback } from 'react';

import type { ApiGroupCall } from '../../api/types';

import buildClassName from '../../util/buildClassName';

import Link from '../ui/Link';
import { getActions } from '../../global';

type OwnProps = {
  className?: string;
  groupCall?: Partial<ApiGroupCall>;
  children: React.ReactNode;
};

const GroupCallLink: FC<OwnProps> = ({ className, groupCall, children }) => {
  const { requestMasterAndJoinGroupCall } = getActions();

  const handleClick = useCallback(() => {
    if (groupCall) {
      requestMasterAndJoinGroupCall({
        id: groupCall.id,
        accessHash: groupCall.accessHash,
      });
    }
  }, [groupCall, requestMasterAndJoinGroupCall]);

  if (!groupCall) {
    return children;
  }

  return (
    <Link
      className={buildClassName('GroupCallLink', className)}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default GroupCallLink;
