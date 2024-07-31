import React, { FC, ReactNode } from 'react';
import './ModalList.scss';

interface IProps {
  title: string;
  children: ReactNode;
}

export const ModalList: FC<IProps> = ({ children, title }) => {
  return (
    <li className="modal-list__item pointer">
      {children}
      <span className='modal-list__text'>{title}</span>
    </li>
  );
};
