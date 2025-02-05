import React, { memo, useCallback } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { FC } from 'react';
import type { ApiUser, ApiWebSession } from '../../../api/types';
import type { AnimationLevel } from '../../../types';

import buildClassName from '../../../util/buildClassName';

import useLang from '../../../hooks/useLang';
import useCurrentOrPrev from '../../../hooks/useCurrentOrPrev';

import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Avatar from '../../common/Avatar';
import FullNameTitle from '../../common/FullNameTitle';

import styles from './SettingsActiveWebsite.module.scss';

type OwnProps = {
  isOpen: boolean;
  hash?: string;
  onClose: () => void;
};

type StateProps = {
  session?: ApiWebSession;
  bot?: ApiUser;
  animationLevel: AnimationLevel;
};

const SettingsActiveWebsite: FC<OwnProps & StateProps> = ({
  isOpen,
  session,
  bot,
  animationLevel,
  onClose,
}) => {
  const { terminateWebAuthorization } = getActions();
  const lang = useLang();

  const renderingSession = useCurrentOrPrev(session, true);
  const renderingBot = useCurrentOrPrev(bot, true);

  const handleTerminateSessionClick = useCallback(() => {
    terminateWebAuthorization({ hash: session!.hash });
    onClose();
  }, [onClose, session, terminateWebAuthorization]);

  if (!renderingSession) {
    return undefined;
  }

  function renderHeader() {
    return (
      <div
        className='modal-header-condensed'
        dir={lang.isRtl ? 'rtl' : undefined}
      >
        <Button
          round
          color='translucent'
          size='smaller'
          ariaLabel={lang('Close')}
          onClick={onClose}
        >
          <i className='icon-close' />
        </Button>
        <div className='modal-title'>{lang('WebSessionsTitle')}</div>
        <Button
          color='danger'
          onClick={handleTerminateSessionClick}
          className={buildClassName('modal-action-button', styles.headerButton)}
        >
          {lang('AuthSessions.LogOut')}
        </Button>
      </div>
    );
  }
  return (
    <Modal
      header={renderHeader()}
      isOpen={isOpen}
      hasCloseButton
      onClose={onClose}
      className={styles.root}
    >
      <Avatar
        className={styles.avatar}
        peer={renderingBot}
        size='large'
        withVideo
      />
      {renderingBot && (
        <FullNameTitle className={styles.title} peer={renderingBot} />
      )}
      <div className={styles.note}>{renderingSession?.domain}</div>

      <dl className={styles.box}>
        <dt>{lang('AuthSessions.View.Browser')}</dt>
        <dd>{renderingSession?.browser}</dd>

        <dt>{lang('SessionPreview.Ip')}</dt>
        <dd>{renderingSession?.ip}</dd>

        <dt>{lang('SessionPreview.Location')}</dt>
        <dd>{renderingSession?.region}</dd>
      </dl>
      <p className={styles.note}>{lang('AuthSessions.View.LocationInfo')}</p>
    </Modal>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { hash }) => {
    const session = hash ? global.activeWebSessions.byHash[hash] : undefined;
    const bot = session ? global.users.byId[session.botId] : undefined;
    return {
      session,
      bot,
      animationLevel: global.settings.byKey.animationLevel,
    };
  })(SettingsActiveWebsite)
);
