import React, { FC, memo } from 'react';
import { getActions, withGlobal } from '../../../../global';

import Modal from '../../../ui/Modal';
import { useTranslation } from 'react-i18next';
import VerifyEmailForm from '../../../auth/VerifyEmailForm';
import { GlobalState } from '../../../../global/types';
import { pick } from '../../../../util/iteratees';
import { getCurrentTabId } from '../../../../util/establishMultitabRole';

type OwnProps = {
  // isLoading?: boolean;
  // error?: string;
  // clearError: NoneToVoidFunction;
  // onSubmit: (hint: string) => void;
  // isActive?: boolean;
};

type StateProps = Pick<GlobalState, 'confirmData'>;

const TwoFaEmailCodeModal: FC<OwnProps & StateProps> = ({ confirmData }) => {
  const { clearConfirmEmail } = getActions();
  const { t } = useTranslation();
  const tabId = getCurrentTabId();
  const isOpen = Boolean(
    confirmData?.expire && tabId && tabId === confirmData.params.tabId
  );

  return (
    <Modal
      isOpen={isOpen}
      className='confirm'
      onClose={clearConfirmEmail}
      hasCloseButton
      noBackdropClose
      title={t('VerifyEmail.Title')}
    >
      <div className='modal-content'>
        <VerifyEmailForm text={t('VerifyEmail.Text_2')} />
      </div>
    </Modal>
  );
};

export default memo(
  withGlobal((global): StateProps => pick(global, ['confirmData']))(
    TwoFaEmailCodeModal
  )
);
