import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { getActions, withGlobal } from '../../../global';
import '../../../global/actions/calls';

import type { ApiPhoneCall, ApiUser } from '../../../api/types';
import type { AnimationLevel } from '../../../types';

import {
  IS_ANDROID,
  IS_IOS,
  IS_REQUEST_FULLSCREEN_SUPPORTED,
} from '../../../util/windowEnvironment';
import { LOCAL_TGS_URLS } from '../../common/helpers/animatedAssets';
import { selectTabState, selectUser } from '../../../global/selectors';
import { selectPhoneCallUser } from '../../../global/selectors/calls';
import renderText from '../../common/helpers/renderText';
import useFlag from '../../../hooks/useFlag';
import { formatMediaDuration } from '../../../util/dateFormat';
import {
  getStreams,
  IS_SCREENSHARE_SUPPORTED,
  switchCameraInputP2p,
  toggleStreamP2p,
} from '../../../lib/secret-sauce';
import useInterval from '../../../hooks/useInterval';
import useForceUpdate from '../../../hooks/useForceUpdate';
import useAppLayout from '../../../hooks/useAppLayout';

import Modal from '../../ui/Modal';
import Avatar from '../../common/Avatar';
import Button from '../../ui/Button';
import PhoneCallButton from './PhoneCallButton';
import AnimatedIcon from '../../common/AnimatedIcon';

import styles from './PhoneCall.module.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import DotAnimation from '../../common/DotAnimation';

type StateProps = {
  user?: ApiUser;
  phoneCall?: ApiPhoneCall;
  isOutgoing: boolean;
  isCallPanelVisible?: boolean;
  animationLevel: AnimationLevel;
};

const PhoneCall: FC<StateProps> = ({
  user,
  isOutgoing,
  phoneCall,
  isCallPanelVisible,
  animationLevel,
}) => {
  const { t } = useTranslation();
  const {
    hangUp,
    requestMasterAndAcceptCall,
    playGroupCallSound,
    toggleGroupCallPanel,
    connectToActivePhoneCall,
  } = getActions();

  const containerRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, openFullscreen, closeFullscreen] = useFlag(true);
  const { isMobile } = useAppLayout();

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      closeFullscreen();
    } else {
      openFullscreen();
    }
  }, [closeFullscreen, isFullscreen, openFullscreen]);

  const handleToggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (isFullscreen) {
      document.exitFullscreen().then(closeFullscreen);
    } else {
      containerRef.current.requestFullscreen().then(openFullscreen);
    }
  }, [closeFullscreen, isFullscreen, openFullscreen]);

  useEffect(() => {
    if (!IS_REQUEST_FULLSCREEN_SUPPORTED) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    container.addEventListener('fullscreenchange', toggleFullscreen);

    return () => {
      container.removeEventListener('fullscreenchange', toggleFullscreen);
    };
  }, [toggleFullscreen]);

  const handleClose = useCallback(() => {
    toggleGroupCallPanel();
    if (isFullscreen) {
      closeFullscreen();
    }
  }, [closeFullscreen, isFullscreen, toggleGroupCallPanel]);

  const isDiscarded = phoneCall?.state === 'discarded';
  const isBusy = phoneCall?.reason === 'busy';

  const isIncomingRequested = phoneCall?.state === 'requested' && !isOutgoing;
  const isOutgoingRequested =
    (phoneCall?.state === 'requested' || phoneCall?.state === 'waiting') &&
    isOutgoing;
  const isActive = phoneCall?.state === 'active';
  const isConnected = phoneCall?.isConnected;

  const [isHangingUp, startHangingUp, stopHangingUp] = useFlag();
  const handleHangUp = useCallback(() => {
    startHangingUp();
    hangUp();
  }, [hangUp, startHangingUp]);

  useEffect(() => {
    if (isHangingUp) {
      playGroupCallSound({ sound: 'end' });
    } else if (isIncomingRequested) {
      playGroupCallSound({ sound: 'incoming' });
    } else if (isBusy) {
      playGroupCallSound({ sound: 'busy' });
    } else if (isDiscarded) {
      playGroupCallSound({ sound: 'end' });
    } else if (isOutgoingRequested) {
      playGroupCallSound({ sound: 'ringing' });
    } else if (isConnected) {
      playGroupCallSound({ sound: 'connect' });
    }
  }, [
    isBusy,
    isDiscarded,
    isIncomingRequested,
    isOutgoingRequested,
    isConnected,
    playGroupCallSound,
    isHangingUp,
  ]);

  useEffect(() => {
    if (phoneCall?.id) {
      stopHangingUp();
    } else {
      connectToActivePhoneCall();
    }
  }, [connectToActivePhoneCall, phoneCall?.id, stopHangingUp]);

  const forceUpdate = useForceUpdate();

  useInterval(
    () => {
      forceUpdate();
    },
    isConnected ? 1000 : undefined
  );

  const callStatus = useMemo(() => {
    const state = phoneCall?.state;
    if (isHangingUp) {
      return t('Call.Status.Hanging');
    }
    if (isBusy) return 'busy';
    if (state === 'requesting') {
      return t('Call.Status.Requesting');
    } else if (state === 'requested') {
      return isOutgoing ? t('Call.Status.Ringing') : t('Call.Status.Incoming');
    } else if (state === 'waiting') {
      return t('Call.Status.Waiting');
    } else if (state === 'active' && isConnected) {
      return undefined;
    } else {
      return t('Call.Status.Exchanging');
    }
  }, [isBusy, isConnected, isHangingUp, isOutgoing, phoneCall?.state]);

  const hasVideo = phoneCall?.videoState === 'active';
  const hasPresentation = phoneCall?.screencastState === 'active';

  const streams = getStreams();
  const hasOwnAudio = streams?.ownAudio?.getTracks()[0].enabled;
  const hasOwnPresentation = streams?.ownPresentation?.getTracks()[0].enabled;
  const hasOwnVideo = streams?.ownVideo?.getTracks()[0].enabled;

  const [
    isHidingPresentation,
    startHidingPresentation,
    stopHidingPresentation,
  ] = useFlag();
  const [isHidingVideo, startHidingVideo, stopHidingVideo] = useFlag();

  const handleTogglePresentation = useCallback(() => {
    if (hasOwnPresentation) {
      startHidingPresentation();
    }
    if (hasOwnVideo) {
      startHidingVideo();
    }
    setTimeout(async () => {
      await toggleStreamP2p('presentation');
      stopHidingPresentation();
      stopHidingVideo();
    }, 250);
  }, [
    hasOwnPresentation,
    hasOwnVideo,
    startHidingPresentation,
    startHidingVideo,
    stopHidingPresentation,
    stopHidingVideo,
  ]);

  const handleToggleVideo = useCallback(() => {
    if (hasOwnVideo) {
      startHidingVideo();
    }
    if (hasOwnPresentation) {
      startHidingPresentation();
    }
    setTimeout(async () => {
      await toggleStreamP2p('video');
      stopHidingPresentation();
      stopHidingVideo();
    }, 250);
  }, [
    hasOwnPresentation,
    hasOwnVideo,
    startHidingPresentation,
    startHidingVideo,
    stopHidingPresentation,
    stopHidingVideo,
  ]);

  const handleToggleAudio = useCallback(() => {
    void toggleStreamP2p('audio');
  }, []);

  const [isEmojiOpen, openEmoji, closeEmoji] = useFlag();

  const [isFlipping, startFlipping, stopFlipping] = useFlag();

  const handleFlipCamera = useCallback(() => {
    startFlipping();
    switchCameraInputP2p();
    setTimeout(stopFlipping, 250);
  }, [startFlipping, stopFlipping]);

  const timeElapsed =
    phoneCall?.startDate && Number(new Date()) / 1000 - phoneCall.startDate;

  useEffect(() => {
    if (phoneCall?.state === 'discarded') {
      setTimeout(hangUp, 250);
    }
  }, [hangUp, phoneCall?.reason, phoneCall?.state]);

  return (
    <Modal
      isOpen={
        phoneCall && phoneCall?.state !== 'discarded' && !isCallPanelVisible
      }
      onClose={handleClose}
      className={classNames(styles.root, isMobile && styles.singleColumn)}
      dialogRef={containerRef}
    >
      {phoneCall?.screencastState === 'active' && streams?.presentation && (
        <video
          className={styles.mainVideo}
          muted
          autoPlay
          playsInline
          srcObject={streams.presentation}
        />
      )}
      {phoneCall?.videoState === 'active' && streams?.video && (
        <video
          className={styles.mainVideo}
          muted
          autoPlay
          playsInline
          srcObject={streams.video}
        />
      )}
      <video
        className={classNames(
          styles.secondVideo,
          !isHidingPresentation && hasOwnPresentation && styles.visible,
          isFullscreen && styles.fullscreen
        )}
        muted
        autoPlay
        playsInline
        srcObject={streams?.ownPresentation}
      />
      <video
        className={classNames(
          styles.secondVideo,
          !isHidingVideo && hasOwnVideo && styles.visible,
          isFullscreen && styles.fullscreen
        )}
        muted
        autoPlay
        playsInline
        srcObject={streams?.ownVideo}
      />
      <div className={styles.header}>
        {/* {IS_REQUEST_FULLSCREEN_SUPPORTED && (
          <Button
            round
            size='smaller'
            color='translucent'
            onClick={handleToggleFullscreen}
            ariaLabel={t(
              isFullscreen ? 'AccExitFullscreen' : 'AccSwitchToFullscreen'
            )}
          >
            <i
              className={isFullscreen ? 'icon-smallscreen' : 'icon-fullscreen'}
            />
          </Button>
        )} */}

        <Button
          round
          size='smaller'
          color='translucent'
          onClick={handleClose}
          className={styles.closeButton}
        >
          <i className='icon-close' />
        </Button>
      </div>
      <div
        className={classNames(
          styles.emojisBackdrop,
          isEmojiOpen && styles.open
        )}
        onClick={!isEmojiOpen ? openEmoji : closeEmoji}
      >
        <div className={classNames(styles.emojis, isEmojiOpen && styles.open)}>
          {phoneCall?.isConnected &&
            phoneCall?.emojis &&
            renderText(phoneCall.emojis, ['emoji'])}
        </div>
        <div
          className={classNames(
            styles.emojiTooltip,
            isEmojiOpen && styles.open
          )}
        >
          {t('CallEmojiKeyTooltip', { name: user?.firstName })}
        </div>
      </div>
      <div className={styles.userInfo}>
        <h1>{user?.firstName}</h1>
        <span className={styles.status}>
          {(callStatus && <DotAnimation content={callStatus} />) ||
            formatMediaDuration(timeElapsed || 0)}
        </span>
        <Avatar
          peer={user}
          size='jumbo'
          className={hasVideo || hasPresentation ? styles.blurred : ''}
          withVideo
          noLoop={phoneCall?.state !== 'requesting'}
        />
      </div>

      <div className={styles.buttons}>
        <PhoneCallButton
          onClick={handleToggleVideo}
          icon={hasOwnVideo ? 'video-camera' : 'video-camera-mute'}
          isDisabled={!isActive}
          isActive={hasOwnVideo}
          label={t('Call.Video.Start')}
        />
        <PhoneCallButton
          onClick={handleToggleAudio}
          icon={hasOwnAudio ? 'microphone' : 'microphone-close'}
          isDisabled={!isActive}
          isActive={hasOwnAudio}
          label={t('Call.Speeker')}
        />

        {/* <PhoneCallButton
          onClick={handleToggleAudio}
          icon='mute-large'
          isDisabled={!isActive}
          isActive={hasOwnAudio}
          label={t(hasOwnAudio ? 'Call.Mute' : 'Call.Unmute')}
        /> */}

        {hasOwnVideo && (IS_ANDROID || IS_IOS) && (
          <PhoneCallButton
            onClick={handleFlipCamera}
            customIcon={
              <AnimatedIcon
                tgsUrl={LOCAL_TGS_URLS.CameraFlip}
                playSegment={!isFlipping ? [0, 1] : [0, 10]}
                size={32}
              />
            }
            isDisabled={!isActive}
            label={t('VoipFlip')}
          />
        )}
        {/* {IS_SCREENSHARE_SUPPORTED && (
          <PhoneCallButton
            onClick={handleTogglePresentation}
            icon='share-screen'
            isDisabled={!isActive}
            isActive={hasOwnPresentation}
            label={t('Call.Screencast')}
          />
        )} */}
        {isIncomingRequested && (
          <PhoneCallButton
            onClick={requestMasterAndAcceptCall}
            icon='large-phone'
            isDisabled={isDiscarded}
            label={t('Call.Accept')}
            className={styles.accept}
            iconClassName={styles.acceptIcon}
          />
        )}
        <PhoneCallButton
          onClick={handleHangUp}
          icon='large-phone'
          isDisabled={isDiscarded}
          label={t(isIncomingRequested ? 'Call.Decline' : 'Call.End')}
          className={styles.leave}
        />
      </div>
    </Modal>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { phoneCall, currentUserId } = global;
    const { isCallPanelVisible, isMasterTab } = selectTabState(global);

    return {
      isCallPanelVisible: Boolean(isCallPanelVisible),
      user: selectPhoneCallUser(global),
      isOutgoing: phoneCall?.adminId === currentUserId,
      phoneCall: isMasterTab ? phoneCall : undefined,
      animationLevel: global.settings.byKey.animationLevel,
    };
  })(PhoneCall)
);
