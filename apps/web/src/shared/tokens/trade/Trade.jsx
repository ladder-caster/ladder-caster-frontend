import React from 'react';
import { _trade, _swap } from './Trade.styled';
import Resources from './resources/Resources';
import Counter from './counter/Counter';
import { TOKENS_ACTIVE } from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../actions';

const Trade = () => {
  const { t } = useTranslation();
  const [tokens] = useMesh(TOKENS_ACTIVE);
  const { swapResources } = useActions();

  return (
    <_trade>
      <Resources pair={tokens?.pair} />
      <Counter />
      <_swap onClick={() => swapResources()}>{t('drawer.trade.swap')}</_swap>
    </_trade>
  );
};

export default Trade;
