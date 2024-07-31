import React, { FC, ReactNode } from "react";
import IconSvg from "./IconSvg";
import './PopUp.scss';

interface IProps {
  title: string,
  subtitle: string,
  onClose: (status: string) => void;
  children: ReactNode,
}

export const PopUp: FC<IProps> = ({ title, subtitle, children, onClose }) => {
  return (
    <div className="popup-wrap">
      <div className="popup">
        <div className="popup__header">
          <div onClick={() => onClose('')}>
            <IconSvg name='close' />
          </div>
          <span>{`${title}!`}</span>
        </div>
        <div className="popup__main">
          {children}
          <p>{`${title}!`}</p>
          <span>{subtitle}</span>
        </div>
        <button onClick={() => onClose('')} className="popup__btn">Ok</button>
      </div>
    </div>
  )
}