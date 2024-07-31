import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiSession } from '../../../api/types';

import { formatPastTimeShort } from '../../../util/dateFormat';
import useFlag from '../../../hooks/useFlag';
import useHistoryBack from '../../../hooks/useHistoryBack';
import getSessionIcon from './helpers/getSessionIcon';

import ListItem from '../../ui/ListItem';
import ConfirmDialog from '../../ui/ConfirmDialog';
import RadioGroup from '../../ui/RadioGroup';
import SettingsActiveSession from './SettingsActiveSession';

import './SettingsActiveSessions.scss';
import { useTranslation } from 'react-i18next';
import IconSvgSettings from './icons/IconSvgSettings';

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
};

type StateProps = {
  byHash: Record<string, ApiSession>;
  orderedHashes: string[];
  ttlDays?: number;
};

const SettingsActiveSessions: FC<OwnProps & StateProps> = ({
  isActive,
  onReset,
  byHash,
  orderedHashes,
  ttlDays,
}) => {
  const {
    terminateAuthorization,
    terminateAllAuthorizations,
    changeSessionTtl,
  } = getActions();

  const { t } = useTranslation();
  const [
    isConfirmTerminateAllDialogOpen,
    openConfirmTerminateAllDialog,
    closeConfirmTerminateAllDialog,
  ] = useFlag();
  const [openedSessionHash, setOpenedSessionHash] = useState<
    string | undefined
  >();
  const [isModalOpen, openModal, closeModal] = useFlag();

  const autoTerminateValue = useMemo(() => {
    // eslint-disable-next-line max-len
    // https://github.com/DrKLO/Telegram/blob/96dce2c9aabc33b87db61d830aa087b6b03fe397/TMessagesProj/src/main/java/org/telegram/ui/SessionsActivity.java#L195
    if (ttlDays === undefined) {
      return undefined;
    }

    if (ttlDays <= 7) {
      return '7';
    }

    if (ttlDays <= 30) {
      return '30';
    }

    if (ttlDays <= 93) {
      return '90';
    }

    if (ttlDays <= 183) {
      return '183';
    }

    if (ttlDays > 183) {
      return '365';
    }

    return undefined;
  }, [ttlDays]);

  const AUTO_TERMINATE_OPTIONS = useMemo(() => {
    const options = [
      {
        label: t('Weeks'),
        value: '7',
      },
      {
        label: t('Months'),
        value: '30',
      },
      {
        label: t('Months'),
        value: '90',
      },
      {
        label: t('Months'),
        value: '183',
      },
    ];
    if (ttlDays && ttlDays >= 365) {
      options.push({
        label: t('Years'),
        value: '365',
      });
    }
    return options;
  }, [ttlDays]);

  const handleTerminateSessionClick = useCallback(
    (hash: string) => {
      terminateAuthorization({ hash });
    },
    [terminateAuthorization]
  );

  const handleTerminateAllSessions = useCallback(() => {
    closeConfirmTerminateAllDialog();
    terminateAllAuthorizations();
  }, [closeConfirmTerminateAllDialog, terminateAllAuthorizations]);

  const handleOpenSessionModal = useCallback(
    (hash: string) => {
      setOpenedSessionHash(hash);
      openModal();
    },
    [openModal]
  );

  const handleCloseSessionModal = useCallback(() => {
    setOpenedSessionHash(undefined);
    closeModal();
  }, [closeModal]);

  const currentSession = useMemo(() => {
    const currentSessionHash = orderedHashes.find(
      (hash) => byHash[hash].isCurrent
    );

    return currentSessionHash ? byHash[currentSessionHash] : undefined;
  }, [byHash, orderedHashes]);

  const otherSessionHashes = useMemo(() => {
    return orderedHashes.filter((hash) => !byHash[hash].isCurrent);
  }, [byHash, orderedHashes]);
  const hasOtherSessions = Boolean(otherSessionHashes.length);

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  function renderCurrentSession(session: ApiSession) {
    return (
      <div className='settings-item'>
        <h5>{t('Settings.ThisDevice')}</h5>

        <ListItem
          icon={`device-${getSessionIcon(session)} icon-device`}
          className='device'
          onClick={() => {
            handleOpenSessionModal(session.hash);
          }}
        >
          <div className='multiline-menu-item full-size' dir='auto'>
            <span className='title' dir='auto'>
              {session.deviceModel}
            </span>
            <span className='subtitle black tight'>
              {session.appName} {session.appVersion}, {session.platform}{' '}
              {session.systemVersion}
            </span>
            <span className='subtitle'>
              {/[\d\.]+/.test(session.ip) &&
                `${session.ip} - ${getLocation(session)}`}
            </span>
          </div>
        </ListItem>

        {hasOtherSessions && (
          <ListItem
            className='destructive'
            leftElement={
              <i className='icon-svg'>
                <IconSvgSettings name='stop' />
              </i>
            }
            ripple
            onClick={openConfirmTerminateAllDialog}
          >
            {t('Settings.TerminateAllSessions')}
          </ListItem>
        )}
        <p className='settings-item-description'>{t('Settings.LogsOutAll')}</p>
      </div>
    );
  }

  function renderOtherSessions(sessionHashes: string[]) {
    return (
      <div className='settings-item'>
        <h5>{t('Settings.ActiveSessions')}</h5>
        {sessionHashes.map(renderSession)}
        <p className='settings-item-description'>
          {t('Settings.TheOfficialEllo')}
        </p>
      </div>
    );
  }

  function renderSession(sessionHash: string) {
    const session = byHash[sessionHash];

    return (
      <ListItem
        key={session.hash}
        ripple
        contextActions={[
          {
            title: 'Terminate',
            icon: 'stop',
            destructive: true,
            handler: () => {
              handleTerminateSessionClick(session.hash);
            },
          },
        ]}
        icon={`device-${getSessionIcon(session)} icon-device`}
        onClick={() => {
          handleOpenSessionModal(session.hash);
        }}
      >
        <div className='multiline-menu-item full-size' dir='auto'>
          <span className='title'>{session.deviceModel}</span>
          <span className='subtitle black tight'>
            {session.appName} {session.appVersion}, {session.platform}{' '}
            {session.systemVersion}
          </span>
          <span className='subtitle'>
            {/[\d\.]+/.test(session.ip) &&
              `${session.ip} ${getLocation(session)} • `}
            {formatPastTimeShort(t, session.dateActive * 1000)}
          </span>
        </div>
      </ListItem>
    );
  }

  return (
    <div className='settings-container '>
      <div className='SettingsActiveSessions'>
        {currentSession && renderCurrentSession(currentSession)}

        {hasOtherSessions && renderOtherSessions(otherSessionHashes)}

        {hasOtherSessions && (
          <ConfirmDialog
            title={t('Settings.TerminateSessions')}
            isOpen={isConfirmTerminateAllDialogOpen}
            onClose={closeConfirmTerminateAllDialog}
            text={t('Settings.AreYouSureSessions')}
            confirmLabel={t('Settings.Terminate')}
            confirmHandler={handleTerminateAllSessions}
            confirmIsDestructive
          />
        )}
      </div>

      <SettingsActiveSession
        isOpen={isModalOpen}
        hash={openedSessionHash}
        onClose={handleCloseSessionModal}
      />
    </div>
  );
};

function getLocation(session: ApiSession) {
  return [session.region, session.country]
    .filter((text) => text && !text.includes('UNKNOWN, UNKNOWN'))
    .join(', ');
}

export default memo(
  withGlobal<OwnProps>((global): StateProps => global.activeSessions)(
    SettingsActiveSessions
  )
);
