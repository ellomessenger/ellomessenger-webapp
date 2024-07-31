import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../../../ui/IconSvg';
import Radio from '../../../../ui/Radio';
import Button from '../../../../ui/Button';
import { SettingsScreens } from '../../../../../types';
import { getActions, withGlobal } from '../../../../../global';
import { GlobalState } from '../../../../../global/types';
import { pick } from '../../../../../util/iteratees';
import Loading from '../../../../ui/Loading';
import useLastCallback from '../../../../../hooks/useLastCallback';

type OwnProps = {
  onScreenSelect: (screen: SettingsScreens) => void;
  hide: boolean;
};

type StateProps = Pick<GlobalState, 'bankWithdrawsRequisites'>;

const BankTransferList: FC<OwnProps & StateProps> = ({
  bankWithdrawsRequisites,
  onScreenSelect,
  hide,
}) => {
  const { getBankWithdrawsRequisites, apiUpdate, getBankWithdrawRequisites } =
    getActions();
  const { t } = useTranslation();
  const [requisitesId, setRequisitesId] = useState(0);
  const { templates } = bankWithdrawsRequisites || {};
  const checkBank = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const numId = Number(e.target.value);
    setRequisitesId(numId);
    apiUpdate({
      '@type': 'updateWithdrawTemplate',
      template: { bank_withdraw_requisites_id: numId },
    });
    getBankWithdrawRequisites({ requisite_id: numId });
  }, []);

  const handleEditBank = useLastCallback((numId: number) => {
    apiUpdate({
      '@type': 'updateWithdrawTemplate',
      template: { bank_withdraw_requisites_id: numId },
    });

    getBankWithdrawRequisites({ requisite_id: numId });

    onScreenSelect(SettingsScreens.BankRequisits);
  });

  const handleNewMethod = useLastCallback(() => {
    apiUpdate({
      '@type': 'updateWithdrawTemplate',
      template: { bank_withdraw_requisites_id: 0 },
    });
    onScreenSelect(SettingsScreens.BankRequisits);
  });

  useEffect(() => {
    getBankWithdrawsRequisites({ is_template: true });
  }, []);

  return (
    <div className='settings-container bank-transfer'>
      <div className='requisits-wrap'>
        <h3 className='header mb-3'>
          <span>{t('Wallet.BankTransfer')}</span>
        </h3>
        <div className='requisits-list'>
          {templates ? (
            templates?.length ? (
              templates.map((el) => (
                <div key={el.requisites_id} className='item'>
                  <div className='left-content'>
                    <Radio
                      name='name'
                      label={`${el.person_info.first_name} ${el.person_info.last_name}`}
                      checked={requisitesId === el.requisites_id}
                      onChange={checkBank}
                      value={String(el.requisites_id)}
                    />
                    <div className='description'>
                      {`${el.address_info?.street}, ${el.address_info?.city}, ${
                        el.bank_info?.country === 'united states'
                          ? `${el.address_info?.state}, ${el.address_info?.zip_code}`
                          : `${el.address_info?.region}, ${el.address_info?.postal_code}`
                      }`}
                    </div>
                    <div className='title'>{el.bank_info.name!}</div>
                  </div>

                  <Button
                    round
                    color='translucent'
                    size='tiny'
                    onClick={() => handleEditBank(el.requisites_id)}
                  >
                    <i className='icon-svg'>
                      <IconSvg name='edit' />
                    </i>
                  </Button>
                </div>
              ))
            ) : (
              <div className='loading-wrap' />
            )
          ) : (
            hide && (
              <div className='loading-wrap'>
                <Loading />
              </div>
            )
          )}
        </div>

        <Button isLink ripple fullWidth onClick={handleNewMethod}>
          <i className='icon-add' /> NEW METHOD
        </Button>
        <div className='form-submit'>
          <Button
            fullWidth
            size='smaller'
            isShiny
            disabled={!requisitesId}
            onClick={() => onScreenSelect(SettingsScreens.BankRequest)}
          >
            {t('Wallet.Withdrawal')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withGlobal((global) =>
  pick(global, ['bankWithdrawsRequisites'])
)(BankTransferList);
