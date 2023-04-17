import React, { useEffect } from 'react';
import { _submit } from './Submit.styled';
import { findMarket } from 'core/utils/markets';
import { DRAWER_CONTEXT, SIDE_BUY, SIDE_SELL } from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../../actions';

const Submit = () => {
  const { t } = useTranslation();
  const [context] = useMesh(DRAWER_CONTEXT);
  const { swapOrder } = useActions();
  const base = context?.base;
  const quote = context?.quote;
  const pair = findMarket(base, quote);
  const side = context?.side;
  const input_base = context?.input?.base;
  const input_quote = context?.input?.quote;
  const amount = side === SIDE_BUY ? input_quote : input_base;

  const disabled = !pair || !side || !input_base || !input_quote;

  return (
    <_submit
      $isBid={side === SIDE_BUY}
      $disabled={disabled}
      disabled={disabled}
      onClick={() => swapOrder(pair, side, amount)}
    >
      {t('drawer.trade.swap')}
    </_submit>
  );
};

export default Submit;
