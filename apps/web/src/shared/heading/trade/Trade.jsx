import React from 'react';
import { _trade, _button } from './Trade.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../actions';

const Trade = () => {
  const { t } = useTranslation();
  const { openDrawerTrade } = useActions();

  return (
      <_trade>
        <_button onClick={() => openDrawerTrade()}>
          {t('heading.trade')}
        </_button>
      </_trade>
  );
};

export default Trade;

