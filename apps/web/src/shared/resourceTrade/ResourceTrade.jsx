import React from 'react';
import { _redeem, _button } from './ResourceTrade.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../actions';

const Trade = () => {
  const { t } = useTranslation();
  const { drawerTrade } = useActions();

  //TODO: move to button folder and change name for file and component
  return (
    <_redeem>
      <_button onClick={() => drawerTrade()}>
        {t('heading.trade.title')}
      </_button>
    </_redeem>
  );
};

export default Trade;
