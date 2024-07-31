import React, {
  FC,
  useState,
  useCallback,
  memo,
  useEffect,
  useMemo,
} from 'react';
import { getActions } from '../../global';
import { debounce } from '../../util/schedulers';
import usePrevious from '../../hooks/usePrevious';

import InputText from '../ui/InputText';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  currentUsername?: string;
  asLink?: boolean;
  isLoading?: boolean;
  isUsernameAvailable?: boolean;
  checkedUsername?: string;
  isNewLink?: boolean;
  prefix?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  setValid?: (val: boolean) => void;
};

const MIN_USERNAME_LENGTH = 5;
const MAX_USERNAME_LENGTH = 32;
const LINK_PREFIX_REGEX = /ello\.team\/?/i;
const USERNAME_REGEX = /^\D([a-zA-Z0-9_]+)$/;

const runDebouncedForCheckUsername = debounce((cb) => cb(), 250, false);

function isUsernameValid(username: string) {
  return (
    username.length === 0 ||
    (username.length >= MIN_USERNAME_LENGTH &&
      username.length <= MAX_USERNAME_LENGTH &&
      USERNAME_REGEX.test(username))
  );
}

const UsernameInput: FC<OwnProps> = ({
  currentUsername,
  asLink,
  isLoading,
  isUsernameAvailable,
  checkedUsername,
  isNewLink,
  prefix,
  placeholder,
  onChange,
  setValid,
}) => {
  const { checkUsername, checkPublicLink, checkNewPublicLink } = getActions();
  const [username, setUsername] = useState(currentUsername || '');

  const { t } = useTranslation();
  const langPrefix = asLink ? 'SetUrl' : 'Username';
  const label = asLink ? t('Link.UrlPlaceholder') : t('Username');

  const previousIsUsernameAvailable = usePrevious(isUsernameAvailable);
  const renderingIsUsernameAvailable =
    currentUsername !== username
      ? isUsernameAvailable ?? previousIsUsernameAvailable
      : undefined;
  const isChecking =
    username && currentUsername !== username && checkedUsername !== username;

  const [usernameSuccess, usernameError] = useMemo(() => {
    if (!username.length) {
      return [];
    }

    if (username.length < MIN_USERNAME_LENGTH) {
      return [undefined, t(`${langPrefix}.InvalidShort`)];
    }
    if (username.length > MAX_USERNAME_LENGTH) {
      return [undefined, t(`${langPrefix}.InvalidLong`)];
    }
    if (!USERNAME_REGEX.test(username)) {
      return [undefined, t(`${langPrefix}.Invalid`)];
    }

    if (renderingIsUsernameAvailable === undefined || isChecking) {
      return [];
    }

    // Variable `isUsernameAvailable` is initialized with `undefined`, so a strict false check is required
    return [
      renderingIsUsernameAvailable ? t(`${langPrefix}.Available`) : undefined,
      renderingIsUsernameAvailable === false
        ? t(`${langPrefix}.InUse`)
        : undefined,
    ];
  }, [username, renderingIsUsernameAvailable, isChecking, langPrefix, label]);

  useEffect(() => {
    setUsername(currentUsername || '');
  }, [asLink, currentUsername]);

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUsername = e.target.value.trim().replace(LINK_PREFIX_REGEX, '');
      setUsername(newUsername);

      const isValid = isUsernameValid(newUsername);
      if (!isValid) {
        setValid?.(false);
        return;
      }
      setValid?.(true);
      onChange?.(newUsername);

      runDebouncedForCheckUsername(() => {
        if (newUsername !== currentUsername) {
          const check = asLink
            ? isNewLink
              ? checkNewPublicLink
              : checkPublicLink
            : checkUsername;
          check({ username: newUsername });
        }
      });
    },
    [
      asLink,
      checkPublicLink,
      checkNewPublicLink,
      checkUsername,
      currentUsername,
      onChange,
    ]
  );

  return (
    <InputText
      as_text={asLink}
      value={username}
      prefix={prefix}
      onChange={handleUsernameChange}
      label={String(isChecking ? t('Checking') : '')}
      placeholder={placeholder}
      error={usernameError}
      success={usernameSuccess}
      readOnly={isLoading}
      teactExperimentControlled
    />
  );
};

export default memo(UsernameInput);
