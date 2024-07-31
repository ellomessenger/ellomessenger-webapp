import React, { FC, useCallback } from 'react';
import Modal from '../../ui/Modal';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';
import Avatar from '../../common/Avatar';
import IconSvg from '../../ui/IconSvg';
import { MediaSaleScreens } from './CreateMediaSale';

export type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectScreen: (screen: MediaSaleScreens) => void;
};

const PreviewMediaSaleModal: FC<OwnProps> = ({
  isOpen,
  onClose,
  onSelectScreen,
}) => {
  const { t } = useTranslation();

  const handleSchedule = useCallback(() => {
    onSelectScreen(MediaSaleScreens.Schedule);
    onClose();
  }, [onSelectScreen]);

  function renderGroupHeader() {
    return (
      <>
        <div className='Avatar size-medium color-bg-7 interactive'>
          <img
            src='blob:http://localhost:1234/de361446-a5fe-4e4d-9bc0-864d51123652'
            className='Avatar__media avatar-media'
            alt='NFT / P2E'
            decoding='async'
          />
        </div>
        <div className='info'>
          <div className='title'>
            <IconSvg name='online-course-outline' />
            <h3 dir='auto' className='fullName'>
              3D digital sculptings
            </h3>
          </div>
          <span className='status'>
            <span className='group-status'>2 members</span>
          </span>
        </div>
      </>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      isSlim
      onClose={onClose}
      hasCloseButton
      header={renderGroupHeader()}
    >
      <div className='message-preview-wrap'>
        <div className='Message'>
          <div className='message-content text has-action-button media has-reactions has-shadow has-solid-background has-appendix'>
            <div className='message-title'>Nolan Lubin</div>
            <div className='content-inner'>
              <div className='media-inner'>
                <div
                  className='Album '
                  style={{ width: '364px', height: '249px' }}
                >
                  <div
                    className='album-item-select-wrapper'
                    style={{ left: '0px', top: '0px' }}
                  >
                    <div
                      id='album-media-message80016'
                      className='media-inner interactive'
                      style={{
                        height: '143px',
                        width: '191px',
                        left: '0px',
                        top: '0px',
                      }}
                    >
                      <img
                        className='full-media'
                        alt=''
                        draggable='true'
                        src='blob:http://localhost:1234/6d7f7cba-818e-4f9a-b44e-512fb10db3f9'
                      />
                      <canvas
                        className='thumbnail slow opacity-transition'
                        width='40'
                        height='30'
                      ></canvas>
                    </div>
                  </div>
                  <div
                    className='album-item-select-wrapper'
                    style={{ left: '193px', top: '0px' }}
                  >
                    <div
                      id='album-media-message80017'
                      className='media-inner interactive'
                      style={{
                        height: '143px',
                        width: '191px',
                        left: '0px',
                        top: '0px',
                      }}
                    >
                      <img
                        className='full-media'
                        alt=''
                        draggable='true'
                        src='blob:http://localhost:1234/546bcd24-1fc7-4ef8-bf02-4490adfda1d0'
                      />
                      <canvas
                        className='thumbnail slow opacity-transition'
                        width='40'
                        height='30'
                      ></canvas>
                    </div>
                  </div>
                  <div
                    className='album-item-select-wrapper'
                    style={{ left: '0px', top: '145px' }}
                  >
                    <div
                      id='album-media-message80018'
                      className='media-inner interactive'
                      style={{
                        height: '104px',
                        width: '138px',
                        left: '0px',
                        top: '0px',
                      }}
                    >
                      <img
                        className='full-media'
                        alt=''
                        draggable='true'
                        src='blob:http://localhost:1234/feb2d61f-1a68-400f-8e05-8a3d67e8b5ab'
                      />
                      <canvas
                        className='thumbnail slow opacity-transition'
                        width='40'
                        height='30'
                      ></canvas>
                    </div>
                  </div>
                  <div
                    className='album-item-select-wrapper'
                    style={{ left: '140px', top: '145px' }}
                  >
                    <div
                      id='album-media-message80019'
                      className='media-inner interactive square-image'
                      style={{
                        height: '104px',
                        width: '104px',
                        left: '0px',
                        top: '0px',
                      }}
                    >
                      <img
                        className='full-media'
                        alt=''
                        draggable='true'
                        src='blob:http://localhost:1234/f604a917-c878-462d-810f-668ddfbe5881'
                      />
                      <canvas
                        className='thumbnail slow opacity-transition'
                        width='30'
                        height='40'
                      ></canvas>
                    </div>
                  </div>
                  <div
                    className='album-item-select-wrapper'
                    style={{ left: '246px', top: '145px' }}
                  >
                    <div
                      id='album-media-message80020'
                      className='media-inner interactive'
                      style={{
                        height: '104px',
                        width: '138px',
                        left: '0px',
                        top: '0px',
                      }}
                    >
                      <img
                        className='full-media'
                        alt=''
                        draggable='true'
                        src='blob:http://localhost:1234/4163e41c-2b72-4fbd-a396-66d2e7bc2825'
                      />
                      <canvas
                        className='thumbnail slow opacity-transition'
                        width='40'
                        height='30'
                      ></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <div className='text-content clearfix with-meta'>
                <h4>Quality 3D Models Pack</h4>
                <p>
                  The 3D model for sale is a highly detailed and realistic
                  depiction of a modern luxury sports car. It features sleek
                  curves, intricate detailing, and a high level of accuracy in
                  its design. The model is fully textured and includes various
                  file formats to ensure compatibility with a range of software
                  applications.
                </p>
              </div>
            </div>
            <div className='sale-wrap'>
              <div className='sale-description'>
                <span className='text-secondary'>Buy media • </span>
                Limited edition 1 of 40
              </div>
              <div className='policy-link'>
                Please view our content purchase policy.
              </div>
              <Button color='blue' size='smaller' fullWidth>
                350,00 $
              </Button>
            </div>
            <div className='svg-appendix'>
              <IconSvg name='left-appendix' />
            </div>
          </div>
        </div>
      </div>

      <div className='modal-content'>
        <div className='dialog-buttons-column'>
          <Button fullWidth>{t('Channel.CreateMediaSale')}</Button>
          <Button color='blue' fullWidth onClick={handleSchedule}>
            {t('Chat.SchedulePost')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PreviewMediaSaleModal;
