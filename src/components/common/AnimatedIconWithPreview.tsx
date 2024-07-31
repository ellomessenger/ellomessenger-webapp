import React, { memo, useCallback } from 'react';

import type { OwnProps as AnimatedIconProps } from './AnimatedIcon';

import useFlag from '../../hooks/useFlag';

import AnimatedIcon from './AnimatedIcon';

import styles from './AnimatedIconWithPreview.module.scss';
import classNames from 'classnames';

type OwnProps = Partial<AnimatedIconProps> & {
  previewUrl?: string;
  thumbDataUri?: string;
  noPreviewTransition?: boolean;
};

const loadedPreviewUrls = new Set();

function AnimatedIconWithPreview(props: OwnProps) {
  const { previewUrl, thumbDataUri, className, ...otherProps } = props;

  const [isPreviewLoaded, markPreviewLoaded] = useFlag(
    Boolean(thumbDataUri) || loadedPreviewUrls.has(previewUrl)
  );
  // const transitionClassNames = useMediaTransition(isPreviewLoaded);
  const [isAnimationReady, markAnimationReady] = useFlag(false);

  const handlePreviewLoad = useCallback(() => {
    markPreviewLoaded();
    loadedPreviewUrls.add(previewUrl);
  }, [markPreviewLoaded, previewUrl]);

  const { size } = props;

  return (
    <div
      className={classNames(className, styles.root)}
      style={
        size !== undefined
          ? { width: `${size}px`, height: `${size}px` }
          : undefined
      }
    >
      {thumbDataUri && !isAnimationReady && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img src={thumbDataUri} className={styles.preview} />
      )}
      {previewUrl && !isAnimationReady && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          src={previewUrl}
          className={styles.preview}
          onLoad={handlePreviewLoad}
        />
      )}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <AnimatedIcon {...otherProps} onLoad={markAnimationReady} noTransition />
    </div>
  );
}

export default memo(AnimatedIconWithPreview);
