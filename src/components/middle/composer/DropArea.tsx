import React, { FC, memo, useCallback, useEffect, useRef } from 'react';

import useShowTransition from '../../../hooks/useShowTransition';
import getFilesFromDataTransferItems from './helpers/getFilesFromDataTransferItems';

import captureEscKeyListener from '../../../util/captureEscKeyListener';
import usePrevious from '../../../hooks/usePrevious';

import Portal from '../../ui/Portal';
import DropTarget from './DropTarget';

import './DropArea.scss';
import classNames from 'classnames';

export type OwnProps = {
  isOpen: boolean;
  withQuick?: boolean;
  onHide: NoneToVoidFunction;
  onFileSelect: (files: File[], suggestCompression?: boolean) => void;
};

export enum DropAreaState {
  None = 'none',
  Document = 'document',
  QuickFile = 'quick_file',
}

const DROP_LEAVE_TIMEOUT_MS = 150;

const DropArea: FC<OwnProps> = ({
  isOpen,
  withQuick,
  onHide,
  onFileSelect,
}) => {
  const hideTimeoutRef = useRef<number>(null);
  const prevWithQuick = usePrevious(withQuick);
  const { shouldRender, transitionClassNames } = useShowTransition(isOpen);

  useEffect(
    () => (isOpen ? captureEscKeyListener(onHide) : undefined),
    [isOpen, onHide]
  );

  const handleFilesDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      const { dataTransfer: dt } = e;
      let files: File[] = [];

      if (dt.files && dt.files.length > 0 && (!dt.items || !dt.items.length)) {
        files = files.concat(Array.from(dt.files));
      } else if (dt.items && dt.items.length > 0) {
        const folderFiles = await getFilesFromDataTransferItems(dt.items);
        if (folderFiles?.length) {
          files = files.concat(folderFiles);
        }
      }

      onHide();
      onFileSelect(files, withQuick ? false : undefined);
    },
    [onFileSelect, onHide, withQuick]
  );

  const handleQuickFilesDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const { dataTransfer: dt } = e;

      if (dt.files && dt.files.length > 0) {
        onHide();
        onFileSelect(Array.from(dt.files), true);
      }
    },
    [onFileSelect, onHide]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.stopPropagation();

      const { target: fromTarget, relatedTarget: toTarget } = e;

      // Esc button pressed during drag event
      if (
        (fromTarget as HTMLDivElement).matches('.DropTarget, .DropArea') &&
        !toTarget
      ) {
        let currentHide = hideTimeoutRef.current;
        currentHide = window.setTimeout(() => {
          onHide();
        }, DROP_LEAVE_TIMEOUT_MS);
      }
    },
    [onHide]
  );

  const handleDragOver = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }
  };

  if (!shouldRender) {
    return null;
  }

  const shouldRenderQuick = withQuick || prevWithQuick;

  const className = classNames('DropArea', transitionClassNames);

  return (
    <Portal containerId='#middle-column-portals'>
      <div
        className={className}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={onHide}
        onClick={onHide}
      >
        <DropTarget
          onFileSelect={handleFilesDrop}
          isGeneric={!shouldRenderQuick}
        />
        {shouldRenderQuick && (
          <DropTarget onFileSelect={handleQuickFilesDrop} isQuick />
        )}
      </div>
    </Portal>
  );
};

export default memo(DropArea);
