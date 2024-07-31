import React, { FC, memo, useCallback } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiSession } from '../../../api/types';

import { formatDateTimeToString } from '../../../util/dateFormat';
import useCurrentOrPrev from '../../../hooks/useCurrentOrPrev';
import getSessionIcon from './helpers/getSessionIcon';
import buildClassName from '../../../util/buildClassName';

import Modal from '../../ui/Modal';
import Button from '../../ui/Button';

import styles from './SettingsActiveSession.module.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import IconSvgSettings from './icons/IconSvgSettings';
import classNames from 'classnames';

type OwnProps = {
  isOpen: boolean;
  hash?: string;
  onClose: () => void;
};

type StateProps = {
  session?: ApiSession;
};

const SettingsActiveSession: FC<OwnProps & StateProps> = ({
  isOpen,
  session,

  onClose,
}) => {
  const { changeSessionSettings, terminateAuthorization } = getActions();
  const { t } = useTranslation();

  const renderingSession = useCurrentOrPrev(session, true);

  const handleSecretChatsStateChange = useCallback(() => {
    changeSessionSettings({
      hash: session!.hash,
      areSecretChatsEnabled: !session!.areSecretChatsEnabled,
    });
  }, [changeSessionSettings, session]);

  const handleCallsStateChange = useCallback(() => {
    changeSessionSettings({
      hash: session!.hash,
      areCallsEnabled: !session!.areCallsEnabled,
    });
  }, [changeSessionSettings, session]);

  const handleTerminateSessionClick = useCallback(() => {
    terminateAuthorization({ hash: session!.hash });
    onClose();
  }, [onClose, session, terminateAuthorization]);

  if (!renderingSession) {
    return undefined;
  }

  return (
    <Modal
      title={t('Settings.Device')}
      isOpen={isOpen}
      hasCloseButton
      onClose={onClose}
      className={styles.SettingsActiveSession}
    >
      <div className='modal-content'>
        <div
          className={buildClassName(
            styles.iconDevice,
            renderingSession &&
              styles[`iconDevice__${getSessionIcon(renderingSession)}`]
          )}
        />
        <h3 className={styles.title} dir='auto'>
          {renderingSession?.deviceModel}
        </h3>
        <div className={styles.date} aria-label={t('PrivacySettings.LastSeen')}>
          {formatDateTimeToString(renderingSession.dateActive * 1000)}
        </div>

        <div className={styles.box}>
          <div className={styles.item}>
            <IconSvgSettings name='device' />
            <div className={styles.multilineItem}>
              <div className={styles.item_title}>
                {renderingSession?.appName} {renderingSession?.appVersion},{' '}
                {renderingSession?.platform} {renderingSession?.systemVersion}
              </div>
              <div className={styles.item_subtitle}>{t('Settings.App')}</div>
            </div>
          </div>
          {renderingSession && getLocation(renderingSession) && (
            <div className={styles.item}>
              <IconSvg name='location' />
              <div className={styles.multilineItem}>
                <div className={styles.item_title}>
                  {getLocation(renderingSession)}
                </div>
                <div className={styles.item_subtitle}>
                  {t('Settings.Location')}
                </div>
              </div>
            </div>
          )}

          {/[\d\.]+/.test(renderingSession?.ip) && (
            <div className={styles.item}>
              <IconSvg name='global' />
              <div className={styles.multilineItem}>
                <div className={styles.item_title}>{renderingSession?.ip}</div>
                <div className={styles.item_subtitle}>{t('Settings.Ip')}</div>
              </div>
            </div>
          )}
        </div>
        {session?.hash !== '0' && (
          <Button
            className={classNames('active', styles.footerButton)}
            color='danger'
            fullWidth
            size='smaller'
            onClick={handleTerminateSessionClick}
          >
            {t('Settings.TerminateSession')}
          </Button>
        )}
      </div>
    </Modal>
  );
};

function getLocation(session: ApiSession) {
  return [session.region, session.country]
    .filter((text) => text && !text.includes('UNKNOWN'))
    .join(', ');
}

export default memo(
  withGlobal<OwnProps>((global, { hash }) => {
    return {
      session: hash ? global.activeSessions.byHash[hash] : undefined,
    };
  })(SettingsActiveSession)
);
