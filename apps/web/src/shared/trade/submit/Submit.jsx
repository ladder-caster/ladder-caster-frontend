import React from 'react';
import { _submit } from './Submit.styled';
import { findMarket } from 'core/utils/markets';
import { DRAWER_CONTEXT, SIDE_BUY, SIDE_SELL } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../actions';

const Submit = () => {
  const { t } = useTranslation();
  const [context] = useRemix(DRAWER_CONTEXT);
  const { placeOrder } = useActions();
  const base = context?.base;
  const quote = context?.quote;
  const pair = findMarket(base, quote);
  const side = context?.buy ? SIDE_BUY : SIDE_SELL;
  const price = context?.input?.base;
  const size = context?.input?.quote;

  const disabled = !pair || !side || !price || !size;

  return (
    <_submit
      $disabled={disabled}
      disabled={disabled}
      onClick={() => placeOrder(pair, side, price, size)}
    >
      {t('drawer.trade.order')}
    </_submit>
  );
};

export default Submit;
