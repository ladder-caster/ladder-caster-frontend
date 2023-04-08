import React from 'react';
import { _buy } from './Buy.styled.js';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../actions';

const Buy = () => {
  const { t } = useTranslation();
  const { modalBuyLADA } = useActions();

  return (
    <_buy onClick={() => modalBuyLADA()}>
      <span>{t('spellcasters.buy')}</span>
    </_buy>
  );
};

export default Buy;
