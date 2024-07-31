import React, { FC, memo } from 'react';

import type { ApiTopic } from '../../api/types';

import { getTopicColorCssVariable } from '../../util/forumColors';
import { REM } from './helpers/mediaDimensions';
import renderText from './helpers/renderText';

import TopicIcon from './TopicIcon';

import styles from './TopicChip.module.scss';
import blankSrc from '../../assets/blank.png';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  topic?: ApiTopic;
  className?: string;
  onClick?: NoneToVoidFunction;
};

const TOPIC_ICON_SIZE = 1.125 * REM;

const TopicChip: FC<OwnProps> = ({ topic, className, onClick }) => {
  const { t } = useTranslation();
  return (
    <div
      className={classNames(styles.root, className)}
      style={{
        '--topic-button-accent-color': `var(${getTopicColorCssVariable(
          topic?.iconColor
        )})`,
      }}
      onClick={onClick}
    >
      {topic ? (
        <TopicIcon topic={topic} size={TOPIC_ICON_SIZE} />
      ) : (
        <img src={blankSrc} alt='' />
      )}
      {topic?.title ? renderText(topic.title) : t('Loading')}
      {topic?.isClosed && <i className='icon-lock' />}
      <i className='icon-next' />
    </div>
  );
};

export default memo(TopicChip);
