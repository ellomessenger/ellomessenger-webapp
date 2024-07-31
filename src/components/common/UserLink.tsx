import React, { FC, useCallback } from 'react';

import type { ApiChat, ApiUser } from '../../api/types';

import Link from '../ui/Link';
import { getActions } from '../../global';
import classNames from 'classnames';

type OwnProps = {
  className?: string;
  sender?: ApiUser | ApiChat;
  children: React.ReactNode;
};

const UserLink: FC<OwnProps> = ({ className, sender, children }) => {
  const { openChat } = getActions();

  const handleClick = useCallback(() => {
    if (sender) {
      openChat({ id: sender.id });
    }
  }, [sender, openChat]);

  if (!sender) {
    return children;
  }

  return (
    <Link className={classNames('UserLink', className)} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default UserLink;
