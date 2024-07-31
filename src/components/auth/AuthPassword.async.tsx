import React, { FC, memo } from 'react';

import { GlobalState } from '../../global/types';
import AuthPassword from './AuthPassword';
import { withGlobal } from '../../global';
type StateProps = Pick<GlobalState, 'authState'>;

const AuthPasswordAsync: FC<StateProps> = ({ authState }) => {
  const isAuthReady = authState === 'authorizationStateWaitPassword';
  return isAuthReady ? <AuthPassword /> : null;
};

export default memo(
  withGlobal((global): StateProps => {
    const { authState } = global;
    return {
      authState,
    };
  })(AuthPasswordAsync)
);
