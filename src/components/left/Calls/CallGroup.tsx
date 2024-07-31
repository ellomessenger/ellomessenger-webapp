import React, { FC, useState } from 'react';
import IconSvg from '../../ui/IconSvg';
import girl from '../../../assets/images/girl.jpg';
import { ModalList } from '../../ui/ModalList';
import avatar from '../../../assets/images/Avatar.png';
import DotAnimation from '../../common/DotAnimation';

interface IProps {
  handleCalls: (name: string) => void;
}

const data = [
  { title: 'End for me', svg: <IconSvg name='phone-red' /> },
  { title: 'End for all', svg: <IconSvg name='phone-red-all' /> },
];

export const CallGroup: FC<IProps> = ({ handleCalls }) => {
  const [hover, setHover] = useState<boolean>(false);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [show, setShow] = useState<number>(0);

  return (
    <div className='calls-wrap__call-background calls-wrap__call-background--flex'>
      <div className='calls-wrap__call-inner'>
        <div className='calls-wrap__header-box'>
          <div className='calls-wrap__close position-relative'>
            <IconSvg name='sing' />
          </div>
          <div
            onClick={() => handleCalls('')}
            className='calls-wrap__close position-relative'
          >
            <IconSvg name='close-white' />
          </div>
        </div>
        <div className='calls-wrap__table-box'>
          <div className='calls-wrap__content'>
            {[1, 2, 3, 4, 5, 6].map((el) => (
              <div
                onMouseLeave={() => setShow(0)}
                onMouseMove={() => setShow(el)}
                key={el}
                className='calls-wrap__card'
              >
                <div className='calls-wrap__title'>Darrell Steward</div>
                <img className='calls-wrap__photo' src={girl} alt='' />
                {show === el && (
                  <img
                    className='calls-wrap__photo calls-wrap__photo--round'
                    src={girl}
                    alt=''
                  />
                )}
                {show === el && (
                  <div className='calls-wrap__call-all-btn pointer calls-wrap__phone-close'>
                    <IconSvg name='microphone-close' w='22' h='22' />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className='calls-wrap__footer-box'>
          <div className='calls-wrap__duration'>
            <span>Call duration</span>
            <span>1:00:31</span>
          </div>
          <div className='calls-wrap__call-content-wrap'>
            <div className='calls-wrap__call-content-body calls-wrap__call-content-body--margin'>
              <div className='calls-wrap__call-all-btn pointer'>
                {/* <span className='calls-wrap__call-name'>Speaker</span> */}
                <IconSvg name='microphone' w='22' h='22' />
              </div>
              <div className='calls-wrap__call-all-btn pointer'>
                {/* <span className='calls-wrap__call-name'>Video call</span> */}
                <IconSvg name='video-camera' w='22' h='22' />
              </div>
              <div className='calls-wrap__call-all-btn pointer'>
                {/* <span className='calls-wrap__call-name'>Mute</span> */}
                <IconSvg name='mute-large' w='22' h='22' />
              </div>
              <div className='calls-wrap__call-all-btn pointer'>
                {/* <span className='calls-wrap__call-name'>Mute</span> */}
                <IconSvg name='screen' w='22' h='22' />
              </div>
              <div className='calls-wrap__call-all-btn pointer'>
                {/* <span className='calls-wrap__call-name'>Mute</span> */}
                <IconSvg name='hand' w='22' h='22' />
              </div>
              <div
                onMouseLeave={() => setHover(false)}
                onMouseMove={() => setHover(true)}
                style={{ position: 'relative' }}
              >
                <div className='calls-wrap__call-all-btn pointer'>
                  {/* <span className='calls-wrap__call-name'>End call</span> */}
                  <IconSvg name='large-phone' w='22' h='22' />
                </div>
                {hover && (
                  <ul className='modal-list'>
                    {data.map((item) => (
                      <ModalList title={item.title}>{item.svg}</ModalList>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className='calls-wrap__action'>
            <div
              onClick={() => setSidebar(!sidebar)}
              className={`${sidebar ? 'calls-wrap__action-round' : ''} pointer`}
            >
              <IconSvg name='users' stroke={sidebar ? '#000' : '#fff'} />
            </div>
            {!sidebar ? (
              <div className='pointer'>
                <IconSvg name='points' fill='#fff' />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className={`settings-content calls-wrap__scroll ${
          !sidebar ? 'calls-wrap__sidebar' : ''
        }`}
      >
        <div
          onClick={() => setSidebar(!sidebar)}
          className='calls-wrap__header-sidebar'
        >
          <IconSvg name='arrow-back' className='pointer' />
          <span>Сall members</span>
        </div>
        <ul className='calls-wrap__list-360 settings-conten custom-scroll settings-content-custom'>
          {[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          ].map((el) => (
            <li
              onClick={() => setSidebar(!sidebar)}
              key={el}
              className='calls-wrap__item'
            >
              <div className='calls-wrap__content-item'>
                <img src={avatar} alt='' />
                <div className='calls-wrap__text'>
                  <span>Nolan Lubin</span>
                  <span>Incoming, outgoing</span>
                </div>
              </div>
              <IconSvg name='points' fill='#B1B1B5' />
            </li>
          ))}
        </ul>
        <IconSvg name='user-blue' fill='#B1B1B5' className='user-btn' />
      </div>
    </div>
  );
};
