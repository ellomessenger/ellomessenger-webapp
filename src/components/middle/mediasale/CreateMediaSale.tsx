import React, { FC, memo, useCallback, useState } from 'react';
import useHistoryBack from '../../../hooks/useHistoryBack';
import { MiddleColumnContent } from '../../../types';
import Button from '../../ui/Button';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import { Field, FormikProvider, useFormik } from 'formik';
import Input from '../../ui/Formik/Input';

import './MediaSale.scss';
import TextArea from '../../ui/Formik/TextArea/TextArea';
import FileDownload from '../../ui/FileDownload';
import useAttachmentModal from '../composer/hooks/useAttachmentModal';
import { ApiAttachment, ApiFormattedText } from '../../../api/types';
import useSignal from '../../../hooks/useSignal';
import { getActions, withGlobal } from '../../../global';
import { EDITABLE_INPUT_ID, MAX_UPLOAD_FILEPART_SIZE } from '../../../config';
import { selectCurrentLimit } from '../../../global/selectors/limits';
import AttachmentItem from './AttachmentItem';
import PreviewMediaSaleModal from './PreviewMediaSaleModal';
import useFlag from '../../../hooks/useFlag';
import SelectDate from '../../ui/Formik/SelectDate/SelectDate';
import useLastCallback from '../../../hooks/useLastCallback';
import { getTextWithEntitiesAsHtml } from '../../common/helpers/renderTextWithEntities';

type OwnProps = {
  chatId?: string;
};

type StateProps = {
  fileSizeLimit: number;
};

export enum MediaSaleScreens {
  'Main',
  'Schedule',
}

const CreateMediaSale: FC<OwnProps & StateProps> = ({
  fileSizeLimit,
  chatId,
}) => {
  const { setMiddleScreen } = getActions();
  const { t } = useTranslation();
  const [attachments, setAttachments] = useState<ApiAttachment[]>([]);
  const [isOpenModal, openModal, closeModal] = useFlag();
  const [currentScreen, SetCurrentScreen] = useState(MediaSaleScreens.Main);

  const [setHtml] = useSignal('');

  const { handleAppendFiles, handleSetAttachments } = useAttachmentModal({
    attachments,
    fileSizeLimit,
    setHtml,
    setAttachments,
    chatId,
  });
  const formik = useFormik({
    initialValues: {
      title: '',
      date: '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const handleDelete = useCallback(
    (index: number) => {
      handleSetAttachments(attachments.filter((a, i) => i !== index));
    },
    [attachments, handleSetAttachments]
  );

  const goBackMessage = useCallback(() => {
    if (currentScreen === MediaSaleScreens.Main) {
      setMiddleScreen({ screen: MiddleColumnContent.Messages });
    } else {
      SetCurrentScreen(MediaSaleScreens.Main);
    }
  }, [currentScreen]);

  const handleSendDate = useCallback(() => {
    openModal();
    SetCurrentScreen(MediaSaleScreens.Main);
  }, [SetCurrentScreen]);

  useHistoryBack({
    isActive: true,
    onBack: goBackMessage,
  });

  return (
    <div id='MediaSale' className='settings-layout'>
      <div className='MiddleHeader'>
        <div className='setting-info'>
          <Button
            round
            size='smaller'
            color='translucent'
            onClick={goBackMessage}
            ariaLabel={String(t('GoBack'))}
          >
            <i className='icon-svg'>
              <IconSvg name='arrow-left' />
            </i>
          </Button>
          <h4>{t('Channel.CreateMediaSale')}</h4>
        </div>
      </div>
      <div className='MediaSale settings-content custom-scroll'>
        <div className='settings-container'>
          <FormikProvider value={formik}>
            {currentScreen === MediaSaleScreens.Main ? (
              <>
                <FileDownload
                  title='Upload file(s)'
                  onFileSelect={handleAppendFiles}
                  onFileAppend={handleAppendFiles}
                />
                {!!attachments.length && (
                  <div>
                    {attachments.map((item, idx) => (
                      <AttachmentItem
                        attachment={item}
                        index={idx}
                        key={item.uniqueId || idx}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
                <Field name='title' component={Input} label={t('Sale.Title')} />
                <Field
                  name='description'
                  component={TextArea}
                  label={t('Sale.Description')}
                  rows='4'
                />
                <div className='row'>
                  <Field
                    name='price'
                    type='number'
                    component={Input}
                    label={t('Sale.PricePerItem')}
                  />
                  <Field
                    name='quantity'
                    type='number'
                    component={Input}
                    label={t('Quantity')}
                  />
                </div>
                <div className='form-submit'>
                  <Button size='smaller' fullWidth onClick={openModal}>
                    {t('Channel.StartMediaSale')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <small>Time and date</small>
                <div className='row'>
                  <Field
                    name='date'
                    label='Time'
                    component={SelectDate}
                    onlyTime
                  />
                  <Field name='date' label='Date' component={SelectDate} />
                </div>
                <div className='form-submit'>
                  <Button size='smaller' fullWidth onClick={handleSendDate}>
                    {t('Send')}
                  </Button>
                </div>
              </>
            )}
          </FormikProvider>
        </div>
        <PreviewMediaSaleModal
          isOpen={isOpenModal}
          onClose={closeModal}
          onSelectScreen={SetCurrentScreen}
        />
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global) => {
    return {
      fileSizeLimit:
        selectCurrentLimit(global, 'uploadMaxFileparts') *
        MAX_UPLOAD_FILEPART_SIZE,
    };
  })(CreateMediaSale)
);
