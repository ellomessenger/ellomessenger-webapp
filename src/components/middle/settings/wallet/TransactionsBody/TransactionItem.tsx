import React, { FC, ReactElement, memo, useEffect, useMemo } from 'react';
import IconSvg from '../../../../ui/IconSvg';
import ListItem from '../../../../ui/ListItem';
import Avatar from '../../../../common/Avatar';
import {
  EPeerType,
  ITransactions,
  WalletType,
} from '../../../../../global/types';
import { ApiChat, ApiUser } from '../../../../../api/types';
import { getActions, withGlobal } from '../../../../../global';
import { selectChat, selectUser } from '../../../../../global/selectors';
import IconSvgSettings from '../../icons/IconSvgSettings';
import { capitalize, getFirstLetters } from '../../../../../util/textFormat';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import { formatDateTimeToString } from '../../../../../util/dateFormat';
import useShowTransition from '../../../../../hooks/useShowTransition';
import useFlag from '../../../../../hooks/useFlag';
import useLastCallback from '../../../../../hooks/useLastCallback';

import IconSvgPayment from '../../../../payment/IconSvgPayment';
import TextBackground from '../../../../../assets/payment/text-bg-transactions.jpg';
import ImgBackground from '../../../../../assets/payment/image-bg-transactions.jpg';

type OwnProps = {
  transaction: ITransactions;
  walletType?: WalletType;
};

type StateProps = {
  chat?: ApiChat;
  user?: ApiUser;
  currentUser?: ApiUser;
};

const TransactionItem: FC<OwnProps & StateProps> = ({
  transaction,
  chat,
  currentUser,
  walletType,
  user,
}) => {
  const { openChatByUsername, fetchUserByUsername } = getActions();
  const { t } = useTranslation();
  const {
    transaction: {
      id,
      type,
      peer_type,
      peer_id,
      amount,
      created_at,
      status,
      payment_method,
      operation_balance,
      fee,
      payment_system_fee,
      referral,
    },
    service_name,
    service_image,
  } = transaction;

  const [isOpen, onOpen, onClose] = useFlag();

  const { transitionClassNames } = useShowTransition(
    isOpen,
    undefined,
    undefined,
    undefined,
    true
  );

  function getTitle() {
    switch (service_name) {
      case 'paypal':
        return (
          <>
            <div className='Avatar size-mini no-photo no-bg'>
              <IconSvg name='pay-pal-large' w='14' h='14' />
            </div>
            <h4>{t('Wallet.paypal')}</h4>
          </>
        );

      default:
        if (
          peer_type === EPeerType.Transfer ||
          peer_type === EPeerType.Payments
        ) {
          return (
            <h4>
              {t(
                `Wallet.${
                  payment_method === 'ello_earn_card'
                    ? 'TransferFromBusinessWallet'
                    : payment_method === 'ello_card'
                    ? 'TransferToMainWallet'
                    : payment_method === 'bank'
                    ? 'BusinessWallet'
                    : 'MainWallet'
                }`
              )}
            </h4>
          );
        } else if (
          [EPeerType.AiImagePack, EPeerType.AiImageSubscription].includes(
            peer_type
          )
        ) {
          return (
            <>
              <div
                className='Avatar size-mini no-photo'
                style={{ backgroundImage: `url(${ImgBackground})` }}
              >
                <IconSvgPayment name='image' w='12' h='12' />
              </div>
              <h4>{t('Wallet.AiPhoto')}</h4>
            </>
          );
        } else if (
          [EPeerType.AiTextPack, EPeerType.AiTextSubscription].includes(
            peer_type
          )
        ) {
          return (
            <>
              <div
                className='Avatar size-mini no-photo'
                style={{ backgroundImage: `url(${TextBackground})` }}
              >
                <IconSvgPayment name='text' w='12' h='12' />
              </div>
              <h4>{t('Wallet.AiText')}</h4>
            </>
          );
        } else if ([EPeerType.AiTextAndImageSubscription].includes(peer_type)) {
          return (
            <>
              <div
                className='Avatar size-mini no-photo'
                style={{ backgroundImage: `url(${TextBackground})` }}
              >
                <IconSvgPayment name='image-text' />
              </div>
              <h4>{t('Wallet.AIImagesAndChat')}</h4>
            </>
          );
        } else if (peer_type === EPeerType.Loyalty) {
          return <h4>{t('Bonus')}</h4>;
        } else if (peer_type === EPeerType.LoyaltyPartner) {
          return <h4>{t('Commission')}</h4>;
        } else {
          return (
            <>
              {chat ? (
                <Avatar peer={chat} size='mini' />
              ) : (
                <div className='Avatar size-mini no-photo'>
                  {service_name.charAt(0).toUpperCase()}
                </div>
              )}
              <h4>{service_name}</h4>
            </>
          );
        }
    }
  }

  function getPeerType() {
    switch (peer_type) {
      case EPeerType.CourseChannel:
        return t('Wallet.OnlineCourseFee');
      case EPeerType.ChannelsSubscription:
        return t(
          `Wallet.${
            type === 'withdraw' ? 'SubscriptionFee' : 'MySubscriptionChannel'
          }`
        );
      case EPeerType.Transfer:
        return t(`Wallet.${amount! < 0 ? 'Withdrawal' : 'Deposit'}`);

      case EPeerType.MediaSale:
        return t(
          type === 'withdraw' ? 'Channel.MediaSale' : 'Wallet.PurchasingMedia'
        );
      case EPeerType.AiSubscription:
      case EPeerType.AiPacks:
      case EPeerType.AiImagePack:
      case EPeerType.AiImageSubscription:
      case EPeerType.AiTextPack:
      case EPeerType.AiTextSubscription:
      case EPeerType.AiTextAndImageSubscription:
        return t('Wallet.AiBot');
      case EPeerType.Loyalty:
      case EPeerType.LoyaltyPartner:
        return t('Loyalty.ReferralProgram');
      default:
        return t(
          `Wallet.${type === 'withdraw' ? 'Withdrawal' : capitalize(type!)}`
        );
    }
  }

  function getAvatar() {
    switch (peer_type) {
      case EPeerType.ChannelsSubscription:
        return (
          <div
            className={classNames('thumbnail', {
              negative: type === 'withdraw',
            })}
          >
            <IconSvgSettings name='channel' />
          </div>
        );
      case EPeerType.CourseChannel:
        return (
          <div
            className={classNames('thumbnail', {
              negative: type === 'withdraw',
            })}
          >
            <IconSvgSettings name='online-course' />
          </div>
        );
      case EPeerType.Payments:
        return (
          <div
            className={classNames('thumbnail', {
              negative: type === 'withdraw',
            })}
          >
            <IconSvg name='dollar' />
          </div>
        );
      case EPeerType.Transfer:
        return (
          <div
            className={classNames('thumbnail', {
              negative: amount! < 0,
            })}
          >
            <IconSvg name='dollar' />
          </div>
        );
      case EPeerType.MediaSale:
        return (
          <div
            className={classNames('thumbnail music', {
              negative: type === 'withdraw',
            })}
          >
            <IconSvg name='media_sale' />
          </div>
        );
      case EPeerType.AiSubscription:
      case EPeerType.AiPacks:
      case EPeerType.AiImagePack:
      case EPeerType.AiImageSubscription:
      case EPeerType.AiTextPack:
      case EPeerType.AiTextSubscription:
      case EPeerType.AiTextAndImageSubscription:
        return (
          <div className={classNames('thumbnail negative', service_name)}>
            <IconSvg name='panda-logo' w='24' h='24' />
          </div>
        );
      case EPeerType.Loyalty:
      case EPeerType.LoyaltyPartner:
        return (
          <div className={classNames('thumbnail')}>
            <IconSvgSettings name='present' w='24' h='24' />
          </div>
        );
      default:
        return (
          <div
            className={classNames('thumbnail', {
              negative: type === 'withdraw',
            })}
          >
            <IconSvgSettings name='dollar' />
          </div>
        );
    }
  }

  const handleClickChat = useLastCallback(() => {
    if (referral) {
      openChatByUsername({ username: referral.username });
    }
  });

  const getBoxes = useMemo(() => {
    let box: Array<{
      title: string | ReactElement;
      subtitle?: string;
      svg?: string;
      avatar?: ReactElement;
    }>;

    box = [
      {
        //title: t(`Wallet.${payment_method}`),
        title: t(`Wallet.Title_${walletType}`),
        svg: 'payment-methods',
      },
    ];

    if (
      [EPeerType.ChannelsSubscription, EPeerType.CourseChannel].includes(
        peer_type
      )
    ) {
      if (type === 'withdraw') {
        // box.push({
        //   title: <Button isLink>{t('Wallet.Receipt')}</Button>,
        //   subtitle: t('Wallet.SeeReceipt'),
        //   svg: 'export',
        // });
      } else {
        box = [
          {
            title: t(`Wallet.${payment_method}`),
            svg: 'payment-methods',
          },
          {
            title: getMoneyFormat(fee, 2, 2),
            subtitle: t('Wallet.ElloCommission'),
            svg: 'percent',
          },
          {
            title: (
              <>
                {chat ? (
                  <Avatar peer={chat} size='mini' />
                ) : (
                  <div className='Avatar size-mini no-photo'>
                    {service_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{service_name}</span>
              </>
            ),
            subtitle: t(
              `Channel.${
                peer_type === EPeerType.CourseChannel ? 'OnlineCourse' : 'Name'
              }`
            ),
            svg: 'radio',
          },
        ];
      }
    }

    if (peer_type === EPeerType.LoyaltyPartner && referral) {
      box.push({
        title: `${referral.first_name} ${referral.last_name}`,
        subtitle: 'Referral user',
        avatar: user ? (
          <Avatar peer={user} size='mini' />
        ) : (
          <div className='Avatar size-mini no-photo'>
            {getFirstLetters(`${referral.first_name} ${referral.last_name}`, 2)}
          </div>
        ),
      });
    }

    if (peer_type === EPeerType.Payments) {
      if (type === 'deposit') {
        box.push({
          title: (
            <>
              <IconSvg name='dollar' w='16' h='16' />
              {getMoneyFormat(payment_system_fee, 2, 2)}
            </>
          ),
          subtitle: `${t(`Wallet.${service_name}`)} ${t('Wallet.Commission', {
            amount: undefined,
          })}`,
          svg: `${payment_method}`,
        });
      }
      // box.push({
      //   title: getMoneyFormat(fee, 2, 2),
      //   subtitle: `${'Ello'} ${t('Wallet.Commission', {
      //     amount: undefined,
      //   })}`.replace(':', ''),
      //   svg: 'percent',
      // });
      if (['paypal'].includes(service_name) && type === 'withdraw') {
        box.push({
          title: (
            <>
              <IconSvg name='dollar' w='16' h='16' />{' '}
              {getMoneyFormat(payment_system_fee, 2, 2)}
            </>
          ),
          subtitle: `PayPal ${t('Wallet.Commission', {
            amount: undefined,
          })}`.replace(':', ''),
          svg: 'paypal',
        });
      }
    }

    if (peer_type === EPeerType.Transfer) {
      box = [
        // {
        //   title: `$${getMoneyFormat(fee, 2, 2)}`,
        //   subtitle: t('Wallet.Commission', { amount: undefined }),
        //   svg: 'percent',
        // },
        ...box,
      ];
    }

    box.push({
      title: `${getMoneyFormat(operation_balance, 2, 2)}`,
      subtitle: t('Wallet.Balance'),
      svg: 'balance',
    });

    return box.map((el, _, arr) => (
      <div
        key={el.svg}
        className={classNames('col', {
          'col-6': arr.length === 4,
        })}
      >
        <div
          role={el.avatar && 'button'}
          key={el.subtitle}
          className='transactions__box'
          onClick={handleClickChat}
        >
          {el.svg && <IconSvgSettings name={el.svg} />}
          {el.avatar!}
          <div className='transactions__row-desc'>
            <div className='subtitle'>{el.subtitle}</div>
            <div className='title'>
              {['balance', 'percent'].includes(el.svg!) && (
                <IconSvg name='dollar' w='16' h='16' />
              )}
              {el.title}
            </div>
          </div>
        </div>
      </div>
    ));
  }, [user]);

  const handleClick = () => {
    isOpen ? onClose() : onOpen();
  };

  useEffect(() => {
    if (referral) {
      fetchUserByUsername({ username: referral.username });
    }
  }, [referral]);

  return (
    <div
      className={classNames('transactions__background', {
        'active-item': isOpen,
      })}
    >
      <ListItem onClick={handleClick}>
        {getAvatar()}
        <div className='info'>
          <div className='info-row'>{getTitle()}</div>
          <div className='subtitle'> {getPeerType()} </div>
        </div>
        <div
          className={classNames('action', { negative: amount && amount < 0 })}
        >
          <IconSvg name='dollar' w='16' h='16' />
          {`${amount! < 0 ? '-' : '+'}${getMoneyFormat(
            Math.abs(
              amount!
              // peer_type === EPeerType.Payments && type === 'withdraw'
              //   ? amount! - fee! - Number(payment_system_fee!)
              //   : amount!
            ),
            2,
            2
          )}`}
        </div>
      </ListItem>
      <div className={classNames('transactions__desc', transitionClassNames)}>
        <div className='transactions__desc-header'>
          <div className='transactions__down-text'>
            {formatDateTimeToString(
              created_at! * 1000,
              'en-US',
              true,
              true,
              'long'
            )}
          </div>
          <div
            className={classNames('transactions__status', {
              pending: ['processing', 'admin_check'].includes(status!),
            })}
          >
            <span className='icon-svg'>
              <IconSvg
                name={
                  ['processing', 'admin_check'].includes(status!)
                    ? 'clock'
                    : 'check'
                }
                w='12'
                h='12'
              />
            </span>
            <span>{t(`Wallet.${status}`)}</span>
          </div>
        </div>

        <div className='transactions__content row'>{getBoxes}</div>
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>(
    (
      global,
      {
        transaction: {
          transaction: { referral, peer_id },
        },
      }
    ): StateProps => {
      const { currentUserId } = global;

      const currentUser = currentUserId
        ? selectUser(global, currentUserId)
        : undefined;

      const chat = peer_id
        ? selectChat(global, String(`-${peer_id}`))
        : undefined;

      const user = referral
        ? selectUser(global, String(referral.id))
        : undefined;

      return {
        chat,
        currentUser,
        user,
      };
    }
  )(TransactionItem)
);
