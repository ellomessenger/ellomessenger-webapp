import React, { FC, memo, useCallback, useMemo } from 'react';
import { getActions, getGlobal } from '../../../global';

import type { GlobalState } from '../../../global/types';

import { ARCHIVED_FOLDER_ID } from '../../../config';
import { compact } from '../../../util/iteratees';
import { formatIntegerCompact } from '../../../util/textFormat';
import renderText from '../../common/helpers/renderText';
import { getChatTitle } from '../../../global/helpers';

import {
  useFolderManagerForOrderedIds,
  useFolderManagerForUnreadCounters,
} from '../../../hooks/useFolderManager';

import ListItem from '../../ui/ListItem';
import AnimatedCounter from '../../common/AnimatedCounter';

import styles from './Archive.module.scss';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';

type OwnProps = {
  archiveSettings: GlobalState['archiveSettings'];
  onDragEnter?: NoneToVoidFunction;
  onClick?: NoneToVoidFunction;
};

const PREVIEW_SLICE = 5;

const Archive: FC<OwnProps> = ({ archiveSettings, onDragEnter, onClick }) => {
  const { updateArchiveSettings } = getActions();
  const { t } = useTranslation();

  const orderedChatIds = useFolderManagerForOrderedIds(ARCHIVED_FOLDER_ID);
  const unreadCounters = useFolderManagerForUnreadCounters();
  const archiveUnreadCount = unreadCounters[ARCHIVED_FOLDER_ID]?.chatsCount;

  const previewItems = useMemo(() => {
    if (!orderedChatIds?.length) return t('Loading');

    const chatsById = getGlobal().chats.byId;

    return orderedChatIds.slice(0, PREVIEW_SLICE).map((chatId, i, arr) => {
      const isLast = i === arr.length - 1;
      const chat = chatsById[chatId];
      if (!chat) {
        return undefined;
      }

      const title = getChatTitle(t, chat);

      return (
        <React.Fragment key={i}>
          <span
            className={classNames(
              styles.chat,
              archiveUnreadCount && chat.unreadCount && styles.unread
            )}
          >
            {renderText(title)}
          </span>
          {isLast ? '' : ', '}
        </React.Fragment>
      );
    });
  }, [orderedChatIds, archiveUnreadCount]);

  const contextActions = useMemo(() => {
    const actionMinimize = !archiveSettings.isMinimized && {
      title: t('lng_context_archive_collapse'),
      icon: 'collapse',
      handler: () => {
        updateArchiveSettings({ isMinimized: true });
      },
    };

    const actionExpand = archiveSettings.isMinimized && {
      title: t('lng_context_archive_expand'),
      icon: 'expand',
      handler: () => {
        updateArchiveSettings({ isMinimized: false });
      },
    };

    const actionHide = {
      title: t('lng_context_archive_to_menu'),
      icon: 'archive-to-main',
      handler: () => {
        updateArchiveSettings({ isHidden: true });
      },
    };

    return compact([actionMinimize, actionExpand, actionHide]);
  }, [archiveSettings.isMinimized, updateArchiveSettings]);

  const handleDragEnter = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      onDragEnter?.();
    },
    [onDragEnter]
  );

  function renderCollapsed() {
    return (
      <div className={classNames(styles.info, 'info')}>
        <div className='info-row'>
          <div className={classNames('title', styles.title)}>
            <h3 dir='auto' className={classNames(styles.name, 'fullName')}>
              <i className={classNames(styles.icon, 'icon-archive-filled')} />
              {t('ArchivedChats')}
            </h3>
          </div>
          {Boolean(archiveUnreadCount) && (
            <div className={styles.unreadCount}>
              <AnimatedCounter
                text={formatIntegerCompact(archiveUnreadCount)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderRegular() {
    return (
      <>
        <div className={classNames('status', styles.avatarWrapper)}>
          <div className={classNames('Avatar', styles.avatar)}>
            <i className='icon-svg'>
              <IconSvg name='archive' w='31' h='31' />
            </i>
          </div>
        </div>
        <div className={classNames(styles.info, 'info')}>
          <div className='info-row'>
            <div className={classNames('title', styles.title)}>
              <h4 dir='auto' className={classNames(styles.name, 'fullName')}>
                {t('ChatList.ArchivedChats')}
              </h4>
            </div>
          </div>
          <div className='subtitle'>
            <div className={classNames('status', styles.chatsPreview)}>
              {previewItems}
            </div>
            {Boolean(archiveUnreadCount) && (
              <div className='Badge'>
                <AnimatedCounter
                  text={formatIntegerCompact(archiveUnreadCount)}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <ListItem
      key='archived'
      onClick={onClick}
      onDragEnter={handleDragEnter}
      className={classNames(
        styles.root,
        archiveSettings.isMinimized && styles.minimized,
        'chat-item-clickable',
        'chat-item-archive'
      )}
      buttonClassName={styles.button}
      contextActions={contextActions}
      withPortalForMenu
    >
      {archiveSettings.isMinimized ? renderCollapsed() : renderRegular()}
    </ListItem>
  );
};

export default memo(Archive);
