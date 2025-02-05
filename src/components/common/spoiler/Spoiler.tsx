import React, { FC, memo, useEffect, useRef } from 'react';

import { ApiMessageEntityTypes } from '../../../api/types';

import { createClassNameBuilder } from '../../../util/buildClassName';
import useFlag from '../../../hooks/useFlag';

import './Spoiler.scss';
import useLastCallback from '../../../hooks/useLastCallback';

type OwnProps = {
  children?: React.ReactNode;
  containerId?: string;
};

const revealByContainerId: Map<string, VoidFunction[]> = new Map();

const buildClassName = createClassNameBuilder('Spoiler');

const Spoiler: FC<OwnProps> = ({ children, containerId }) => {
  // eslint-disable-next-line no-null/no-null
  const contentRef = useRef<HTMLDivElement>(null);

  const [isRevealed, revealSpoiler] = useFlag();

  const handleClick = useLastCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!containerId) return;

      e.preventDefault();
      e.stopPropagation();

      revealByContainerId.get(containerId)?.forEach((reveal) => reveal());
    }
  );

  useEffect(() => {
    if (!containerId) {
      return undefined;
    }

    if (revealByContainerId.has(containerId)) {
      revealByContainerId.get(containerId)!.push(revealSpoiler);
    } else {
      revealByContainerId.set(containerId, [revealSpoiler]);
    }

    return () => {
      revealByContainerId.delete(containerId);
    };
  }, [containerId]);

  return (
    <span
      className={buildClassName(
        '&',
        !isRevealed && 'concealed',
        !isRevealed && Boolean(containerId) && 'animated'
      )}
      onClick={containerId && !isRevealed ? handleClick : undefined}
      data-entity-type={ApiMessageEntityTypes.Spoiler}
    >
      <span className={buildClassName('content')} ref={contentRef}>
        {children}
      </span>
    </span>
  );
};

export default memo(Spoiler);
