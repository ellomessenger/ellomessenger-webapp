import React, { FC, memo } from 'react';
import { getActions, withGlobal } from '../../global';

import type { ApiNotification } from '../../api/types';

import { selectTabState } from '../../global/selectors';
import { pick } from '../../util/iteratees';
import renderText from '../common/helpers/renderText';

import Notification from '../ui/Notification';

type StateProps = {
  notifications: ApiNotification[];
};

const Notifications: FC<StateProps> = ({ notifications }) => {
  const { dismissNotification } = getActions();

  if (!notifications.length) {
    return null;
  }

  return (
    <div id='Notifications'>
      {notifications.map(
        (
          { message, className, localId, action, actionText, title, type },
          index
        ) => (
          <Notification
            key={index}
            type={type || undefined}
            title={
              title
                ? renderText(title, ['simple_markdown', 'emoji', 'br', 'links'])
                : undefined
            }
            action={action}
            actionText={actionText}
            className={className}
            message={renderText(message, [
              'simple_markdown',
              'emoji',
              'br',
              'links',
            ])}
            onDismiss={() => dismissNotification({ localId })}
          />
        )
      )}
    </div>
  );
};

export default memo(
  withGlobal(
    (global): StateProps => pick(selectTabState(global), ['notifications'])
  )(Notifications)
);
