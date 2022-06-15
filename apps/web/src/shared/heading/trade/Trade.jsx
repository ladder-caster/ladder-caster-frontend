import React from 'react';
import { _trade, _link } from './Trade.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../actions';

const Trade = () => {
  const { t } = useTranslation();
  const { openDrawerTrade } = useActions();

  return (
    <_trade>
      <_link
        href={
          'https://raydium.io/swap/?inputCurrency=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputCurrency=95bzgMCtKw2dwaWufV9iZyu64DQo1eqw6QWnFMUSnsuF&outputAmount=0&fixed=in'
        }
        target="_blank"
        rel="noreferrer"
      >
        {t('heading.buy.lada')}
      </_link>
    </_trade>
  );
};

export default Trade;
