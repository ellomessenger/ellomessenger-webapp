import React, { memo, useMemo, useRef } from 'react';

import type { ApiFormattedText, ApiMessage } from '../../api/types';
import type { ObserveFn } from '../../hooks/useIntersectionObserver';

import { ApiMessageEntityTypes } from '../../api/types';
import trimText from '../../util/trimText';
import { getMessageText, stripCustomEmoji } from '../../global/helpers';
import { renderTextWithEntities } from './helpers/renderTextWithEntities';
import useSyncEffect from '../../hooks/useSyncEffect';
import useUniqueId from '../../hooks/useUniqueId';

interface OwnProps {
  message: ApiMessage;
  translatedText?: ApiFormattedText;
  isForAnimation?: boolean;
  emojiSize?: number;
  highlight?: string;
  isSimple?: boolean;
  truncateLength?: number;
  isProtected?: boolean;
  forcePlayback?: boolean;
  focusedQuote?: string;
  observeIntersectionForLoading?: ObserveFn;
  observeIntersectionForPlaying?: ObserveFn;
  withTranslucentThumbs?: boolean;
  shouldRenderAsHtml?: boolean;
}

const MIN_CUSTOM_EMOJIS_FOR_SHARED_CANVAS = 3;

function MessageText({
  message,
  translatedText,
  isForAnimation,
  emojiSize,
  highlight,
  isSimple,
  truncateLength,
  isProtected,
  forcePlayback,
  focusedQuote,
  observeIntersectionForLoading,
  observeIntersectionForPlaying,
  withTranslucentThumbs,
  shouldRenderAsHtml,
}: OwnProps) {
  const sharedCanvasRef = useRef<HTMLCanvasElement>(null);

  const sharedCanvasHqRef = useRef<HTMLCanvasElement>(null);

  const textCacheBusterRef = useRef(0);

  const formattedText = translatedText || message.content.text || undefined;

  const adaptedFormattedText =
    isForAnimation && formattedText
      ? stripCustomEmoji(formattedText)
      : formattedText;

  const { text, entities } = adaptedFormattedText || {};

  const containerId = useUniqueId();

  useSyncEffect(() => {
    textCacheBusterRef.current += 1;
  }, [text, entities]);

  const withSharedCanvas =
    useMemo(() => {
      const hasSpoilers = entities?.some(
        (e) => e.type === ApiMessageEntityTypes.Spoiler
      );
      if (hasSpoilers) {
        return false;
      }

      const customEmojisCount =
        entities?.filter((e) => e.type === ApiMessageEntityTypes.CustomEmoji)
          .length || 0;
      return customEmojisCount >= MIN_CUSTOM_EMOJIS_FOR_SHARED_CANVAS;
    }, [entities]) || 0;

  if (!text) {
    const contentNotSupportedText = getMessageText(message);
    return contentNotSupportedText
      ? [trimText(contentNotSupportedText, truncateLength)]
      : (undefined as any);
  }

  return (
    <>
      {[
        withSharedCanvas && (
          <canvas
            key='canvas-1'
            ref={sharedCanvasRef}
            className='shared-canvas'
          />
        ),
        withSharedCanvas && (
          <canvas
            key='canvas-2'
            ref={sharedCanvasHqRef}
            className='shared-canvas'
          />
        ),
        renderTextWithEntities({
          text: trimText(text!, truncateLength),
          entities,
          highlight,
          emojiSize,
          shouldRenderAsHtml,
          containerId,
          isSimple,
          isProtected,
          observeIntersectionForLoading,
          observeIntersectionForPlaying,
          withTranslucentThumbs,
          sharedCanvasRef,
          sharedCanvasHqRef,
          cacheBuster: textCacheBusterRef.current.toString(),
          forcePlayback,
          focusedQuote,
        }),
      ]
        .flat()
        .filter(Boolean)}
    </>
  );
}

export default memo(MessageText);
