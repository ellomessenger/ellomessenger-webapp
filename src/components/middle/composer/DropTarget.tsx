import React, { FC, memo } from 'react';

import useFlag from '../../../hooks/useFlag';

import './DropTarget.scss';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';

export type OwnProps = {
  isQuick?: boolean;
  isGeneric?: boolean;
  onFileSelect: (e: React.DragEvent<HTMLDivElement>) => void;
};

const DropTarget: FC<OwnProps> = ({ isQuick, isGeneric, onFileSelect }) => {
  const [isHovered, markHovered, unmarkHovered] = useFlag();

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const { relatedTarget: toTarget } = e;

    if (toTarget) {
      e.stopPropagation();
    }

    unmarkHovered();
  };

  const className = classNames('DropTarget', { hovered: isHovered });

  return (
    <div
      className={className}
      onDrop={onFileSelect}
      onDragEnter={markHovered}
      onDragLeave={handleDragLeave}
      data-dropzone
    >
      <div className='target-content'>
        <div className='icon-svg'>
          <IconSvg name={isQuick ? 'document' : 'media'} />
        </div>
        <div className='title'>Drop files here to send them</div>
        {!isGeneric && (
          <div className='description'>
            {isQuick ? 'in a quick way' : 'without compression'}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(DropTarget);
