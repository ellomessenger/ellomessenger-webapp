import React, { FC, memo } from 'react';
import { getActions, withGlobal } from '../../../global';
import { ApiMessage } from '../../../api/types';
import { selectMessagesWithCall, selectUser } from '../../../global/selectors';
import CallListItem from './CallListItem';

interface OwnProps {
  missed?: boolean;
  handleCalls: (name: string) => void;
}

type StateProps = {
  messages?: ApiMessage[] | undefined;
};

const CallsSidebarList: FC<OwnProps & StateProps> = ({
  missed,
  messages,
  handleCalls,
}) => {
  const { setMiddleScreen } = getActions();

  return (
    <div className='settings-content custom-scroll settings-content-custom'>
      {messages &&
        messages.map((message) => (
          <CallListItem key={message.id} message={message} />
        ))}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { missed }): StateProps => {
    const messages = selectMessagesWithCall(global, missed);

    return {
      messages,
    };
  })(CallsSidebarList)
);
