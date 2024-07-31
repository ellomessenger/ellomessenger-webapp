import React, { FC } from 'react';
import type { ApiKeyboardButton, ApiMessage } from '../../../api/types';
import { RE_TME_LINK } from '../../../config';
import renderText from '../../common/helpers/renderText';
import Button from '../../ui/Button';
import './InlineButtons.scss';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  message: ApiMessage;
  onClick: ({
    messageId,
    button,
  }: {
    messageId: number;
    button: ApiKeyboardButton;
  }) => void;
};

const InlineButtons: FC<OwnProps> = ({ message, onClick }) => {
  const { t } = useTranslation();

  const renderIcon = (button: ApiKeyboardButton) => {
    const { type } = button;
    switch (type) {
      case 'url': {
        if (!RE_TME_LINK.test(button.url)) {
          return <i className='icon-arrow-right' />;
        }
        break;
      }
      case 'urlAuth':
        return <i className='icon-arrow-right' />;
      case 'buy':
      case 'receipt':
        return <i className='icon-cart' />;
      case 'switchBotInline':
        return <i className='icon-share-filled' />;
      case 'webView':
      case 'simpleWebView':
        return <i className='icon-webapp' />;
    }
    return undefined;
  };

  return (
    <div className='InlineButtons'>
      {message.inlineButtons!.map((row, idx) => (
        <div key={idx} className='row'>
          {row.map((button) => (
            <div key={button.text} className='col'>
              <Button
                size='tiny'
                ripple
                disabled={button.type === 'unsupported'}
                onClick={() => onClick({ messageId: message.id, button })}
              >
                <span className='inline-button-text'>
                  {renderText(button.text)}
                </span>
                {renderIcon(button)}
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default InlineButtons;
