import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { getActions } from '../../global';

import type { TextPart } from '../../types';
import type { CallbackAction } from '../../global/types';

import { ANIMATION_END_DELAY } from '../../config';
import useShowTransition from '../../hooks/useShowTransition';
import captureEscKeyListener from '../../util/captureEscKeyListener';

import Portal from './Portal';
import Button from './Button';

import './Notification.scss';
import classNames from 'classnames';
import IconSvg from './IconSvg';

type OwnProps = {
  title?: TextPart[];
  containerId?: string;
  message: TextPart[];
  duration?: number;
  onDismiss: () => void;
  action?: CallbackAction;
  actionText?: string;
  className?: string;
  type?: 'success' | 'error' | 'info';
};

const DEFAULT_DURATION = 6000;
const ANIMATION_DURATION = 150;

const Notification: FC<OwnProps> = ({
  title,
  className,
  message,
  duration = DEFAULT_DURATION,
  containerId,
  onDismiss,
  action,
  actionText,
  type = 'success',
}) => {
  const actions = getActions();

  const [isOpen, setIsOpen] = useState(true);
  const timerRef = useRef<number | undefined>(undefined);
  const { transitionClassNames } = useShowTransition(
    isOpen,
    undefined,
    true,
    undefined,
    undefined,
    ANIMATION_DURATION
  );

  const closeAndDismiss = useCallback(() => {
    setIsOpen(false);
    setTimeout(onDismiss, ANIMATION_DURATION + ANIMATION_END_DELAY);
  }, [onDismiss]);

  const handleClick = useCallback(() => {
    if (action) {
      // @ts-ignore
      actions[action.action](action.payload);
    }
    closeAndDismiss();
  }, [action, actions, closeAndDismiss]);

  useEffect(
    () => (isOpen ? captureEscKeyListener(closeAndDismiss) : undefined),
    [isOpen, closeAndDismiss]
  );

  useEffect(() => {
    timerRef.current = window.setTimeout(closeAndDismiss, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [duration, closeAndDismiss]);

  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    timerRef.current = window.setTimeout(closeAndDismiss, duration);
  }, [duration, closeAndDismiss]);

  return (
    <Portal className='Notification-container' containerId={containerId}>
      <div
        className='Notification-wrap'
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <div
        className={classNames(
          'Notification',
          type,
          transitionClassNames,
          className
        )}
      >
        <IconSvg name={type} w='24' h='24' />
        <div className='content'>
          {title && <div className='notification-title'>{title}</div>}
          {message}
        </div>
        {action && actionText && (
          <Button
            color='translucent-white'
            onClick={handleClick}
            className='Notification-button'
          >
            {actionText}
          </Button>
        )}
      </div>
    </Portal>
  );
};

export default Notification;
