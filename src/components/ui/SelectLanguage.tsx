import React, { FC, memo, useMemo } from 'react';
import DropdownMenu from './DropdownMenu';
import RadioGroup from './RadioGroup';
import Loading from './Loading';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../config';
import classNames from 'classnames';

const options = LANGUAGES;

const SelectLanguage = () => {
  const { t, i18n, ready } = useTranslation('translation', {
    useSuspense: false,
  });
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const MainButton: FC<{ onTrigger: () => void; isOpen?: boolean }> =
    useMemo(() => {
      return ({ onTrigger, isOpen }) => (
        <div
          role='button'
          className={classNames('select-text', { active: isOpen })}
          onClick={onTrigger}
        >
          {t('Language')} <i className='icon-down'></i>
        </div>
      );
    }, []);

  return (
    <DropdownMenu trigger={MainButton} positionX='right'>
      <>
        {options && ready ? (
          <RadioGroup
            name='language-settings'
            options={options}
            selected={i18n.language}
            onChange={changeLanguage}
          />
        ) : (
          <Loading />
        )}
      </>
    </DropdownMenu>
  );
};

export default memo(SelectLanguage);
