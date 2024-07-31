import React, { FC } from "react";
import './ColumnCharts.scss';
import Button from "../Button";
import IconSvg from "../IconSvg";
import { SettingsScreens } from "../../../types";

interface IColumnCharts {
  onlyOneBtn?: boolean;
  onScreenSelect: (screen: SettingsScreens) => void;
}

const ColumnCharts: FC<IColumnCharts> = ({ onlyOneBtn, onScreenSelect }) => {
  const handleButton = () => {
    onScreenSelect(SettingsScreens.DetailedTransactionsHistory)
  };

  return (
     <div className="wallet__charts chart">
      <div className="chart__wrapper">
        <div className="chart__title">Monthly activity</div>
        <div className="chart__subtitle">-$580.62 Last month</div>
        <div className="chart__wrap-column">
          {[...Array(31).keys()]?.map((el) => (
            <div onClick={handleButton} key={el} className="chart__column">
              <div style={{height: 0}} className="chart__column-color"></div>
            </div>
          ))}
        </div>
          <div className="detalis__btn-wrapper">
          <Button
            onClick={handleButton}
            color='border-btn'
            style={{width: '334px', height: '47px'}}>
            <span>Detailed Transactions history</span>
          </Button>
          {/* {!onlyOneBtn ? 
            <Button color='border-btn' style={{width: '334px', height: '47px'}}>
              <i className='icon-svg'>
                <IconSvg name='heart' w='19' h='19' />
              </i>
              <span>Donate statistics</span>
            </Button> : null
          } */}
        </div>
      </div>
    </div>
  )
}

export default ColumnCharts;
