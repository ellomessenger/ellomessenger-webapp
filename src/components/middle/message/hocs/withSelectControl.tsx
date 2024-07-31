import React, {
  FC,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { getActions, withGlobal } from '../../../../global';

import type { OwnProps as PhotoProps } from '../Photo';
import type { OwnProps as VideoProps } from '../Video';

import {
  selectIsInSelectMode,
  selectIsMessageSelected,
} from '../../../../global/selectors';
import classNames from 'classnames';
import IconSvg from '../../../ui/IconSvg';

type OwnProps = PhotoProps & VideoProps;

type StateProps = {
  isInSelectMode?: boolean;
  isSelected?: boolean;
};

export default function withSelectControl(
  WrappedComponent: FC<PhotoProps> | FC<VideoProps>
) {
  const ComponentWithSelectControl: FC<OwnProps & StateProps> = (props) => {
    const { isInSelectMode, isSelected, message, dimensions } = props;
    const { toggleMessageSelection } = getActions();

    const handleMessageSelect = useCallback(
      (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        toggleMessageSelection({
          messageId: message.id,
          withShift: e?.shiftKey,
        });
      },
      [toggleMessageSelection, message]
    );

    const newProps = useMemo(() => {
      const { dimensions: dims, onClick } = props;
      return {
        ...props,
        isInSelectMode,
        isSelected,
        dimensions: {
          ...dims,
          x: 0,
          y: 0,
        },
        onClick: isInSelectMode ? undefined : onClick,
      };
    }, [props, isInSelectMode, isSelected]);

    return (
      <div
        className={classNames('album-item-select-wrapper', {
          'is-selected': isSelected,
        })}
        style={
          dimensions
            ? { left: `${dimensions.x}px`, top: `${dimensions.y}px` }
            : undefined
        }
        onClick={isInSelectMode ? handleMessageSelect : undefined}
      >
        {isInSelectMode && (
          <div className='message-select-control'>
            {isSelected && (
              <i className='icon-svg'>
                <IconSvg name='check' w='15' h='17' />
              </i>
            )}
          </div>
        )}

        <WrappedComponent {...newProps} />
      </div>
    );
  };

  return memo(
    withGlobal<OwnProps>((global, ownProps) => {
      const { message } = ownProps;
      return {
        isInSelectMode: selectIsInSelectMode(global),
        isSelected: selectIsMessageSelected(global, message.id),
      };
    })(ComponentWithSelectControl)
  );
}
