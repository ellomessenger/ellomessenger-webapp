import React, { FC, memo, useCallback } from 'react';
import IconSvgSettings from '../icons/IconSvgSettings';
import IconSvgPayment from '../../../payment/IconSvgPayment';

import { IAiPurchases } from '../../../../global/types';
import { getActions, withGlobal } from '../../../../global';
import { useTranslation } from 'react-i18next';
import useEffectOnce from '../../../../hooks/useEffectOnce';
import Button from '../../../ui/Button';
import useLastCallback from '../../../../hooks/useLastCallback';
import { MiddleColumnContent } from '../../../../types';
import ChatBot from '../../../left/main/ChatBot';
import Loading from '../../../ui/Loading';
import { historyPushState } from '../../../../util/routing';
import useHistoryBack from '../../../../hooks/useHistoryBack';

import TextBackground from '../../../../assets/payment/gradienta-LeG68PrXA6Y-unsplash.jpg';
import ImgBackground from '../../../../assets/payment/image-bg.jpg';

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
};

type StateProps = {
  aiPurchases?: IAiPurchases;
  botsList?: string[];
};

const AiSpaceMain: FC<StateProps & OwnProps> = ({
  aiPurchases,
  botsList,
  isActive,
  onReset,
}) => {
  const { setAiPurchases, setMiddleScreen, setLeftScreen } = getActions();
  const { text_total = 0, img_total = 0 } = aiPurchases || {};
  const { t } = useTranslation();

  const handlePaymentAi = useLastCallback(() => {
    historyPushState({
      data: {
        middleScreen: MiddleColumnContent.Settings,
      },
    });
    setMiddleScreen({ screen: MiddleColumnContent.PaymentAi });
  });

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  useEffectOnce(() => {
    setAiPurchases();
  });

  return (
    <div className='settings-container ai-space'>
      <div className='heading'>
        <div className='title-icon'>
          <IconSvgSettings name='ai-bot' w='34' h='34' />
        </div>
        <h3>Take prompting to the next level</h3>
        <p className='text-center'>
          AI bots are powered by OpenAI (GPT-4 April 9 version) for chats and
          Leonardo.Ai for images without requiring you to install a single thing
          for entertainment, business, health, and other multiple AI categories
          to get you ahead of the curve.
        </p>
      </div>
      <div className='settings-privacy'>
        <div className='item-middle'>
          <dl>
            <dd>
              <span>
                <div
                  className='Avatar size-small no-photo'
                  style={{ backgroundImage: `url(${TextBackground})` }}
                >
                  <IconSvgPayment name='text' w='20' h='20' />
                </div>{' '}
                {t('AI.Chat_prompts')}
              </span>
              <span>{text_total}</span>
            </dd>
            <dd>
              <span>
                <div
                  className='Avatar size-small no-photo'
                  style={{ backgroundImage: `url(${ImgBackground})` }}
                >
                  <IconSvgPayment name='image' w='20' h='20' />
                </div>{' '}
                {t('AI.Image_prompts')}
              </span>
              <span>{img_total}</span>
            </dd>
          </dl>
          <Button fullWidth size='smaller' onClick={handlePaymentAi}>
            Buy AI pack
          </Button>
        </div>
        <div className='item-middle bots-list'>
          {botsList ? (
            botsList.length &&
            botsList.map((botId) => <ChatBot chatId={botId} />)
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const {
      aiPurchases,
      chats: { listIds },
    } = global;
    const botsList = listIds.bots;
    return {
      aiPurchases,
      botsList,
    };
  })(AiSpaceMain)
);
