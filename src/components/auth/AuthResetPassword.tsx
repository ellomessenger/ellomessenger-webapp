import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { GlobalState } from '../../global/types';
import { pick } from '../../util/iteratees';
import { getActions, withGlobal } from '../../global';
import ResetPasswordForm from './ResetPasswordForm';
import { ResetPasswordScreens } from './Auth';
import Transition from '../ui/Transition';
import CreateNewPasswordForm, { VerifyRequest } from './CreateNewPasswordForm';
import VerifyEmailForm from './VerifyEmailForm';
import useHistoryBack from '../../hooks/useHistoryBack';

type StateProps = Pick<GlobalState, 'authState'>;
type OwnProps = {
  isActive?: boolean;
  onClose: () => void;
  setScreen: (screen: ResetPasswordScreens) => void;
  screen: ResetPasswordScreens;
};

const AuthResetPassword: FC<OwnProps & StateProps> = ({
  screen,
  isActive,
  onClose,
  setScreen,
}) => {
  const [dataForm, setDataForm] = useState<VerifyRequest>({});

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const handleSetScreen = useCallback(() => {
    setScreen(ResetPasswordScreens.Email);
  }, [setScreen]);

  function renderContent() {
    switch (screen) {
      case ResetPasswordScreens.CreatePassword:
        return (
          <CreateNewPasswordForm
            formData={dataForm}
            setData={setDataForm}
            setScreen={setScreen}
          />
        );
      // case ResetPasswordScreens.ConfirmCode:
      //   return (
      //     <VerifyEmailForm formData={dataForm} setScreen={handleSetScreen} />
      //   );
      default:
        return (
          <ResetPasswordForm setData={setDataForm} setScreen={setScreen} />
        );
    }
  }

  return (
    <Transition
      id='forgot-password'
      name='fade'
      className='custom-scroll'
      activeKey={screen}
    >
      {renderContent}
    </Transition>
  );
};

export default memo(
  withGlobal((global): StateProps => pick(global, ['authState']))(
    AuthResetPassword
  )
);
