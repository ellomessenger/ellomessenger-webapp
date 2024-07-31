import React, { FC, memo, useEffect } from 'react';

import { formatIntegerCompact } from '../../util/textFormat';
import { useFolderManagerForUnreadCounters } from '../../hooks/useFolderManager';
import { getAllNotificationsCount } from '../../util/folderManager';
import { updateAppBadge } from '../../util/appBadge';

interface OwnProps {
  isForAppBadge?: boolean;
}

const UnreadCounter: FC<OwnProps> = ({ isForAppBadge }) => {
  useFolderManagerForUnreadCounters();
  const unreadNotificationsCount = getAllNotificationsCount();

  useEffect(() => {
    if (isForAppBadge) {
      updateAppBadge(unreadNotificationsCount);
    }
  }, [isForAppBadge, unreadNotificationsCount]);

  if (isForAppBadge || !unreadNotificationsCount) {
    return null;
  }

  return (
    <div className='unread-count active'>
      {formatIntegerCompact(unreadNotificationsCount)}
    </div>
  );
};

export default memo(UnreadCounter);
