import React, { FC, useEffect, useRef } from 'react';
import DetailsCard from './DetailsCard/DetailsCard';
import SlideWallets from './SlideWallets/SlideWallets';
import TransactionHeader from './TransactionHeader/TransactionHeader';
import { SettingsScreens } from '../../../../types';
import { EPeerType, IWallet } from '../../../../global/types';
import useEffectOnce from '../../../../hooks/useEffectOnce';

interface OwnProps {
  onScreenSelect: (screen: SettingsScreens) => void;
  wallet?: IWallet;
  wallets: Array<IWallet>;
  onChangeCard: (wallet: IWallet | undefined) => void;
  onTransactionType: (type: 'deposit' | 'withdrawal') => void;
  setPeerType: (type: EPeerType) => void;
}

const MainContent: FC<OwnProps> = ({
  onScreenSelect,
  wallets,
  onChangeCard,
  onTransactionType,
  setPeerType,
  wallet,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffectOnce(() => {
    scrollRef.current?.scrollIntoView();
  });

  return (
    <section ref={scrollRef} className='wallet__main-content main-content'>
      <SlideWallets wallets={wallets} onChangeCard={onChangeCard} />
      <DetailsCard
        setPeerType={setPeerType}
        onTransactionType={onTransactionType}
        wallet={wallet}
        onScreenSelect={onScreenSelect}
      />
      <TransactionHeader wallet={wallet} onScreenSelect={onScreenSelect} />
    </section>
  );
};

export default MainContent;
