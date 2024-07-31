import React, { FC, memo, useCallback } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiChatFolder, ApiSticker } from '../../../api/types';
import {
  LeftColumnContent,
  MiddleColumnContent,
  SettingsScreens,
} from '../../../types';
import type { FolderEditDispatch } from '../../../hooks/reducers/useFoldersReducer';

import {
  selectAnimatedEmoji,
  selectChatFolder,
} from '../../../global/selectors';

import useAppLayout from '../../../hooks/useAppLayout';
import Button from '../../ui/Button';
import styles from './EmptyFolder.module.scss';
import { useTranslation } from 'react-i18next';
import AnimatedIcon from '../../common/AnimatedIcon';
import { LOCAL_TGS_URLS } from '../../common/helpers/animatedAssets';
import renderText from '../../common/helpers/renderText';
import { historyPushState } from '../../../util/routing';
import useLastCallback from '../../../hooks/useLastCallback';

type OwnProps = {
  folderId?: number;
  folderType: 'all' | 'archived' | 'folder';
  foldersDispatch: FolderEditDispatch;
  onSettingsScreenSelect: (screen: SettingsScreens) => void;
};

type StateProps = {
  chatFolder?: ApiChatFolder;
  animatedEmoji?: ApiSticker;
};

const ICON_SIZE = 240;

const EmptyFolder: FC<OwnProps & StateProps> = ({
  chatFolder,
  animatedEmoji,
  foldersDispatch,
  onSettingsScreenSelect,
}) => {
  const { setLeftScreen, setMiddleScreen } = getActions();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const { isMobile } = useAppLayout();

  const handleEditFolder = useCallback(() => {
    foldersDispatch({ type: 'editFolder', payload: chatFolder });
    onSettingsScreenSelect(SettingsScreens.FoldersEditFolderFromChatList);
  }, [chatFolder, foldersDispatch, onSettingsScreenSelect]);

  const handleClickInvite = useCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.Settings });
    setMiddleScreen({ screen: MiddleColumnContent.Settings });
    onSettingsScreenSelect(SettingsScreens.InvitationLink);
  }, []);

  const handleClickExplore = useCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.Feed });
    setMiddleScreen({ screen: MiddleColumnContent.Feed });
    historyPushState({
      data: {
        leftScreen: LeftColumnContent.Feed,
        middleScreen: MiddleColumnContent.Feed,
        hash: `#feed`,
      },
      hash: `#feed`,
    });
  }, []);

  const handleClickAi = useLastCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.Settings });
    setMiddleScreen({ screen: MiddleColumnContent.Settings });
    onSettingsScreenSelect(SettingsScreens.aiSpace);
  });

  const emptyText = t('ChatList.EmptyChat')
    .split(';')
    .map((string) => <span>{string}</span>);

  return (
    <div className={styles.root}>
      <div className={styles.centered}>
        <AnimatedIcon tgsUrl={LOCAL_TGS_URLS.Welcome} size={ICON_SIZE} />

        {/* <div className={styles.title} dir='auto'>
          {t('ChatList.Welcome')}
        </div> */}
        <p className={styles.description} dir='auto'>
          {chatFolder
            ? t('ChatList.EmptyChatListFilterText')
            : t('ChatList.EmptyChat')}
        </p>
      </div>

      <div className={styles.buttonWrap}>
        {/* <div className='row'>
          <div className='col p-1'>
            <Button outline fullWidth size='smaller' onClick={handleClickAi}>
              {t('Settings.AISpace')}
            </Button>
          </div>
          <div className='col p-1'>
            <Button
              outline
              fullWidth
              size='smaller'
              onClick={handleClickInvite}
            >
              {t('Settings.Invite')}
            </Button>
          </div>
        </div> */}

        {/* <div className='col p-1'>
            <Button outline size='smaller' fullWidth onClick={() => true}>
              {t('ElloTipsChannel')}
            </Button>
          </div> */}

        <Button fullWidth onClick={handleClickExplore}>
          {t('ExploreChannels')}
        </Button>
      </div>

      {chatFolder && (
        <Button
          ripple={!isMobile}
          fluid
          pill
          onClick={handleEditFolder}
          size='smaller'
          isRtl={isRtl}
        >
          <i className='icon-settings' />
          <div className={styles.buttonText}>
            {t('ChatList.EmptyChatListEditFilter')}
          </div>
        </Button>
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { folderId, folderType }): StateProps => {
    const chatFolder =
      folderId && folderType === 'folder'
        ? selectChatFolder(global, folderId)
        : undefined;

    return {
      chatFolder,
      animatedEmoji: selectAnimatedEmoji(global, '📂'),
    };
  })(EmptyFolder)
);
