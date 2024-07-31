import type {} from 'react';
import React, {
  FC,
  ChangeEvent,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { getActions } from '../../global';

import type { ApiPhoto, ApiReportReason } from '../../api/types';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import RadioGroup from '../ui/RadioGroup';
import InputText from '../ui/InputText';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  isOpen: boolean;
  subject?: 'peer' | 'messages' | 'media';
  chatId?: string;
  photo?: ApiPhoto;
  messageIds?: number[];
  onClose: () => void;
  onCloseAnimationEnd?: () => void;
};

const ReportModal: FC<OwnProps> = ({
  isOpen,
  subject = 'messages',
  chatId,
  photo,
  messageIds,
  onClose,
  onCloseAnimationEnd,
}) => {
  const {
    reportMessages,
    reportPeer,
    reportProfilePhoto,
    exitMessageSelectMode,
  } = getActions();

  const [selectedReason, setSelectedReason] = useState<ApiReportReason>('spam');
  const [description, setDescription] = useState('');

  const handleReport = useCallback(() => {
    switch (subject) {
      case 'messages':
        reportMessages({
          messageIds: messageIds!,
          reason: selectedReason,
          description,
        });
        exitMessageSelectMode();
        break;
      case 'peer':
        reportPeer({ chatId, reason: selectedReason, description });
        break;
      case 'media':
        reportProfilePhoto({
          chatId,
          photo,
          reason: selectedReason,
          description,
        });
        break;
    }
    onClose();
  }, [
    description,
    exitMessageSelectMode,
    messageIds,
    photo,
    onClose,
    reportMessages,
    selectedReason,
    chatId,
    reportProfilePhoto,
    reportPeer,
    subject,
  ]);

  const handleSelectReason = useCallback((value: string) => {
    setSelectedReason(value as ApiReportReason);
  }, []);

  const handleDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
    },
    []
  );

  const { t } = useTranslation();

  const REPORT_OPTIONS: { value: ApiReportReason; label: string }[] = useMemo(
    () => [
      { value: 'spam', label: t('ReportPeer.ReasonSpam') },
      { value: 'violence', label: t('ReportPeer.ReasonViolence') },
      {
        value: 'pornography',
        label: t('ReportPeer.ReasonPornography'),
      },
      {
        value: 'childAbuse',
        label: t('ReportPeer.ReasonChildAbuse'),
      },
      { value: 'copyright', label: t('ReportPeer.ReasonCopyright') },
      { value: 'illegalDrugs', label: 'Illegal Drugs' },
      { value: 'personalDetails', label: 'Personal Details' },
      { value: 'other', label: t('ReportPeer.ReasonOther') },
    ],
    [t]
  );

  if (
    (subject === 'messages' && !messageIds) ||
    (subject === 'peer' && !chatId) ||
    (subject === 'media' && (!chatId || !photo))
  ) {
    return null;
  }

  const title =
    subject === 'messages'
      ? t('ReportPeer.MessageTitle')
      : t('ReportPeer.Report');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onEnter={isOpen ? handleReport : undefined}
      onCloseAnimationEnd={onCloseAnimationEnd}
      className='slim'
      title={title}
      hasCloseButton
    >
      <div className='modal-content custom-scroll'>
        <RadioGroup
          name='report-message'
          options={REPORT_OPTIONS}
          onChange={handleSelectReason}
          selected={selectedReason}
        />
        <InputText
          label={String(t('ReportPeer.ReasonDescription'))}
          value={description}
          onChange={handleDescriptionChange}
          as_disabled
        />
        <div className='dialog-buttons'>
          <Button color='danger' onClick={handleReport}>
            {t('ReportPeer.Report')}
          </Button>
          <Button outline onClick={onClose}>
            {t('Cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ReportModal);
