import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getActions, withGlobal } from '../../global';

import type { ApiCountryCode, ApiUser, ApiUserStatus } from '../../api/types';

import { IS_TOUCH_ENV } from '../../util/windowEnvironment';
import { getUserStatus } from '../../global/helpers';
import { selectUser, selectUserStatus } from '../../global/selectors';
import { formatPhoneNumberWithCode } from '../../util/phoneNumber';
import useFlag from '../../hooks/useFlag';
import useCurrentOrPrev from '../../hooks/useCurrentOrPrev';

import Modal from '../ui/Modal';
import Avatar from '../common/Avatar';
import InputText from '../ui/InputText';
import Button from '../ui/Button';

import './NewContactModal.scss';
import { useTranslation } from 'react-i18next';

const ANIMATION_DURATION = 200;

export type OwnProps = {
  isOpen: boolean;
  userId?: string;
  isByPhoneNumber?: boolean;
};

type StateProps = {
  user?: ApiUser;
  userStatus?: ApiUserStatus;
  phoneCodeList: ApiCountryCode[];
};

const NewContactModal: FC<OwnProps & StateProps> = ({
  isOpen,
  userId,
  isByPhoneNumber,
  user,
  userStatus,
  phoneCodeList,
}) => {
  const { updateContact, importContact, closeNewContactDialog } = getActions();

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const renderingUser = useCurrentOrPrev(user);
  const renderingIsByPhoneNumber = useCurrentOrPrev(isByPhoneNumber);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isShown, markIsShown, unmarkIsShown] = useFlag();
  const [firstName, setFirstName] = useState<string>(
    renderingUser?.firstName ?? ''
  );
  const [lastName, setLastName] = useState<string>(
    renderingUser?.lastName ?? ''
  );
  const [phone, setPhone] = useState<string>(renderingUser?.phoneNumber ?? '');
  const [shouldSharePhoneNumber, setShouldSharePhoneNumber] =
    useState<boolean>(true);
  const canBeSubmitted = Boolean(firstName && (!isByPhoneNumber || phone));

  useEffect(() => {
    if (isOpen) {
      markIsShown();
      setFirstName(renderingUser?.firstName ?? '');
      setLastName(renderingUser?.lastName ?? '');
      setPhone(renderingUser?.phoneNumber ?? '');
      setShouldSharePhoneNumber(true);
    }
  }, [
    isOpen,
    markIsShown,
    renderingUser?.firstName,
    renderingUser?.lastName,
    renderingUser?.phoneNumber,
  ]);

  useEffect(() => {
    if (!IS_TOUCH_ENV && isShown) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, ANIMATION_DURATION);
    }
  }, [isShown]);

  const handleFirstNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFirstName(e.target.value);
    },
    []
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhone(formatPhoneNumberWithCode(phoneCodeList, e.target.value));
    },
    [phoneCodeList]
  );

  const handleLastNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLastName(e.target.value);
    },
    []
  );

  const handleClose = useCallback(() => {
    closeNewContactDialog();
    setFirstName('');
    setLastName('');
    setPhone('');
  }, [closeNewContactDialog]);

  const handleSubmit = useCallback(() => {
    if (isByPhoneNumber || !userId) {
      importContact({
        firstName,
        lastName,
        phoneNumber: phone,
      });
    } else {
      updateContact({
        userId,
        firstName,
        lastName,
        shouldSharePhoneNumber,
      });
    }
  }, [
    firstName,
    importContact,
    isByPhoneNumber,
    lastName,
    phone,
    shouldSharePhoneNumber,
    updateContact,
    userId,
  ]);

  if (!isOpen && !isShown) {
    return null;
  }

  function renderAddContact() {
    return (
      <>
        <div
          className='NewContactModal__profile'
          dir={isRtl ? 'rtl' : undefined}
        >
          <Avatar peer={renderingUser} text={`${firstName} ${lastName}`} />
          <div className='NewContactModal__profile-info'>
            <div className='NewContactModal__phone-number'>{firstName}</div>
            <span className='NewContactModal__user-status' dir='auto'>
              {getUserStatus(t, renderingUser!, userStatus)}
            </span>
          </div>
        </div>
        <InputText
          elRef={inputRef}
          value={firstName}
          label={t('FirstName')}
          tabIndex={0}
          onChange={handleFirstNameChange}
        />
        <InputText
          value={lastName}
          label={t('LastNameOptional')}
          tabIndex={0}
          onChange={handleLastNameChange}
        />
      </>
    );
  }

  function renderCreateContact() {
    return (
      <div
        className='NewContactModal__new-contact'
        dir={isRtl ? 'rtl' : undefined}
      >
        <Avatar size='jumbo' text={`${firstName} ${lastName}`} />
        <div className='NewContactModal__new-contact-fieldset'>
          <InputText
            value={firstName}
            label={t('FirstName')}
            tabIndex={0}
            onChange={handleFirstNameChange}
          />
          <InputText
            value={lastName}
            label={t('LastName')}
            tabIndex={0}
            onChange={handleLastNameChange}
          />
        </div>
      </div>
    );
  }

  return (
    <Modal
      className='NewContactModal'
      title={t('NewContact')}
      isOpen={isOpen}
      onClose={handleClose}
      onCloseAnimationEnd={unmarkIsShown}
    >
      <div className='modal-content'>
        {renderingUser && renderAddContact()}
        {renderingIsByPhoneNumber && renderCreateContact()}
        <div className='dialog-buttons'>
          <Button
            className='confirm-dialog-button'
            disabled={!canBeSubmitted}
            onClick={handleSubmit}
          >
            {t('Done')}
          </Button>
          <Button
            className='confirm-dialog-button'
            onClick={handleClose}
            outline
          >
            {t('Cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { userId }): StateProps => {
    return {
      user: userId ? selectUser(global, userId) : undefined,
      userStatus: userId ? selectUserStatus(global, userId) : undefined,
      phoneCodeList: global.countryList.phoneCodes,
    };
  })(NewContactModal)
);
