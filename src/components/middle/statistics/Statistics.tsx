import React, {
  FC,
  memo,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { getActions, withGlobal } from '../../../global';

import { callApi } from '../../../api/gramjs';
import {
  ApiMessage,
  ApiChannelStatistics,
  ApiGroupStatistics,
  StatisticsRecentMessage as StatisticsRecentMessageType,
  StatisticsGraph,
} from '../../../api/types';
import { selectChat, selectStatistics } from '../../../global/selectors';

import useForceUpdate from '../../../hooks/useForceUpdate';
import Loading from '../../ui/Loading';
import StatisticsOverview from './StatisticsOverview';
import StatisticsRecentMessage from './StatisticsRecentMessage';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { isChatGroup } from '../../../global/helpers';

import loadImg from '../../../assets/images/no-charts.png';

import './Statistics.scss';
import Button from '../../ui/Button';
import useLastCallback from '../../../hooks/useLastCallback';
import IconSvg from '../../ui/IconSvg';
import { MiddleColumnContent } from '../../../types';
import GraphItem from './GraphItem';
import StatisticsIcons from './StatisticsIcons';

type ILovelyChart = { create: Function };
let lovelyChartPromise: Promise<ILovelyChart>;
let LovelyChart: ILovelyChart;

async function ensureLovelyChart() {
  if (!lovelyChartPromise) {
    lovelyChartPromise = import(
      '../../../lib/lovely-chart/LovelyChart'
    ) as Promise<ILovelyChart>;
    LovelyChart = await lovelyChartPromise;
  }

  return lovelyChartPromise;
}

const CHANNEL_GRAPHS_TITLES = {
  growthGraph: 'ChannelStats.Graph.Growth',
  followersGraph: 'ChannelStats.Graph.Followers',
  muteGraph: 'ChannelStats.Graph.Notifications',
  topHoursGraph: 'ChannelStats.Graph.ViewsByHours',
  viewsBySourceGraph: 'ChannelStats.Graph.ViewsBySource',
  newFollowersBySourceGraph: 'ChannelStats.Graph.NewFollowersBySource',
  languagesGraph: 'ChannelStats.Graph.Language',
  interactionsGraph: 'ChannelStats.Graph.Interactions',
};
const CHANNEL_GRAPHS = Object.keys(
  CHANNEL_GRAPHS_TITLES
) as (keyof ApiChannelStatistics)[];

const GROUP_GRAPHS_TITLES = {
  growthGraph: 'Stats.GroupGrowthTitle',
  membersGraph: 'Stats.GroupMembersTitle',
  languagesGraph: 'Stats.GroupLanguagesTitle',
  messagesGraph: 'Stats.GroupMessagesTitle',
  actionsGraph: 'Stats.GroupActionsTitle',
  topHoursGraph: 'Stats.GroupTopHoursTitle',
};
const GROUP_GRAPHS = Object.keys(
  GROUP_GRAPHS_TITLES
) as (keyof ApiGroupStatistics)[];

export type OwnProps = {
  chatId: string;
};

export type StateProps = {
  statistics: ApiChannelStatistics | ApiGroupStatistics;
  dcId?: number;
  isGroup: boolean;
};

const Statistics: FC<OwnProps & StateProps> = ({
  chatId,
  statistics,
  dcId,
  isGroup,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const loadedCharts = useRef<string[]>([]);
  const {
    loadStatistics,
    loadStatisticsAsyncGraph,
    setMiddleScreen,
    toggleStatistics,
  } = getActions();
  const forceUpdate = useForceUpdate();

  const onBack = useLastCallback(() => {
    toggleStatistics();
    setMiddleScreen({ screen: MiddleColumnContent.Messages });
  });

  useEffect(() => {
    loadStatistics({ chatId, isGroup });
  }, [chatId, loadStatistics, isGroup]);

  const graphs = useMemo(() => {
    return isGroup ? GROUP_GRAPHS : CHANNEL_GRAPHS;
  }, [isGroup]);

  const graphTitles = useMemo(() => {
    return isGroup ? GROUP_GRAPHS_TITLES : CHANNEL_GRAPHS_TITLES;
  }, [isGroup]);

  // Load async graphs
  useEffect(() => {
    if (statistics) {
      graphs.forEach((name) => {
        const graph = statistics[name as keyof typeof statistics];
        const isAsync = typeof graph === 'string';

        if (isAsync) {
          loadStatisticsAsyncGraph({
            name,
            chatId,
            token: graph,
            // Hardcode percentage for languages graph, since API does not return `percentage` flag
            isPercentage: name === 'languagesGraph',
          });
        }
      });
    }
  }, [graphs, chatId, statistics, loadStatisticsAsyncGraph]);

  useEffect(() => {
    (async () => {
      await ensureLovelyChart();

      if (!isReady) {
        setIsReady(true);
        return;
      }

      if (!statistics || !containerRef.current) {
        return;
      }

      graphs.forEach((name, index: number) => {
        const graph = statistics[name as keyof typeof statistics];
        const isAsync = typeof graph === 'string';

        if (isAsync || loadedCharts.current.includes(name)) {
          return;
        }

        if (!graph) {
          loadedCharts.current.push(name);

          return;
        }

        const { zoomToken } = graph;
        LovelyChart.create(
          containerRef.current!.children[index].querySelector(
            '.accordion-collapse'
          ),
          {
            title: t((graphTitles as Record<string, string>)[name]),
            ...(zoomToken
              ? {
                  onZoom: (x: number) =>
                    callApi('fetchStatisticsAsyncGraph', {
                      token: zoomToken,
                      x,
                      dcId,
                    }),
                  zoomOutLabel: t('Graph.ZoomOut'),
                }
              : {}),
            ...(graph as StatisticsGraph),
          }
        );

        loadedCharts.current.push(name);

        containerRef.current!.children[index].classList.remove('hidden');
      });

      forceUpdate();
    })();
  }, [
    graphs,
    graphTitles,
    isReady,
    statistics,
    chatId,
    loadStatisticsAsyncGraph,
    dcId,
    forceUpdate,
  ]);

  if (!isReady || !statistics) {
    return (
      <Loading
        image={loadImg}
        loadText='Loading'
        text={t('Chat.PleaseBePatient')}
      />
    );
  }

  return (
    <div
      className={classNames('Statistics settings-layout', {
        ready: isReady,
      })}
    >
      <div className='MiddleHeader'>
        <div className='setting-info'>
          <Button
            round
            size='smaller'
            color='translucent'
            onClick={onBack}
            ariaLabel={String(t('GoBack'))}
          >
            <i className='icon-svg'>
              <IconSvg name='arrow-left' />
            </i>
          </Button>
          <h4>{t('Chat.Statistics')}</h4>
        </div>
      </div>
      <div className='settings-content custom-scroll'>
        <div className='settings-container'>
          <StatisticsOverview statistics={statistics} isGroup={isGroup} />

          {!loadedCharts.current.length && (
            <Loading
              image={loadImg}
              title={t('Chat.WaitForYourStatistics')}
              text={t('Chat.ChannelStatisticsWillBecomeVisible')}
            />
          )}
          <div ref={containerRef}>
            {graphs.map((graph) => (
              <GraphItem
                key={graph}
                name={graph}
                title={t((graphTitles as Record<string, string>)[graph])}
              />
            ))}
          </div>
          {Boolean(
            (statistics as ApiChannelStatistics).recentTopMessages?.length
          ) && (
            <div className='Statistics__graph'>
              <div className='lovely-chart--header open'>
                <div className='title-icon color-bg-10'>
                  <StatisticsIcons name='recent-messages' />
                </div>
                <div className='lovely-chart--header-title'>
                  {t('ChannelStats.Recent.Header')}
                </div>
              </div>
              {(statistics as ApiChannelStatistics).recentTopMessages.map(
                (message) => (
                  <StatisticsRecentMessage
                    message={
                      message as ApiMessage & StatisticsRecentMessageType
                    }
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const statistics = selectStatistics(global, chatId);
    const chat = selectChat(global, chatId);
    const dcId = chat?.fullInfo?.statisticsDcId;
    const isGroup = Boolean(chat && isChatGroup(chat));

    return {
      statistics,
      dcId,
      isGroup,
    };
  })(Statistics)
);
