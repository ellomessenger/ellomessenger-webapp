import React, { FC } from 'react';
import AnimatedIcon from '../common/AnimatedIcon';
import { LOCAL_TGS_URLS } from '../common/helpers/animatedAssets';
import { STICKER_SIZE_TWO_FA } from '../../config';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import useLastCallback from '../../hooks/useLastCallback';

type OwnProps = {
  onClose: () => void;
  username: string;
  errorMessage?: string;
};

const AuthUserBlocked: FC<OwnProps> = ({ onClose, username, errorMessage }) => {
  const { t } = useTranslation();
  const isDeleted = errorMessage === 'user is deleted';

  const handleClickSupport = useLastCallback(() => {
    window.open('https://ellomessenger.com/support', '_blank', 'noopener');
  });
  return (
    <div
      id='auth-qr-form'
      className='custom-scroll auth-password-center auth-password-form'
    >
      {username && (
        <div className='auth-form auth-blocked-user'>
          <div className='AvatarEditable'>
            <AnimatedIcon
              tgsUrl={LOCAL_TGS_URLS.Banned}
              size={STICKER_SIZE_TWO_FA}
            />
          </div>
          <h2>
            Account <span className='text-primary'>@{username}</span>{' '}
            {isDeleted ? 'is deleted' : 'is suspended'}
          </h2>
          <p>
            {t(
              `Login.${
                isDeleted ? 'accountDeletedDescr' : 'accountBlockedDescr'
              }`
            )}
          </p>
          <div className='form-submit'>
            <Button isShiny className='mb-3' onClick={handleClickSupport}>
              {t('Support')}
            </Button>
            <Button color='danger' onClick={onClose}>
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthUserBlocked;
