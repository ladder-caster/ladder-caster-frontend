import React from 'react';
import { _trade, _link } from './Trade.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../actions';

const Trade = () => {
  const { t } = useTranslation();
  const { openTradeDrawer } = useActions();
  const { openDrawerTrade } = useActions();

  return (
    <_trade>
      <_link href={'https://jup.ag/swap/USDC-LADA'} target={'_none'}>
        {t('heading.buy.lada')}
      </_link>
    </_trade>
  );
};

export default Trade;
