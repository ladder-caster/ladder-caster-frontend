import React, { useEffect } from 'react';
import { _submit } from './Submit.styled';
import { findMarket } from 'core/utils/markets';
import { DRAWER_CONTEXT, SIDE_BUY, SIDE_SELL } from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../../actions';

const Submit = ({ isBuy }) => {
  const { t } = useTranslation();
  const [context] = useMesh(DRAWER_CONTEXT);
  const { placeOrder } = useActions();
  const base = context?.base;
  const quote = context?.quote;
  const pair = findMarket(base, quote);
  const side = isBuy ? SIDE_BUY : SIDE_SELL;
  const price = context?.input?.base;
  const size = context?.input?.quote;

  const disabled = !pair || !side || !price || !size;

  return (
    <_submit
      $isBid={isBuy}
      $disabled={disabled}
      disabled={disabled}
      onClick={() => placeOrder(pair, side, price, size)}
    >
      {isBuy ? t('drawer.trade.order.buy') : t('drawer.trade.order.sell')}
    </_submit>
  );
};

export default Submit;
