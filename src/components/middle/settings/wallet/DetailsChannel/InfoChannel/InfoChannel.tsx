import React, { FC } from "react";
import './InfoChannel.scss';

const data = [
  {
    title: 'Number subscribers',
    subtitle: '1 090',
  },
  {
    title: 'Channel category',
    subtitle: 'Masterclass',
  },
  {
    title: 'Earned last month',
    subtitle: '$16 350',
  },
  {
    title: 'Total Earned',
    subtitle: '$81 750',
  },
  {
    title: 'Subscription price',
    subtitle: '$15',
  },
  {
    title: 'Channel created',
    subtitle: 'Apr 1, 2023',
  },
  {
    title: 'Channel country',
    subtitle: 'United Kingdom',
  },
]

const InfoChannel: FC = () => {
  return (
    <div className="wallet__info-channel info-channel">
      <div className="info-channel__wrapper">
        {data.map((info) => (
          <div key={info.title} className="info-channel__box">
            <div className="info-channel__title">{info.title}</div>
            <div className="info-channel__subtitle">{info.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfoChannel;
