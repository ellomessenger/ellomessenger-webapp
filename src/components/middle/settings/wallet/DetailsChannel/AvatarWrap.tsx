import React, { FC } from "react";
import ava from '../../../../../assets/images/Avatar.png';
import IconSvg from "../../../../ui/IconSvg";

const AvatarWrap: FC = () => {
  return (
    <div className="wallet__info-channel-avatar">
      <img src={ava} alt="avatar" />
      <div className="wallet__info-channel-title-wrap">
        <IconSvg name='dollar-green' w='24' h='24' />
        <div className="wallet__info-channel-avatar-title">
          3D digital sculptings
        </div>
      </div>
    </div>
  )
}

export default AvatarWrap;
