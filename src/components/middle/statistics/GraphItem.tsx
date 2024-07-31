import React, { FC, useState } from 'react';

import useShowTransition from '../../../hooks/useShowTransition';
import classNames from 'classnames';
import StatisticsIcons from './StatisticsIcons';
import IconSvg from '../../ui/IconSvg';

type OwnProps = {
  title: string;
  name: string;
};

const GraphItem: FC<OwnProps> = ({ title, name }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { transitionClassNames } = useShowTransition(isOpen);
  return (
    <div className='Statistics__graph hidden'>
      <div
        className={classNames('lovely-chart--header', { open: isOpen })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={classNames('title-icon', name)}>
          <StatisticsIcons name={name} />
        </div>

        <div className='lovely-chart--header-title'>{title}</div>
        <div className='lovely-chart--header-caption lovely-chart--position-right'>
          <IconSvg name='arrow-down' w='26' h='26' />
        </div>
      </div>
      <div className={classNames('accordion-collapse', transitionClassNames)} />
    </div>
  );
};

export default GraphItem;
