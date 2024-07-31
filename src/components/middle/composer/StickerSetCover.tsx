import React, { FC, memo, useEffect, useRef } from 'react';
import { getActions, getGlobal } from '../../../global';

import type { ApiStickerSet } from '../../../api/types';
import type { ObserveFn } from '../../../hooks/useIntersectionObserver';

import { STICKER_SIZE_PICKER_HEADER } from '../../../config';
import { selectIsAlwaysHighPriorityEmoji } from '../../../global/selectors';
import { IS_WEBM_SUPPORTED } from '../../../util/windowEnvironment';
import { getFirstLetters } from '../../../util/textFormat';

import { getStickerPreviewHash } from '../../../global/helpers';

import { useIsIntersecting } from '../../../hooks/useIntersectionObserver';
import useMedia from '../../../hooks/useMedia';
import useMediaTransition from '../../../hooks/useMediaTransition';
import useBoundsInSharedCanvas from '../../../hooks/useBoundsInSharedCanvas';

import AnimatedSticker from '../../common/AnimatedSticker';
import OptimizedVideo from '../../ui/OptimizedVideo';

import styles from './StickerSetCover.module.scss';
import classNames from 'classnames';

type OwnProps = {
  stickerSet: ApiStickerSet;
  size?: number;
  noPlay?: boolean;
  observeIntersection: ObserveFn;
  sharedCanvasRef?: React.RefObject<HTMLCanvasElement>;
};

const StickerSetCover: FC<OwnProps> = ({
  stickerSet,
  size = STICKER_SIZE_PICKER_HEADER,
  noPlay,
  observeIntersection,
  sharedCanvasRef,
}) => {
  const { loadStickers } = getActions();

  const containerRef = useRef<HTMLDivElement>(null);

  const { hasThumbnail, isLottie, isVideos: isVideo } = stickerSet;

  const isIntersecting = useIsIntersecting(containerRef, observeIntersection);

  const shouldFallbackToStatic =
    stickerSet.stickers && isVideo && !IS_WEBM_SUPPORTED;
  const staticHash =
    shouldFallbackToStatic && getStickerPreviewHash(stickerSet.stickers![0].id);
  const staticMediaData = useMedia(staticHash, !isIntersecting);

  const mediaHash =
    ((hasThumbnail && !shouldFallbackToStatic) || isLottie) &&
    `stickerSet${stickerSet.id}`;
  const mediaData = useMedia(mediaHash, !isIntersecting);
  const isReady = mediaData || staticMediaData;
  const transitionClassNames = useMediaTransition(isReady);

  const bounds = useBoundsInSharedCanvas(containerRef, sharedCanvasRef);

  useEffect(() => {
    if (isIntersecting && !stickerSet.stickers?.length) {
      loadStickers({
        stickerSetInfo: {
          id: stickerSet.id,
          accessHash: stickerSet.accessHash,
        },
      });
    }
  }, [isIntersecting, loadStickers, stickerSet]);

  return (
    <div ref={containerRef} className='sticker-set-cover'>
      {isReady ? (
        isLottie ? (
          <AnimatedSticker
            className={transitionClassNames}
            tgsUrl={mediaData}
            size={size || bounds.size}
            play={isIntersecting && !noPlay}
            isLowPriority={
              !selectIsAlwaysHighPriorityEmoji(getGlobal(), stickerSet)
            }
            sharedCanvas={sharedCanvasRef?.current || undefined}
            sharedCanvasCoords={bounds.coords}
          />
        ) : isVideo && !shouldFallbackToStatic ? (
          <OptimizedVideo
            className={classNames(styles.video, transitionClassNames)}
            src={mediaData}
            canPlay={isIntersecting && !noPlay}
            loop
            disablePictureInPicture
          />
        ) : (
          <img
            src={mediaData || staticMediaData}
            className={transitionClassNames}
            alt=''
          />
        )
      ) : (
        getFirstLetters(stickerSet.title, 2)
      )}
    </div>
  );
};

export default memo(StickerSetCover);
