import React, { FC, memo, useCallback, useState } from 'react';
import FileDownload from '../ui/FileDownload';
import { Field, FormikProvider, useFormik } from 'formik';

import * as Yup from 'yup';
import IconSvg from '../ui/IconSvg';
import './CreateSale.scss';
import Button from '../ui/Button';
import Input from '../ui/Formik/Input';
import { useTranslation } from 'react-i18next';
import TextArea from '../ui/Formik/TextArea/TextArea';
import { CreateSaleScreen } from '../../types';
import SelectDate from '../ui/Formik/SelectDate/SelectDate';
import AttachmentItem from '../middle/mediasale/AttachmentItem';
import useSignal from '../../hooks/useSignal';
import { ApiAttachment } from '../../api/types';
import useAttachmentModal from '../middle/composer/hooks/useAttachmentModal';
import { withGlobal } from '../../global';
import { selectCurrentLimit } from '../../global/selectors/limits';
import { MAX_UPLOAD_FILEPART_SIZE } from '../../config';

type OwnProps = {
  onScreenSelect: (screen: CreateSaleScreen) => void;
  currentScreen: CreateSaleScreen;
};

type StateProps = {
  fileSizeLimit: number;
};

const CreateSale: FC<OwnProps & StateProps> = ({
  onScreenSelect,
  currentScreen,
  fileSizeLimit,
}) => {
  const [attachments, setAttachments] = useState<ApiAttachment[]>([]);
  const [getHtml, setHtml] = useSignal('');
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      title: '',
      date: '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const { handleAppendFiles, handleSetAttachments } = useAttachmentModal({
    attachments,
    setHtml,
    setAttachments,
    fileSizeLimit,
  });

  const handleDelete = useCallback(
    (index: number) => {
      handleSetAttachments(attachments.filter((a, i) => i !== index));
    },
    [attachments, handleSetAttachments]
  );

  return (
    <div className='right-content create-sale-form'>
      <FormikProvider value={formik}>
        {currentScreen === CreateSaleScreen.Initial ? (
          <>
            <div className='form-items'>
              <FileDownload
                title='Upload file(s)'
                onFileSelect={handleAppendFiles}
                onFileAppend={handleAppendFiles}
                onlyImages
              />
              {!!attachments.length &&
                attachments.map((item, idx) => (
                  <AttachmentItem
                    attachment={item}
                    index={idx}
                    key={item.uniqueId || idx}
                    onDelete={handleDelete}
                  />
                ))}
              <Field name='title' component={Input} label={t('Sale.Title')} />
              <Field
                name='description'
                component={TextArea}
                label={t('Sale.Description')}
                rows='8'
              />
              <Field
                name='price'
                type='number'
                component={Input}
                label={t('Sale.Price')}
              />
            </div>

            <div className='form-submit'>
              <Button
                type='submit'
                size='smaller'
                isShiny
                fullWidth
                className='mb-3'
                disabled={
                  !formik.isValid || formik.isSubmitting || formik.dirty
                }
              >
                {t('Sale.Start')}
              </Button>
              <Button
                size='smaller'
                outline
                fullWidth
                onClick={() => onScreenSelect(CreateSaleScreen.AddTime)}
              >
                {t('Sale.Schedule')}
              </Button>
            </div>
          </>
        ) : (
          <div className='form-submit'>
            <small>Time and date</small>
            <Field name='date' label='Date' component={SelectDate} />
            <Button
              size='smaller'
              fullWidth
              disabled={!formik.values.date}
              onClick={() => onScreenSelect(CreateSaleScreen.Initial)}
            >
              {t('Send')}
            </Button>
          </div>
        )}
      </FormikProvider>
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
  })(CreateSale)
);
