import React, { FC } from 'react';
import ava from '../../../assets/images/Avatar.png';
import IconSvg from '../../ui/IconSvg';

interface IProps {
  handleCalls: (value: string) => void;
}

const APPENDIX_OWN = {
  __html:
    '<svg xmlns="<svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 17.6754L5.93982 0.112048V0C5.93982 15.689 13.6001 18.6732 15.9466 19.5874C15.9647 19.5944 15.9825 19.6014 16 19.6082C9.65711 20.6576 4.15116 19.4585 0 17.6754Z" fill="#0A49A5"/></svg>',
};
// eslint-disable-next-line max-len
const APPENDIX_NOT_OWN = {
  __html:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 35"><g filter="url(#appendix-not-own)"><path fill="#fff" fill-rule="evenodd" d="m17 30.675-5.94-17.563V13c0 15.689-7.66 18.673-10.007 19.587L1 32.608a28.536 28.536 0 0 0 16-1.933Z" clip-rule="evenodd"/></g><defs><filter id="appendix-not-own" width="18" height="36" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="1"/><feGaussianBlur stdDeviation=".5"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2_53331"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2_53331" result="shape"/></filter></defs></svg>',
};

const APPENDIX =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="none"><path fill="#ffffff" fill-rule="evenodd" d="M0 17.675 5.94.112V0c0 15.689 7.66 18.673 10.007 19.587l.053.021a28.536 28.536 0 0 1-16-1.933Z" clip-rule="evenodd"/></svg>';

const CallsChat: FC<IProps> = ({ handleCalls }) => {
  return (
    <>
      <div className='MiddleHeader'>
        <div className='slide-fade'>
          <div className='Transition__slide--active'>
            <div className='chat-info-wrapper'>
              <div className='ChatInfo'>
                <div className='Avatar size-medium color-bg-4 interactive'>
                  <img
                    src={ava}
                    className='Avatar__media avatar-media'
                    alt=''
                  />
                </div>
                <div className='info'>
                  <div className='title FullNameTitle-module__root'>
                    <h3 dir='auto' className='fullName'>
                      Nolan Geidt
                    </h3>
                  </div>
                  <span className='status'>
                    <span className='user-status' dir='auto'>
                      Online
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='header-tools header-tools-custom'>
          <i className='icon-svg-custom'>
            <IconSvg name='search' w='24' h='24' />
          </i>

          <i onClick={() => handleCalls('group')} className='icon-svg-custom'>
            <IconSvg name='phone' />
          </i>

          <i className='icon-svg-custom'>
            <IconSvg name='filled' />
          </i>
        </div>
      </div>
      <div className='MessageList custom-scroll no-avatars with-default-bg scrolled chat-box'>
        <div className='messages-container'>
          <div className='message-date-group'>
            <div className='Message message-list-item open shown first-in-group last-in-group last-in-list'>
              <div className='message-content-wrapper can-select-text'>
                <div className='message-content text media has-shadow has-solid-background has-appendix'>
                  <div className='content-inner' dir='auto'>
                    <div className='text-content clearfix with-meta' dir='auto'>
                      Welcome to the Beta version of Ello AI bot! In order to
                      grow our community in a sustainable way, we offer a
                      complimentary allowance of ~30 queries for everyone,
                      followed by various paid subscriptions. Our subscriptions
                      provide either unlimited AI generations or a limited
                      number of AI generations at an affordable price. If you
                      require any assistance, please don't hesitate to contact
                      us at <a href='@ello'>@ello</a>. Please be advised that by
                      using our services, you agree to our terms of service as
                      well as our community guidelines. You can read more about
                      these by visiting our documentation -
                      <a href='https://docs.elloapp.org/docs/terms-of-service'>
                        https://docs.elloapp.org/docs/terms-of-service
                      </a>
                      .
                      <span className='MessageMeta'>
                        <span className='message-time'>18:00</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className='svg-appendix'
                    dangerouslySetInnerHTML={APPENDIX_NOT_OWN}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='message-date-group'>
            <div className='sticky-date interactive'>
              <span dir='auto'>May 11</span>
            </div>
            <div
              id='message10722'
              className='Message message-list-item open shown first-in-group last-in-group own'
              data-message-id='10722'
            >
              <div className='bottom-marker' data-message-id='10722'></div>
              <div className='message-select-control'></div>
              <div className='message-content-wrapper can-select-text'>
                <div
                  className='message-content text has-shadow has-solid-background has-appendix'
                  dir='auto'
                >
                  <div className='content-inner' dir='auto'>
                    <div
                      className='text-content clearfix with-meta with-outgoing-icon'
                      dir='auto'
                    >
                      Apple allegedly accidentally showed the iPhone 14 Pro on a
                      Thailand YouTube channel. The video demonstrates how Apple
                      Pay works and briefy...
                      <span
                        className='MessageMeta'
                        dir='ltr'
                        data-ignore-on-paste='true'
                      >
                        <span className='message-time'>06:19</span>
                        <div className='MessageOutgoingStatus'>
                          <div className='Transition reveal'>
                            <div className='Transition__slide--active'>
                              <i className='icon-svg'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='18'
                                  height='19'
                                  fill='none'
                                >
                                  <path
                                    stroke='#0A49A5'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='1.5'
                                    d='m1.5 9.4 4.258 3.85L13.5 5M9 13.25 16.5 5'
                                  ></path>
                                </svg>
                              </i>
                            </div>
                          </div>
                        </div>
                      </span>
                    </div>
                  </div>
                  <div
                    className='svg-appendix svg-appendix-custom'
                    dangerouslySetInnerHTML={APPENDIX_OWN}
                  />
                </div>
              </div>
            </div>
            <div className='Message message-list-item open shown first-in-group last-in-group last-in-list'>
              <div className='message-content-wrapper can-select-text'>
                <div className='message-content text media has-shadow has-solid-background has-appendix'>
                  <div className='content-inner' dir='auto'>
                    <div className='text-content clearfix with-meta' dir='auto'>
                      Select an AI task.
                      <span className='MessageMeta'>
                        <span className='message-time'>18:00</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className='svg-appendix'
                    dangerouslySetInnerHTML={APPENDIX_NOT_OWN}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='chat-footer__round-wrap'>
          <div className='chat-footer__round-info'>
            <div className='chat-footer__round-point'>5</div>
            <IconSvg name='mail' />
          </div>
          <div className='chat-footer__round-info'>
            <div className='chat-footer__round-point'>2</div>
            <IconSvg name='arrow-down' />
          </div>
        </div>
      </div>
      <div className='chat-footer'>
        <div className='chat-footer__content-footer'>
          <div className='chat-footer__input-text-wrap'>
            <button className='chat-footer__input-svg-smile' type='button'>
              <IconSvg name='smile' />
            </button>
            <input
              // onKeyUp={onAddChats}
              // onChange={handleInputChat}
              // value={chat}
              className='chat-footer__input-text'
              type='text'
              placeholder='Message'
            />
            <button className='chat-footer__input-svg-clip' type='button'>
              <IconSvg name='clip' />
            </button>
            <div className='chat-footer__figure'>
              <IconSvg name='chat' />
            </div>
            <div className='chat-footer__round'>
              <IconSvg name='microphone' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallsChat;
