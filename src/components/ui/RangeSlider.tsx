import React, { FC, ChangeEvent, useCallback, useMemo, memo } from 'react';

import './RangeSlider.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  value: number;
  disabled?: boolean;
  bold?: boolean;
  className?: string;
  renderValue?: (value: number) => string;
  onChange: (value: number) => void;
};

const RangeSlider: FC<OwnProps> = ({
  options,
  min = 0,
  max = options ? options.length - 1 : 100,
  step = 1,
  label,
  value,
  disabled,
  bold,
  className,
  renderValue,
  onChange,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(Number(event.currentTarget.value));
    },
    [onChange]
  );

  const mainClassName = classNames(className, 'RangeSlider', {
    disabled,
    bold,
  });

  const trackWidth = useMemo(() => {
    if (options) {
      return (value / (options.length - 1)) * 100;
    } else {
      const possibleValuesLength = (max - min) / step;
      return ((value - min) / possibleValuesLength) * 100;
    }
  }, [options, value, max, min, step]);

  return (
    <div className={mainClassName}>
      {label && (
        <div className='slider-top-row' dir={isRtl ? 'rtl' : undefined}>
          <span className='label' dir='auto'>
            {label}
          </span>
          {!options && (
            <span className='value' dir='auto'>
              {renderValue ? renderValue(value) : value}
            </span>
          )}
        </div>
      )}
      <div className='slider-main'>
        {options && (
          <div className='slider-options'>
            {options.map((option, index) => (
              <div
                key={index}
                className={classNames('slider-option no-selection', {
                  active: index === value,
                })}
                onClick={() => onChange(index)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
        <div
          className='slider-fill-track'
          style={{ width: `${trackWidth}%` }}
        />
        <input
          min={min}
          max={max}
          value={value}
          step={step}
          type='range'
          className='RangeSlider__input'
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default memo(RangeSlider);
