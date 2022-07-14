import React from 'react';
import {
  _buy,
  _title,
  _options,
  _option,
  _button,
  _estimate,
  _or,
} from './Buy.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../../actions';

const Buy = () => {
  const { t } = useTranslation();
  const { modalBuyLADA } = useActions();

  return (
    <_buy>
      <_title>{t('buy.now')}</_title>
      <_options>
        <_option>
          <_button onClick={() => modalBuyLADA()}>
            <span>{t('spellcasters.buy')}</span>
          </_button>
        </_option>
      </_options>
    </_buy>
  );
};

export default Buy;
