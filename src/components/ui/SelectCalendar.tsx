import React, { useCallback, useState } from 'react';
import CalendarModal from '../common/CalendarModal';
import useFlag from '../../hooks/useFlag';
import { useTranslation } from 'react-i18next';

const SelectCalendar = () => {
  const { t } = useTranslation();
  const DEFAULT_EXPIRE_DATE = {
    hour: 3600000,
    day: 86400000,
    week: 604800000,
  };
  const DEFAULT_CUSTOM_EXPIRE_DATE = DEFAULT_EXPIRE_DATE.hour;
  const [isCalendarOpened, openCalendar, closeCalendar] = useFlag();
  const [customExpireDate, setCustomExpireDate] = useState<number>(
    Date.now() + DEFAULT_CUSTOM_EXPIRE_DATE
  );
  const handleExpireDateChange = useCallback(
    (date: Date) => {
      setCustomExpireDate(date.getTime());
      closeCalendar();
    },
    [closeCalendar]
  );

  return (
    <div>
      <CalendarModal
        isOpen={isCalendarOpened}
        onClose={closeCalendar}
        onSubmit={handleExpireDateChange}
        selectedAt={customExpireDate}
        submitButtonLabel={String(t('Ok'))}
      />
    </div>
  );
};

export default SelectCalendar;
