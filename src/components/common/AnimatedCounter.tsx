import React, { FC, useEffect, useMemo, useRef } from 'react';
import { getGlobal } from '../../global';

import { ANIMATION_LEVEL_MAX } from '../../config';
import useFlag from '../../hooks/useFlag';

import styles from './AnimatedCounter.module.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  text: string;
  className?: string;
};

const AnimatedCounter: FC<OwnProps> = ({ text, className }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const prevTextRef = useRef<string>();
  const [isAnimating, markAnimating, unmarkAnimating] = useFlag(false);

  const shouldAnimate =
    getGlobal().settings.byKey.animationLevel === ANIMATION_LEVEL_MAX;

  const textElement = useMemo(() => {
    if (!shouldAnimate) {
      return text;
    }
    if (!isAnimating) {
      return prevTextRef.current || text;
    }

    const prevText = prevTextRef.current;

    const elements = [];
    for (let i = 0; i < text.length; i++) {
      if (prevText && text[i] !== prevText[i]) {
        elements.push(
          <div key={i} className={styles.characterContainer}>
            <div className={styles.character}>{text[i]}</div>
            <div
              className={styles.characterOld}
              onAnimationEnd={unmarkAnimating}
            >
              {prevText[i]}
            </div>
            <div
              className={styles.characterNew}
              onAnimationEnd={unmarkAnimating}
            >
              {text[i]}
            </div>
          </div>
        );
      } else {
        elements.push(<span key={i}>{text[i]}</span>);
      }
    }

    prevTextRef.current = text;

    return elements;
  }, [shouldAnimate, isAnimating, text]);

  useEffect(() => {
    markAnimating();
  }, [text]);

  return (
    <span
      className={classNames(styles.root, className)}
      dir={isRtl ? 'rtl' : undefined}
    >
      {textElement}
    </span>
  );
};

export default AnimatedCounter;
