import React, { FC, memo, useCallback } from 'react';
import { getActions } from '../../global';

import type { SettingsScreens } from '../../types';
import type { FolderEditDispatch } from '../../hooks/reducers/useFoldersReducer';
import type { GlobalState } from '../../global/types';

import useHistoryBack from '../../hooks/useHistoryBack';
import useLeftHeaderButtonRtlForumTransition from './main/hooks/useLeftHeaderButtonRtlForumTransition';
import useShowTransition from '../../hooks/useShowTransition';
import useForumPanelRender from '../../hooks/useForumPanelRender';

import Button from '../ui/Button';
import ChatList from './main/ChatList';
import ForumPanel from './main/ForumPanel';
import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '../ui/MenuItem';

import './ArchivedChats.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../ui/IconSvg';

export type OwnProps = {
  isActive: boolean;
  isForumPanelOpen?: boolean;
  archiveSettings: GlobalState['archiveSettings'];
  onReset: () => void;
  onTopicSearch: NoneToVoidFunction;
  onSettingsScreenSelect: (screen: SettingsScreens) => void;
  foldersDispatch: FolderEditDispatch;
};

const ArchivedChats: FC<OwnProps> = ({
  isActive,
  isForumPanelOpen,
  archiveSettings,
  onReset,
  onTopicSearch,
  onSettingsScreenSelect,
  foldersDispatch,
}) => {
  const { updateArchiveSettings } = getActions();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  const handleDisplayArchiveInChats = useCallback(() => {
    updateArchiveSettings({ isHidden: false });
  }, [updateArchiveSettings]);

  const {
    shouldDisableDropdownMenuTransitionRef,
    handleDropdownMenuTransitionEnd,
  } = useLeftHeaderButtonRtlForumTransition(isForumPanelOpen);

  const {
    shouldRender: shouldRenderTitle,
    transitionClassNames: titleClassNames,
  } = useShowTransition(!isForumPanelOpen);

  const {
    shouldRenderForumPanel,
    handleForumPanelAnimationEnd,
    handleForumPanelAnimationStart,
    isAnimationStarted,
  } = useForumPanelRender(isForumPanelOpen);
  const isForumPanelVisible = isForumPanelOpen && isAnimationStarted;

  return (
    <div className='ArchivedChats'>
      <div className='left-header'>
        {isRtl && <div className='DropdownMenuFiller' />}
        <Button
          round
          size='smaller'
          color='translucent'
          onClick={onReset}
          ariaLabel='Return to chat list'
          className={classNames('mr-2', {
            rtl: isRtl,
            'right-aligned': isForumPanelVisible && isRtl,
            'disable-transition':
              shouldDisableDropdownMenuTransitionRef.current && isRtl,
          })}
          onTransitionEnd={handleDropdownMenuTransitionEnd}
        >
          <i className='icon-svg'>
            <IconSvg name='arrow-left' />
          </i>
        </Button>
        {shouldRenderTitle && (
          <h4 className={titleClassNames}>{t('ChatList.ArchivedChats')}</h4>
        )}
        {archiveSettings.isHidden && (
          <DropdownMenu
            className='archived-chats-more-menu'
            positionX='right'
            onTransitionEnd={
              isRtl ? handleDropdownMenuTransitionEnd : undefined
            }
          >
            <MenuItem
              icon='archive-from-main'
              onClick={handleDisplayArchiveInChats}
            >
              {t('lng_context_archive_to_list')}
            </MenuItem>
          </DropdownMenu>
        )}
      </div>
      <ChatList
        folderType='archived'
        isActive={isActive}
        isForumPanelOpen={isForumPanelVisible}
        onSettingsScreenSelect={onSettingsScreenSelect}
        foldersDispatch={foldersDispatch}
        archiveSettings={archiveSettings}
      />
      {shouldRenderForumPanel && (
        <ForumPanel
          isOpen={isForumPanelOpen}
          onTopicSearch={onTopicSearch}
          onOpenAnimationStart={handleForumPanelAnimationStart}
          onCloseAnimationEnd={handleForumPanelAnimationEnd}
        />
      )}
    </div>
  );
};

export default memo(ArchivedChats);
