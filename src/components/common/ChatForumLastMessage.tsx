import React, {
  FC,
  memo,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getActions } from '../../global';

import type { ObserveFn } from '../../hooks/useIntersectionObserver';
import type { ApiChat } from '../../api/types';

import { IS_TOUCH_ENV } from '../../util/windowEnvironment';
import { getOrderedTopics } from '../../global/helpers';
import { getIsMobile } from '../../hooks/useAppLayout';
import { REM } from './helpers/mediaDimensions';
import renderText from './helpers/renderText';

import TopicIcon from './TopicIcon';

import styles from './ChatForumLastMessage.module.scss';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  chat: ApiChat;
  renderLastMessage: () => React.ReactNode;
  observeIntersection?: ObserveFn;
};

const NO_CORNER_THRESHOLD = Number(REM);
const MAX_TOPICS = 3;

const ChatForumLastMessage: FC<OwnProps> = ({
  chat,
  renderLastMessage,
  observeIntersection,
}) => {
  const { openChat } = getActions();

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const mainColumnRef = useRef<HTMLDivElement>(null);

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const lastMessage = renderLastMessage();

  const [lastActiveTopic, ...otherTopics] = useMemo(() => {
    if (!chat.topics) {
      return [];
    }

    return getOrderedTopics(Object.values(chat.topics), undefined, true).slice(
      0,
      MAX_TOPICS
    );
  }, [chat.topics]);

  const [isReversedCorner, setIsReversedCorner] = useState(false);
  const [overwrittenWidth, setOverwrittenWidth] = useState<number | undefined>(
    undefined
  );

  function handleOpenTopic(e: React.MouseEvent<HTMLDivElement>) {
    if (lastActiveTopic.unreadCount === 0) return;
    e.stopPropagation();
    e.preventDefault();
    openChat({
      id: chat.id,
      threadId: lastActiveTopic.id,
      shouldReplaceHistory: true,
      noForumTopicPanel: getIsMobile(),
    });
  }

  useLayoutEffect(() => {
    const lastMessageElement = lastMessageRef.current;
    const mainColumnElement = mainColumnRef.current;
    if (!lastMessageElement || !mainColumnElement) return;

    const lastMessageWidth = lastMessageElement.offsetWidth;
    const mainColumnWidth = mainColumnElement.offsetWidth;

    if (Math.abs(lastMessageWidth - mainColumnWidth) < NO_CORNER_THRESHOLD) {
      setOverwrittenWidth(Math.max(lastMessageWidth, mainColumnWidth));
    } else {
      setOverwrittenWidth(undefined);
    }
    setIsReversedCorner(lastMessageWidth > mainColumnWidth);
  }, [lastActiveTopic, lastMessage]);

  return (
    <div
      className={classNames(
        styles.root,
        isReversedCorner && styles.reverseCorner,
        overwrittenWidth && styles.overwrittenWidth
      )}
      dir={isRtl ? 'rtl' : undefined}
      style={
        overwrittenWidth
          ? { '--overwritten-width': `${overwrittenWidth}px` }
          : undefined
      }
    >
      {lastActiveTopic && (
        <div className={styles.titleRow}>
          <div
            className={classNames(
              styles.mainColumn,
              lastActiveTopic.unreadCount && styles.unread
            )}
            ref={mainColumnRef}
            onMouseDown={IS_TOUCH_ENV ? undefined : handleOpenTopic}
            onClick={IS_TOUCH_ENV ? handleOpenTopic : undefined}
          >
            <TopicIcon
              topic={lastActiveTopic}
              observeIntersection={observeIntersection}
            />
            <div className={styles.title}>
              {renderText(lastActiveTopic.title)}
            </div>
            {!overwrittenWidth && isReversedCorner && (
              <div className={styles.afterWrapper}>
                <div className={styles.after} />
              </div>
            )}
          </div>

          <div className={styles.otherColumns}>
            {otherTopics.map((topic) => (
              <div
                className={classNames(
                  styles.otherColumn,
                  topic.unreadCount && styles.unread
                )}
                key={topic.id}
              >
                <TopicIcon
                  topic={topic}
                  observeIntersection={observeIntersection}
                />
                <span className={styles.otherColumnTitle}>
                  {renderText(topic.title)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.ellipsis} />
        </div>
      )}
      {!lastActiveTopic && (
        <div className={classNames(styles.titleRow, styles.loading)}>
          {t('Loading')}
        </div>
      )}
      <div
        className={classNames(
          styles.lastMessage,
          lastActiveTopic?.unreadCount && styles.unread
        )}
        ref={lastMessageRef}
        onMouseDown={IS_TOUCH_ENV ? undefined : handleOpenTopic}
        onClick={IS_TOUCH_ENV ? handleOpenTopic : undefined}
      >
        {lastMessage}
        {!overwrittenWidth && !isReversedCorner && (
          <div className={styles.afterWrapper}>
            <div className={styles.after} />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ChatForumLastMessage);
