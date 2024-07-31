import React, {
  FC,
  PureComponent,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './TinyBarChart.scss';
import classNames from 'classnames';
import Button from '../../../../ui/Button';
import { IGraphicData, IWallet } from '../../../../../global/types';
import { getActions, withGlobal } from '../../../../../global';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import IconSvgSettings from '../../icons/IconSvgSettings';
import IconSvg from '../../../../ui/IconSvg';

const weeks = ['San', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const years = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface StateProps {
  graphic: IGraphicData | undefined;
}

type OwnProps = {
  wallet: IWallet;
};

const TinyBarChart: FC<OwnProps & StateProps> = ({ wallet, graphic }) => {
  const { getTransferGraphic } = getActions();
  const [btnColor, setBtnColor] = useState<'deposit' | 'withdraw'>('deposit');
  const [btnFilter, setBtnFilterr] = useState<'week' | 'year' | 'month'>(
    'week'
  );

  const barData = useCallback(() => {
    switch (btnFilter) {
      case 'month':
        return Array(
          getDaysInMonth(
            graphic?.data ? new Date(graphic.data[0].date) : Date.now()
          )
        )
          .fill(undefined)
          .map((_, num) => ({
            name: num + 1,
            amount:
              graphic?.data?.find(
                (el) => Number(el.date.split('-')[2]) === Number(num + 1)
              )?.amount || 0,
          }));
      case 'year':
        return years.map((m: string) => ({
          name: m,
          amount: graphic?.data?.find((el) => el.period === m)?.amount || 0,
        }));
      default:
        return weeks.map((week: string) => ({
          name: week,
          amount: graphic?.data?.find((el) => el.period === week)?.amount || 0,
        }));
    }
  }, [btnFilter, graphic]);

  useEffect(() => {
    if (wallet) {
      getTransferGraphic({
        wallet_id: wallet?.id!,
        period: btnFilter,
        type: btnColor,
        limit: 0,
        page: 0,
      });
    }
  }, [wallet, btnFilter, btnColor]);

  return (
    <div className='bar-chart'>
      <div className='bar-chart__filter'>
        <div className='bar-chart__title'>{graphic?.period}</div>
        <div className='btn-group tab-nav'>
          <Button
            isText
            onClick={() => setBtnFilterr('week')}
            className={btnFilter === 'week' ? 'active-btn-filter' : ''}
          >
            Week
          </Button>
          <Button
            isText
            onClick={() => setBtnFilterr('month')}
            className={btnFilter === 'month' ? 'active-btn-filter' : ''}
          >
            Month
          </Button>
          <Button
            isText
            onClick={() => setBtnFilterr('year')}
            className={btnFilter === 'year' ? 'active-btn-filter' : ''}
          >
            Year
          </Button>
        </div>
      </div>
      <div className='bar-chart__wrap'>
        <div className='bar-chart__header-wrapper'>
          <div className='bar-chart__header-inner'>
            <div className='bar-chart__total'>Total</div>
            <div className='bar-chart__num amount'>
              <span className='price'>
                <IconSvg name='dollar' w='16' h='16' />
                {getMoneyFormat(graphic?.total || 0, 2, 2)}
              </span>
            </div>
          </div>
          <div className='bar-chart__wrap-btn'>
            <div
              onClick={() => setBtnColor('withdraw')}
              className={classNames('bar-chart__btn1', {
                'active-btn': btnColor === 'withdraw',
              })}
            />
            <div
              onClick={() => setBtnColor('deposit')}
              className={classNames('bar-chart__btn2', {
                'active-btn': btnColor === 'deposit',
              })}
            />
          </div>
        </div>
        <div className='chart-container'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={barData()}
              margin={{
                top: 5,
                right: 16,
                left: 16,
                bottom: 0,
              }}
            >
              <CartesianGrid stroke='#CFCFD2' vertical={false} />
              <defs>
                <linearGradient id='colorRed' y2='100%' spreadMethod='reflect'>
                  <stop offset='0.27' stopColor='#FF758F' />
                  <stop offset='0.75' stopColor='#EF4061' />
                </linearGradient>
                <linearGradient
                  id='colorGreen'
                  y2='100%'
                  spreadMethod='reflect'
                >
                  <stop offset='0.31' stopColor='#44BE2E' />
                  <stop offset='0.76' stopColor='#27AE60' />
                </linearGradient>
              </defs>
              <Bar
                barSize={btnFilter === 'month' ? 15 : 18}
                dataKey='amount'
                fill={
                  btnColor === 'withdraw'
                    ? 'url(#colorRed)'
                    : 'url(#colorGreen)'
                }
                radius={[4, 4, 4, 4]}
              />
              <XAxis
                dataKey='name'
                stroke='#929298'
                height={45}
                tickLine={false}
                tick={{ fill: '#929298', fontSize: 11, dy: 10 }}
              />
              <YAxis
                orientation={'right'}
                width={40}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
                tick={{ fill: '#929298', fontSize: 11 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default memo(
  withGlobal((global): StateProps => {
    const { statistic } = global;
    const graphic = statistic?.transfer ? statistic?.transfer[0] : undefined;

    return {
      graphic,
    };
  })(TinyBarChart)
);
