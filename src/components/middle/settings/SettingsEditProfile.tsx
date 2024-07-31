import React, {
  FC,
  useState,
  useCallback,
  memo,
  useEffect,
  useMemo,
} from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiUserFullInfo, ApiUsername } from '../../../api/types';
import { ApiMediaFormat } from '../../../api/types';
import { EGender, ProfileEditProgress } from '../../../types';

import {
  PURCHASE_USERNAME,
  TME_LINK_PREFIX,
  USERNAME_REGEX,
} from '../../../config';
import { throttle } from '../../../util/schedulers';
import { selectTabState, selectUser } from '../../../global/selectors';
import { getChatAvatarHash } from '../../../global/helpers';
import { selectCurrentLimit } from '../../../global/selectors/limits';
import renderText from '../../common/helpers/renderText';
import useMedia from '../../../hooks/useMedia';
import AvatarEditable from '../../ui/AvatarEditable';
import SafeLink from '../../common/SafeLink';
import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import Input from '../../ui/Formik/Input';
import SelectDate from '../../ui/Formik/SelectDate/SelectDate';
import * as Yup from 'yup';
import TextArea from '../../ui/Formik/TextArea/TextArea';
import SelectCountry from '../../ui/Formik/SelectCountry/SelectCountry';
import SelectDropdown from '../../ui/Formik/SelectDropdown/SelectDropdown';
import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';

type OwnProps = {
  isActive: boolean;
  onReset: () => void;
};

type StateProps = {
  currentAvatarHash?: string;
  currentFirstName?: string;
  currentLastName?: string;
  fullInfo?: ApiUserFullInfo;
  progress?: ProfileEditProgress;
  checkedUsername?: string;
  editUsernameError?: string;
  isUsernameAvailable?: boolean;
  maxBioLength: number;
  usernames?: ApiUsername[];
  isBusiness?: boolean;
  authErrorAvailable:
    | {
        email?: boolean | undefined;
        username?: boolean | undefined;
      }
    | undefined;
};

interface IValues {
  first_name: string;
  last_name?: string;
  username: string;
  gender: string;
  birthday?: any;
  country_code: string;
  bio?: string;
}

const runThrottled = throttle((cb) => cb(), 60000, true);

const SettingsEditProfile: FC<OwnProps & StateProps> = ({
  currentAvatarHash,
  currentFirstName,
  currentLastName,
  progress,
  maxBioLength,
  usernames,
  fullInfo,
  isBusiness,
  authErrorAvailable,
  onReset,
}) => {
  const { loadCurrentUser, updateProfile } = getActions();

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const firstEditableUsername = useMemo(
    () => usernames?.find(({ isEditable }) => isEditable),
    [usernames]
  );
  const currentUsername = firstEditableUsername?.username || '';
  const {
    bio: currentBio,
    date,
    country,
    gender: currentGender,
  } = fullInfo || {};

  const [isUsernameTouched, setIsUsernameTouched] = useState(false);
  const [isProfileFieldsTouched, setIsProfileFieldsTouched] = useState(false);

  const [photo, setPhoto] = useState<File | undefined>();

  const currentAvatarBlobUrl = useMedia(
    currentAvatarHash,
    false,
    ApiMediaFormat.BlobUrl
  );

  const isLoading = progress === ProfileEditProgress.InProgress;

  // Due to the parent Transition, this component never gets unmounted,
  // that's why we use throttled API call on every update.
  useEffect(() => {
    runThrottled(() => {
      loadCurrentUser();
    });
  }, [loadCurrentUser]);

  useEffect(() => {
    setPhoto(undefined);
  }, [currentAvatarBlobUrl]);

  useEffect(() => {
    if (progress === ProfileEditProgress.Complete) {
      setIsProfileFieldsTouched(false);
      setIsUsernameTouched(false);
    }
  }, [progress]);

  const handlePhotoChange = useCallback((newPhoto: File) => {
    setPhoto(newPhoto);
  }, []);

  const handleProfileSave = useCallback(
    (values: IValues) => {
      updateProfile({
        photo,
        ...values,
        birthday: isBusiness
          ? undefined
          : values.birthday.toISOString().split('.')[0] + '+0000',
      });
    },
    [photo, isProfileFieldsTouched, isUsernameTouched, updateProfile]
  );

  function renderPurchaseLink() {
    const purchaseInfoLink = `${TME_LINK_PREFIX}${PURCHASE_USERNAME}`;

    return (
      <p className='settings-item-description' dir={isRtl ? 'rtl' : undefined}>
        {(t('lng_username_purchase_available') as string)
          .replace('{link}', '%PURCHASE_LINK%')
          .split('%')
          .map((s) => {
            return s === 'PURCHASE_LINK' ? (
              <SafeLink url={purchaseInfoLink} text={`@${PURCHASE_USERNAME}`} />
            ) : (
              s
            );
          })}
      </p>
    );
  }

  const d = new Date();
  const toDate = d.setFullYear(d.getFullYear() - 13);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^(?=.*?[a-z]).{1,}$/, t('Validation.username_validation'))
      .required(t('Validation.required_username'))
      .min(5, t('Validation.username_min_length'))
      .max(32, t('Validation.username_max_length'))
      .test('unique_name', t('Errors.ThisUsernameUnavailable'), (value) => {
        if (value === currentUsername) return true;
        return authErrorAvailable?.username;
      }),
    first_name: Yup.string()
      .required(t('Validation.required_firstname'))
      .min(1, t('Validation.min_length', { count: 1 }))
      .max(64, t('Validation.max_length', { count: 64 })),
    last_name: Yup.string()
      .min(1, t('Validation.min_length', { count: 1 }))
      .max(64, t('Validation.max_length', { count: 64 })),
    bio: Yup.string().max(70, t('Validation.max_length', { count: 70 })),
  });

  const initialValue = {
    first_name: currentFirstName || '',
    last_name: currentLastName || '',
    username: currentUsername,
    gender: currentGender || '',
    birthday: date && new Date(date * 1000),
    country_code: country || '',
    bio: currentBio || '',
  };

  return (
    <div className='settings-container'>
      <div className='settings-edit-profile'>
        <AvatarEditable
          currentAvatarBlobUrl={currentAvatarBlobUrl}
          onChange={handlePhotoChange}
          disabled={isLoading}
        />
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            handleProfileSave(values);
            setPhoto(undefined);
            resetForm({ values });
            setSubmitting(false);
          }}
        >
          {({ values, isValid, isSubmitting, dirty }) => {
            const onDisabled = () => {
              if (photo) {
                return false;
              } else if (dirty) {
                return !(isValid && dirty);
              } else {
                return !(isValid && dirty) || isSubmitting;
              }
            };

            return (
              <Form>
                <div className='input-group'>
                  <Field
                    name='first_name'
                    component={Input}
                    label={t('FirstName')}
                    maxLength={64}
                    withoutCleaning
                  />
                  {!isBusiness && (
                    <Field
                      name='last_name'
                      component={Input}
                      label={t('LastName')}
                      maxLength={64}
                      withoutCleaning
                    />
                  )}
                </div>
                <p
                  className='settings-item-description'
                  dir={isRtl ? 'rtl' : undefined}
                >
                  {renderText(String(t('Registration.name_description')), [
                    'br',
                    'simple_markdown',
                  ])}
                </p>
                <div className='input-group mb-2'>
                  <Field
                    name='username'
                    component={Input}
                    label={t('Registration.place_username')}
                    withoutCleaning
                    iconLeft={<IconSvg name='mail' />}
                    size='smaller'
                    maxLength={32}
                    regexp={USERNAME_REGEX}
                  />

                  {!isBusiness && (
                    <Field
                      name='birthday'
                      label='Date of birth'
                      maxAt={toDate}
                      component={SelectDate}
                      size='smaller'
                    />
                  )}
                </div>
                <Field
                  name='bio'
                  component={TextArea}
                  rows='4'
                  maxLength={maxBioLength}
                  maxLengthIndicator={
                    maxBioLength
                      ? (maxBioLength - values.bio.length).toString()
                      : undefined
                  }
                />
                <p
                  className='settings-item-description'
                  dir={isRtl ? 'rtl' : undefined}
                >
                  {renderText(String(t('Registration.bio_description')), [
                    'br',
                    'simple_markdown',
                  ])}
                </p>
                <div className='input-group mb-6'>
                  <Field
                    scrollId='settings_content'
                    name='country_code'
                    component={SelectCountry}
                    positionY='bottom'
                  />
                  {!isBusiness && (
                    <Field
                      scrollId='settings_content'
                      name='gender'
                      label={t('Registration.label_gender')}
                      component={SelectDropdown}
                      dataList={EGender}
                    />
                  )}
                </div>
                <div className='form-submit'>
                  <Button
                    type='submit'
                    size='smaller'
                    isShiny
                    disabled={onDisabled()}
                  >
                    {t('Save')}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>

      {/* <FloatingActionButton
        isShown={isSaveButtonShown}
        onClick={handleProfileSave}
        disabled={isLoading}
        ariaLabel={lang('Save')}
      >
        {isLoading ? <Spinner color='white' /> : <i className='icon-check' />}
      </FloatingActionButton> */}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { currentUserId, authErrorAvailable } = global;
    const {
      progress,
      isUsernameAvailable,
      checkedUsername,
      error: editUsernameError,
    } = selectTabState(global).profileEdit || {};
    const currentUser = currentUserId
      ? selectUser(global, currentUserId)
      : undefined;

    const maxBioLength = selectCurrentLimit(global, 'aboutLength');

    if (!currentUser) {
      return {
        progress,
        checkedUsername,
        isUsernameAvailable,
        editUsernameError,
        maxBioLength,
        authErrorAvailable,
      };
    }

    const {
      firstName: currentFirstName,
      lastName: currentLastName,
      usernames,
      isBusiness,
      fullInfo,
    } = currentUser;
    const currentAvatarHash = getChatAvatarHash(currentUser);

    return {
      currentAvatarHash,
      currentFirstName,
      currentLastName,
      fullInfo,
      progress,
      isUsernameAvailable,
      checkedUsername,
      editUsernameError,
      maxBioLength,
      usernames,
      isBusiness,
      authErrorAvailable,
    };
  })(SettingsEditProfile)
);
