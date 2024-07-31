import React, { FC } from "react";
import IconSvg from "../../../../../ui/IconSvg";
import './Statistics.scss';

const Statistics: FC = () => {
  return (
    <>
      <div className="transactions__title">Statistics</div>
      <div className="transactions__statistics statistics">
        <div className="statistics__box">
          <i className='icon-svg'>
            <IconSvg name='coin' w='32' h='32' />
          </i>
          <p className="statistics__title">Paid channels</p>
        </div>

        <div className="statistics__box">
          <i className='icon-svg'>
            <IconSvg name='course' w='32' h='32' />
          </i>
          <p className="statistics__title">Paid channels</p>
        </div>

        <div className="statistics__box">
          <i className='icon-svg'>
            <IconSvg name='sale' w='32' h='32' />
          </i>
          <p className="statistics__title">Paid channels</p>
        </div>
      </div> 
    </>
  )
}

export default Statistics;
