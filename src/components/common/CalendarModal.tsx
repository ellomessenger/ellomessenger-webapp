import React, {
  FC,
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import { MAX_INT_32 } from '../../config';
import {
  formatTime,
  formatDateToString,
  getDayStart,
} from '../../util/dateFormat';
import usePrevious from '../../hooks/usePrevious';
import useFlag from '../../hooks/useFlag';

import Modal from '../ui/Modal';
import Button from '../ui/Button';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { i18n, t } from 'i18next';
import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '../ui/MenuItem';

import './CalendarModal.scss';

const MAX_SAFE_DATE = MAX_INT_32 * 1000;

const MIN_SAFE_DATE = new Date(new Date().getFullYear() - 80, 1).getTime();

export type OwnProps = {
  selectedAt?: number;
  secondSelectedAt?: number;
  minAt?: number;
  maxAt?: number;
  isFutureMode?: boolean;
  isPastMode?: boolean;
  isOpen: boolean;
  withTimePicker?: boolean;
  submitButtonLabel?: string;
  secondButtonLabel?: string;
  onlyTime?: boolean;
  rangeFormat?: boolean;
  onClose: () => void;
  onSubmit: (date: Date) => void;
  onSelectRange?: ([date, secondDate]: [
    Date | undefined,
    Date | undefined
  ]) => void;
  onSecondButtonClick?: NoneToVoidFunction;
};

const WEEKDAY_LETTERS = [
  'lng_weekday1',
  'lng_weekday2',
  'lng_weekday3',
  'lng_weekday4',
  'lng_weekday5',
  'lng_weekday6',
  'lng_weekday7',
];

const CalendarModal: FC<OwnProps> = ({
  selectedAt,
  secondSelectedAt,
  minAt,
  maxAt,
  isFutureMode,
  isPastMode,
  isOpen,
  withTimePicker,
  submitButtonLabel,
  onlyTime,
  rangeFormat,
  secondButtonLabel,
  onClose,
  onSubmit,
  onSecondButtonClick,
  onSelectRange,
}) => {
  const now = new Date();
  const { t, i18n } = useTranslation();
  const minDate = useMemo(() => {
    if (isFutureMode && !minAt) return now;
    return new Date(Math.max(minAt || MIN_SAFE_DATE, MIN_SAFE_DATE));
  }, [isFutureMode, minAt]);

  const maxDate = useMemo(() => {
    if (isPastMode && !maxAt) return now;
    return new Date(Math.min(maxAt || MAX_SAFE_DATE, MAX_SAFE_DATE));
  }, [isPastMode, maxAt]);

  const yearArr = useMemo(() => {
    const arr = [...Array(now.getFullYear() + 1).keys()]
      .slice(now.getFullYear() - 80)
      .reverse();
    const idx = arr.findIndex((el) => el === maxDate.getFullYear());
    return idx !== -1 ? arr.slice(idx) : arr;
  }, [maxDate]);

  const passedSelectedDate = useMemo(
    () => (selectedAt ? new Date(selectedAt) : new Date()),
    [selectedAt]
  );
  const passedSecondSelectedDate = useMemo(
    () => (secondSelectedAt ? new Date(secondSelectedAt) : new Date()),
    [secondSelectedAt]
  );
  const prevIsOpen = usePrevious(isOpen);
  const [isTimeInputFocused, markTimeInputAsFocused, unmarkTimeInputAsFocused] =
    useFlag(false);

  const [selectedDate, setSelectedDate] = useState<Date>(passedSelectedDate);
  const [secondSelectedDate, setSecondSelectedDate] = useState<
    Date | undefined
  >(passedSecondSelectedDate);

  const [currentMonthAndYear, setCurrentMonthAndYear] = useState<Date>(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const [selectedHours, setSelectedHours] = useState<string>(
    formatInputTime(passedSelectedDate.getHours())
  );
  const [selectedMinutes, setSelectedMinutes] = useState<string>(
    formatInputTime(passedSelectedDate.getMinutes())
  );

  const selectedDay = formatDay(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );
  const secondSelectedDay =
    secondSelectedDate &&
    formatDay(
      secondSelectedDate.getFullYear(),
      secondSelectedDate.getMonth(),
      secondSelectedDate.getDate()
    );
  const showDate = formatDemoDay(selectedDate);
  const currentYear = currentMonthAndYear.getFullYear();
  const currentMonth = currentMonthAndYear.getMonth();

  useEffect(() => {
    if (!prevIsOpen && isOpen) {
      setSelectedDate(passedSelectedDate);
      setCurrentMonthAndYear(
        new Date(
          passedSelectedDate.getFullYear(),
          passedSelectedDate.getMonth(),
          1
        )
      );
      if (withTimePicker) {
        setSelectedHours(formatInputTime(passedSelectedDate.getHours()));
        setSelectedMinutes(formatInputTime(passedSelectedDate.getMinutes()));
      }
    }
  }, [passedSelectedDate, isOpen, prevIsOpen, withTimePicker]);

  useEffect(() => {
    if (
      isFutureMode &&
      !isTimeInputFocused &&
      selectedDate.getTime() < minDate.getTime()
    ) {
      setSelectedDate(minDate);
      setSelectedHours(formatInputTime(minDate.getHours()));
      setSelectedMinutes(formatInputTime(minDate.getMinutes()));
    }
  }, [isFutureMode, isTimeInputFocused, minDate, selectedDate]);

  useEffect(() => {
    if (
      isPastMode &&
      !isTimeInputFocused &&
      selectedDate.getTime() > maxDate.getTime()
    ) {
      setSelectedDate(maxDate);
      setSelectedHours(formatInputTime(maxDate.getHours()));
      setSelectedMinutes(formatInputTime(maxDate.getMinutes()));
    }
  }, [isPastMode, isTimeInputFocused, maxDate, selectedDate]);

  useEffect(() => {
    if (selectedAt) {
      const newSelectedDate = new Date(selectedAt);
      setSelectedDate(newSelectedDate);
      setSelectedHours(formatInputTime(newSelectedDate.getHours()));
      setSelectedMinutes(formatInputTime(newSelectedDate.getMinutes()));
    }
    if (secondSelectedAt) {
      const newSelectedDate = new Date(secondSelectedAt);
      setSecondSelectedDate(newSelectedDate);
    }
  }, [selectedAt, secondSelectedAt]);

  const shouldDisableNextMonth =
    (isPastMode &&
      currentYear >= now.getFullYear() &&
      currentMonth >= now.getMonth()) ||
    (maxDate &&
      currentYear >= maxDate.getFullYear() &&
      currentMonth >= maxDate.getMonth());
  const shouldDisablePrevMonth =
    isFutureMode &&
    currentYear <= now.getFullYear() &&
    currentMonth <= now.getMonth();

  const { prevMonthGrid, currentMonthGrid, nextMonthGrid } = useMemo(
    () => buildCalendarGrid(currentYear, currentMonth),
    [currentMonth, currentYear]
  );

  const submitLabel = useMemo(() => {
    return submitButtonLabel || t('Send'); //formatSubmitLabel(i18n, selectedDate);
  }, [i18n, selectedDate, submitButtonLabel]);

  function handlePrevMonth() {
    setCurrentMonthAndYear((d) => {
      const dateCopy = new Date(d);
      dateCopy.setMonth(dateCopy.getMonth() - 1);

      return dateCopy;
    });
  }

  function handleNextMonth() {
    setCurrentMonthAndYear((d) => {
      const dateCopy = new Date(d);
      dateCopy.setMonth(dateCopy.getMonth() + 1);

      return dateCopy;
    });
  }

  function handleSelectYear(year: number) {
    setCurrentMonthAndYear((d) => {
      const dateCopy = new Date(d);
      dateCopy.setFullYear(year);
      return dateCopy;
    });
  }

  function handleDateSelect(date: number) {
    if (!isDisabledDay(currentYear, currentMonth, date, minDate, maxDate)) {
      const dateCopy = new Date();
      dateCopy.setDate(date);
      dateCopy.setMonth(currentMonth);
      dateCopy.setFullYear(currentYear);
      if (rangeFormat) {
        if (selectedDate && secondSelectedDate) {
          setSecondSelectedDate(undefined);
          setSelectedDate(dateCopy);
        } else if (dateCopy.getTime() > selectedDate.getTime()) {
          setSecondSelectedDate(dateCopy);
        }
      } else {
        setSelectedDate(dateCopy);
      }
    }
  }

  const handleSubmit = useCallback(() => {
    rangeFormat && onSelectRange
      ? onSelectRange([selectedDate, secondSelectedDate])
      : onSubmit(selectedDate);
  }, [onSubmit, selectedDate, secondSelectedDate]);

  const handleClear = useCallback(() => {
    if (onSelectRange) {
      onSelectRange([undefined, undefined]);
      setSecondSelectedDate(now);
      setSelectedDate(now);
    }
    onClose();
  }, [onSelectRange]);

  const handleChangeHours = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^\d]+/g, '');
      if (!value.length) {
        setSelectedHours('');
        e.target.value = '';
        return;
      }

      const hours = Math.max(0, Math.min(Number(value), 23));

      const date = new Date(selectedDate.getTime());
      date.setHours(hours);
      setSelectedDate(date);

      const hoursStr = formatInputTime(hours);
      setSelectedHours(hoursStr);
      e.target.value = hoursStr;
    },
    [selectedDate]
  );

  const handleChangeMinutes = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^\d]+/g, '');
      if (!value.length) {
        setSelectedMinutes('');
        e.target.value = '';
        return;
      }

      const minutes = Math.max(0, Math.min(Number(value), 59));

      const date = new Date(selectedDate.getTime());
      date.setMinutes(minutes);
      setSelectedDate(date);

      const minutesStr = formatInputTime(minutes);
      setSelectedMinutes(minutesStr);
      e.target.value = minutesStr;
    },
    [selectedDate]
  );

  function renderTimePicker() {
    return (
      <div className='timepicker'>
        <input
          type='text'
          className='form-control'
          inputMode='decimal'
          value={selectedHours}
          onChange={handleChangeHours}
          onFocus={markTimeInputAsFocused}
          onBlur={unmarkTimeInputAsFocused}
        />
        :
        <input
          type='text'
          className='form-control'
          inputMode='decimal'
          value={selectedMinutes}
          onChange={handleChangeMinutes}
          onFocus={markTimeInputAsFocused}
          onBlur={unmarkTimeInputAsFocused}
        />
      </div>
    );
  }

  const triggerComponent: FC<{ onTrigger: () => void; isOpen?: boolean }> =
    useMemo(() => {
      return ({ onTrigger, isOpen: isMenuOpen }) => (
        <Button
          isText
          className={classNames('no-style', { active: isMenuOpen })}
          onClick={onTrigger}
          ariaLabel='Select Year'
        >
          {currentYear} <i className='css-icon-down'></i>
        </Button>
      );
    }, [currentYear]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='CalendarModal'
      onEnter={handleSubmit}
      centered
    >
      <div className='modal-content'>
        {!onlyTime && (
          <>
            <div className='container'>
              <div className='header-calendar'>
                <div className='year-selection'>
                  <DropdownMenu trigger={triggerComponent}>
                    {yearArr.map((year) => (
                      <MenuItem
                        key={year}
                        className='compact'
                        onClick={() => handleSelectYear(year)}
                      >
                        {year}
                      </MenuItem>
                    ))}
                  </DropdownMenu>
                </div>
                <h3>{showDate}</h3>
              </div>
              <div className='month-selector'>
                <Button
                  round
                  size='smaller'
                  color='translucent'
                  disabled={shouldDisablePrevMonth}
                  onClick={
                    !shouldDisablePrevMonth ? handlePrevMonth : undefined
                  }
                >
                  <i className='icon-previous' />
                </Button>
                <h4>
                  {t(`Calendar.lng_month${currentMonth + 1}`)} {currentYear}
                </h4>
                <Button
                  round
                  size='smaller'
                  color='translucent'
                  disabled={shouldDisableNextMonth}
                  onClick={
                    !shouldDisableNextMonth ? handleNextMonth : undefined
                  }
                >
                  <i className='icon-next' />
                </Button>
              </div>
            </div>

            <div className='calendar-wrapper'>
              <div className='calendar-grid'>
                {WEEKDAY_LETTERS.map((day) => (
                  <div key={day} className='day-button faded weekday'>
                    <span>{t(`Calendar.${day}`).slice(0, 1)}</span>
                  </div>
                ))}
                {prevMonthGrid.map((gridDate) => (
                  <div key={gridDate} className='day-button disabled'>
                    <span>{gridDate}</span>
                  </div>
                ))}
                {currentMonthGrid.map((gridDate) => (
                  <div
                    key={gridDate}
                    role='button'
                    tabIndex={0}
                    onClick={() => handleDateSelect(gridDate)}
                    className={classNames(
                      'day-button',
                      isDisabledDay(
                        currentYear,
                        currentMonth,
                        gridDate,
                        minDate,
                        maxDate
                      )
                        ? 'disabled'
                        : `${gridDate ? 'clickable' : ''}`,
                      {
                        selected:
                          selectedDay ===
                            formatDay(currentYear, currentMonth, gridDate) ||
                          (rangeFormat &&
                            secondSelectedDay ===
                              formatDay(currentYear, currentMonth, gridDate)),
                      },
                      {
                        range:
                          rangeFormat &&
                          selectedDate &&
                          secondSelectedDate &&
                          formatTimestamp(currentYear, currentMonth, gridDate) >
                            Number(selectedDate) &&
                          formatTimestamp(currentYear, currentMonth, gridDate) <
                            Number(secondSelectedDate),
                      }
                    )}
                  >
                    {Boolean(gridDate) && <span>{gridDate}</span>}
                  </div>
                ))}
                {nextMonthGrid.map((gridDate) => (
                  <div key={gridDate} className='day-button disabled'>
                    <span>{gridDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {(withTimePicker || onlyTime) && renderTimePicker()}

        <div className='footer'>
          {rangeFormat && (
            <Button onClick={handleClear} isLink>
              {t('Clear').toUpperCase()}
            </Button>
          )}
          <Button onClick={onClose} isLink>
            {t('Cancel').toUpperCase()}
          </Button>
          <Button isLink onClick={handleSubmit}>
            {submitLabel.toUpperCase()}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

function buildCalendarGrid(year: number, month: number) {
  const prevMonthGrid: number[] = [];
  const currentMonthGrid: number[] = [];
  const nextMonthGrid: number[] = [];

  const date = new Date();
  date.setDate(1);
  date.setMonth(month);
  date.setFullYear(year);
  const firstDay = date.getDay() || 7;

  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  for (let i = 1; i < firstDay; i++) {
    prevMonthGrid.push(totalDaysInPrevMonth - firstDay + i + 1);
  }

  while (date.getMonth() === month) {
    const gridDate = date.getDate();
    currentMonthGrid.push(gridDate);
    date.setDate(gridDate + 1);
  }

  const lastRowDaysCount = (currentMonthGrid.length + prevMonthGrid.length) % 7;
  if (lastRowDaysCount > 0) {
    for (let i = 1; i <= 7 - lastRowDaysCount; i++) {
      nextMonthGrid.push(i);
    }
  }

  return { prevMonthGrid, currentMonthGrid, nextMonthGrid };
}

function isDisabledDay(
  year: number,
  month: number,
  day: number,
  minDate?: Date,
  maxDate?: Date
) {
  const selectedDay = new Date(year, month, day);

  const fixedMinDate = minDate && getDayStart(minDate);
  const fixedMaxDate = maxDate && getDayStart(maxDate);
  if (fixedMaxDate && selectedDay > fixedMaxDate) {
    return true;
  } else if (fixedMinDate && selectedDay < fixedMinDate) {
    return true;
  }
  return false;
}

function formatInputTime(value: string | number) {
  return String(value).padStart(2, '0');
}

function formatDay(year: number, month: number, day: number) {
  return `${year}-${month + 1}-${day}`;
}

function formatTimestamp(year: number, month: number, day: number) {
  return new Date(year, month, day).getTime();
}

function formatDemoDay(selectedDay: Date) {
  const shortMonth = t(`Calendar.lng_month${selectedDay.getMonth() + 1}`).slice(
    0,
    3
  );
  const weekDay = t(`Calendar.lng_weekday${selectedDay.getDay()}`).slice(0, 3);
  return `${weekDay}, ${shortMonth} ${selectedDay.getDate()}`;
}

function formatSubmitLabel(i18n: i18n, date: Date) {
  const day = formatDateToString(date);
  const today = formatDateToString(new Date());

  if (day === today) {
    return 'ScheduleMessage.SendToday';
  }

  return 'ScheduleMessage.SendOn';
}

export default memo(CalendarModal);
