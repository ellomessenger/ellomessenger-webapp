import React, { FC, memo } from 'react';

import Button from '../../ui/Button';

import styles from './PhoneCallButton.module.scss';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';

type OwnProps = {
  onClick: VoidFunction;
  label: string;
  icon?: string;
  iconClassName?: string;
  customIcon?: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  isActive?: boolean;
};

const PhoneCallButton: FC<OwnProps> = ({
  onClick,
  label,
  customIcon,
  icon,
  iconClassName,
  className,
  isDisabled,
  isActive,
}) => {
  return (
    <div className={styles.root}>
      <Button
        round
        className={classNames(
          className,
          styles.button,
          isActive && styles.active
        )}
        onClick={onClick}
        disabled={isDisabled}
      >
        {customIcon ||
          (icon && (
            <i className={classNames(iconClassName, `icon-svg`)}>
              <IconSvg name={icon} w='36' h='36' />
            </i>
          ))}
      </Button>
      <div className={styles.buttonText}>{label}</div>
    </div>
  );
};

export default memo(PhoneCallButton);
