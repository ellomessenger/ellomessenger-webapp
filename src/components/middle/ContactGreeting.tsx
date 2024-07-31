import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { getActions, withGlobal } from '../../global';

import type {
  ApiBotInlineMediaResult,
  ApiSticker,
  ApiUpdateConnectionStateType,
} from '../../api/types';

import { selectChat, selectCurrentMessageList } from '../../global/selectors';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { getUserIdDividend } from '../../global/helpers';

import StickerButton from '../common/StickerButton';

import './ContactGreeting.scss';
import { useTranslation } from 'react-i18next';
import { MessageList } from '../../global/types';
import useLastCallback from '../../hooks/useLastCallback';
import AnimatedIcon from '../common/AnimatedIcon';
import { LOCAL_TGS_URLS } from '../common/helpers/animatedAssets';
import { STICKER_SIZE_HELLO } from '../../config';

type OwnProps = {
  userId: string;
};

type StateProps = {
  sticker?: ApiSticker;
  lastUnreadMessageId?: number;
  connectionState?: ApiUpdateConnectionStateType;
  currentMessageList?: MessageList;
};

const INTERSECTION_DEBOUNCE_MS = 200;

const ContactGreeting: FC<OwnProps & StateProps> = ({
  sticker,
  connectionState,
  lastUnreadMessageId,
  currentMessageList,
}) => {
  const { loadGreetingStickers, sendMessage, markMessageListRead } =
    getActions();

  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);
  const { observe: observeIntersection } = useIntersectionObserver({
    rootRef: containerRef,
    debounceMs: INTERSECTION_DEBOUNCE_MS,
  });
  useEffect(() => {
    if (sticker || connectionState !== 'connectionStateReady') {
      return;
    }

    loadGreetingStickers();
  }, [connectionState, loadGreetingStickers, sticker]);

  useEffect(() => {
    if (connectionState === 'connectionStateReady' && lastUnreadMessageId) {
      markMessageListRead({ maxId: lastUnreadMessageId });
    }
  }, [connectionState, markMessageListRead, lastUnreadMessageId]);

  const handleStickerSelect = useLastCallback((selectedSticker: ApiSticker) => {
    if (!currentMessageList) {
      return;
    }

    selectedSticker = {
      ...selectedSticker,
      isPreloadedGlobally: true,
    };
    sendMessage({ sticker: selectedSticker, messageList: currentMessageList });
  });

  return (
    <div className='ContactGreeting' ref={containerRef}>
      <div className='wrapper'>
        <AnimatedIcon
          tgsUrl={LOCAL_TGS_URLS.Hello2}
          size={STICKER_SIZE_HELLO}
        />
        <p className='title' dir='auto'>
          {t('EmptyPlaceholder')}
        </p>
        <p className='description' dir='auto'>
          {t('GreetingText')}
        </p>

        {/*<div className='sticker'>
           {sticker && (
            <StickerButton
              sticker={sticker}
              onClick={handleStickerSelect}
              clickArg={sticker}
              observeIntersection={observeIntersection}
              size={160}
              className='large'
              noContextMenu
              isCurrentUserPremium
            />
          )} 
        </div>*/}
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { userId }): StateProps => {
    const { stickers } = global.stickers.greeting;
    const dividend =
      getUserIdDividend(userId) + getUserIdDividend(global.currentUserId!);
    const sticker = stickers?.length
      ? stickers[dividend % stickers.length]
      : undefined;
    const chat = selectChat(global, userId);
    if (!chat) {
      return {};
    }

    return {
      sticker,
      lastUnreadMessageId:
        chat.lastMessage && chat.lastMessage.id !== chat.lastReadInboxMessageId
          ? chat.lastMessage.id
          : undefined,
      connectionState: global.connectionState,
      currentMessageList: selectCurrentMessageList(global),
    };
  })(ContactGreeting)
);
