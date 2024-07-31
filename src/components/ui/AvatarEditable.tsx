import React, {
  FC,
  ChangeEvent,
  useState,
  useEffect,
  memo,
  useCallback,
  useRef,
} from 'react';

import CropModal from './CropModal';

import './AvatarEditable.scss';
import classNames from 'classnames';
import IconSvg from './IconSvg';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import { ApiPhoto } from '../../api/types';
import { withGlobal } from '../../global';
import { selectUserFullInfo } from '../../global/selectors';

import DeleteProfilePhotoModal from '../common/DeleteProfilePhotoModal';

interface OwnProps {
  title?: string;
  label?: string;
  disabled?: boolean;
  isForForum?: boolean;
  currentAvatarBlobUrl?: string;
  profileId: string;
  onChange: (file: File) => void;
}

type StateProps = {
  currentUserFallbackPhoto?: ApiPhoto;
};

const AvatarEditable: FC<OwnProps & StateProps> = ({
  title = 'Settings.ChangePhoto',
  label = 'Settings.ChangePhoto',
  disabled,
  isForForum,
  currentAvatarBlobUrl,
  profileId,
  onChange,
  currentUserFallbackPhoto,
}) => {
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [croppedBlobUrl, setCroppedBlobUrl] = useState<string | undefined>(
    currentAvatarBlobUrl
  );

  useEffect(() => {
    setCroppedBlobUrl(currentAvatarBlobUrl);
  }, [currentAvatarBlobUrl]);

  function handleSelectFile(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;

    if (!target?.files?.[0]) {
      return;
    }

    setSelectedFile(target.files[0]);
    target.value = '';
  }

  const handleAvatarCrop = useCallback(
    (croppedImg: File) => {
      setSelectedFile(undefined);
      onChange(croppedImg);
      if (croppedBlobUrl && croppedBlobUrl !== currentAvatarBlobUrl) {
        URL.revokeObjectURL(croppedBlobUrl);
      }
      setCroppedBlobUrl(URL.createObjectURL(croppedImg));
    },
    [croppedBlobUrl, currentAvatarBlobUrl, onChange]
  );

  const handleModalClose = useCallback(() => {
    setSelectedFile(undefined);
  }, []);

  const selectInput = () => {
    if (inputRef.current) {
      //@ts-ignore
      inputRef.current.click();
    }
  };

  const labelClassName = classNames('label', {
    filled: croppedBlobUrl,
    disabled,
    'rounded-square': isForForum,
  });

  return (
    <div className='AvatarEditable'>
      <label
        className={labelClassName}
        role='button'
        tabIndex={0}
        title={t(label!)}
      >
        <input
          ref={inputRef}
          type='file'
          onChange={handleSelectFile}
          accept='image/png, image/jpeg'
        />
        <i className='icon-svg'>
          <IconSvg name='camera' />
        </i>
        {croppedBlobUrl && <img src={croppedBlobUrl} alt='Avatar' />}
      </label>

      <Button isLink onClick={selectInput}>
        <IconSvg name='add-foto' />
        {t(title)}
      </Button>
      <CropModal
        file={selectedFile}
        onClose={handleModalClose}
        onChange={handleAvatarCrop}
      />
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { currentUserId } = global;
    const currentUserFullInfo = selectUserFullInfo(global, currentUserId!);

    return {
      currentUserFallbackPhoto: currentUserFullInfo?.fallbackPhoto,
    };
  })(AvatarEditable)
);
