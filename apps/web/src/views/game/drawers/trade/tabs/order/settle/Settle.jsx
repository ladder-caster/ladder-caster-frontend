import React from 'react';
import { _settle, _button } from './Settle.styled';
import { useTranslation } from 'react-i18next';
import { useOpenOrders } from 'core/hooks/useOpenOrders';
import { useActions } from '../../../../../../../../actions';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DRAWER_CONTEXT } from 'core/remix/state';
import { findMarket } from 'core/utils/markets';

const Settle = () => {
  const { t } = useTranslation();
  const [context] = useRemix(DRAWER_CONTEXT);
  const base = context?.base;
  const quote = context?.quote;
  const pair = findMarket(base, quote);
  const { unsettledOrders, loading } = useOpenOrders(true);
  const { settleFunds } = useActions();

  if (!unsettledOrders?.length) return null;

  return (
    <_settle>
      <_button
        $active={unsettledOrders?.length}
        onClick={() => {
          settleFunds(pair, unsettledOrders);
        }}
      >
        {t('drawer.trade.settle')}
      </_button>
    </_settle>
  );
};

export default Settle;
