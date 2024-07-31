import React, { FC, memo } from 'react';

import type {
  ApiChannelStatistics,
  ApiGroupStatistics,
  ApiMessageStatistics,
  StatisticsOverviewItem,
} from '../../../api/types';

import { formatInteger, formatIntegerCompact } from '../../../util/textFormat';
import {
  formatDateToString,
  formatFullDate,
  formatMonthAndYear,
} from '../../../util/dateFormat';
import buildClassName from '../../../util/buildClassName';

import './StatisticsOverview.scss';
import { useTranslation } from 'react-i18next';

type OverviewCell = {
  name: string;
  title: string;
  isPercentage?: boolean;
  isPlain?: boolean;
  isApproximate?: boolean;
};

const CHANNEL_OVERVIEW: OverviewCell[][] = [
  [
    { name: 'followers', title: 'Chat.Overview.ChannelSubscribers' },
    {
      name: 'enabledNotifications',
      title: 'Chat.Overview.ChannelEnabledNotifications',
      isPercentage: true,
    },
  ],
  [
    { name: 'viewsPerPost', title: 'Chat.Overview.ChannelViewsPerPost' },
    { name: 'sharesPerPost', title: 'Chat.Overview.ChannelSharesPerPost' },
  ],
];

const GROUP_OVERVIEW: OverviewCell[][] = [
  [
    { name: 'members', title: 'Chat.Overview.GroupMembers' },
    {
      name: 'messages',
      title: 'Chat.Overview.GroupMessagesGroupViewersGroupPosters',
    },
  ],
  [
    { name: 'viewers', title: 'Chat.Overview.GroupViewersGroupPosters' },
    { name: 'posters', title: 'Chat.Overview.GroupPosters' },
  ],
];

const MESSAGE_OVERVIEW: OverviewCell[][] = [
  [
    { name: 'views', title: 'Stats.Message.Views', isPlain: true },
    {
      name: 'forwards',
      title: 'Stats.Message.PrivateShares',
      isPlain: true,
      isApproximate: true,
    },
  ],
  [
    {
      name: 'publicForwards',
      title: 'Stats.Message.PublicShares',
      isPlain: true,
    },
  ],
];

export type OwnProps = {
  isGroup?: boolean;
  isMessage?: boolean;
  statistics: ApiChannelStatistics | ApiGroupStatistics | ApiMessageStatistics;
};

const StatisticsOverview: FC<OwnProps> = ({
  isGroup,
  isMessage,
  statistics,
}) => {
  const { t } = useTranslation();

  const renderOverviewItemValue = ({
    change,
    percentage,
  }: StatisticsOverviewItem) => {
    if (!change) {
      return undefined;
    }

    const isChangeNegative = Number(change) < 0;

    return (
      <span
        className={buildClassName(
          'StatisticsOverview__value',
          isChangeNegative && 'negative'
        )}
      >
        {isChangeNegative
          ? `-${formatIntegerCompact(Math.abs(change))}`
          : `+${formatIntegerCompact(change)}`}
        {percentage && <> ({percentage}%)</>}
      </span>
    );
  };

  const { period } = statistics as ApiGroupStatistics;

  return (
    <div className='StatisticsOverview'>
      <div className='StatisticsOverview__header'>
        <div className='StatisticsOverview__title'>{t('Overview')}</div>

        {period && (
          <div className='StatisticsOverview__caption'>
            {formatDateToString(period.minDate * 1000)} —{' '}
            {formatDateToString(period.maxDate * 1000)}
          </div>
        )}
      </div>

      <table className='StatisticsOverview__table'>
        <tbody>
          {(isMessage
            ? MESSAGE_OVERVIEW
            : isGroup
            ? GROUP_OVERVIEW
            : CHANNEL_OVERVIEW
          ).map((row) => (
            <tr key={row[0].name}>
              {row.map((cell: OverviewCell) => {
                const field = (statistics as any)[cell.name];
                if (cell.isPlain) {
                  return (
                    <td
                      key={cell.title}
                      className='StatisticsOverview__table-cell'
                    >
                      <h3 className='StatisticsOverview__table-value'>
                        {cell.isApproximate
                          ? `≈${formatInteger(field)}`
                          : formatInteger(field)}
                      </h3>
                      <div className='StatisticsOverview__table-heading'>
                        {t(cell.title)}
                      </div>
                    </td>
                  );
                }

                if (cell.isPercentage) {
                  return (
                    <td
                      key={cell.title}
                      className='StatisticsOverview__table-cell'
                    >
                      <h3 className='StatisticsOverview__table-value'>
                        {isNaN(field.percentage) ? 0 : field.percentage}%
                      </h3>
                      <div className='StatisticsOverview__table-heading'>
                        {t(cell.title)}
                      </div>
                    </td>
                  );
                }

                return (
                  <td
                    key={cell.title}
                    className='StatisticsOverview__table-cell'
                  >
                    <h3 className='StatisticsOverview__table-value'>
                      {formatIntegerCompact(field.current)}
                    </h3>{' '}
                    {renderOverviewItemValue(field)}
                    <div className='StatisticsOverview__table-heading'>
                      {t(cell.title)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(StatisticsOverview);
