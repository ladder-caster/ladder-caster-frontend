import React from 'react';
import { _percent } from './Percent.styled';
import { AnimatePercent } from '../../../animations/AnimatePercent';
import { useMesh } from 'core/state/mesh/useMesh';
import { DRAWER_CONTEXT, GAME_RESOURCES } from 'core/mesh/state';
import { useActions } from '../../../../../../actions';
import { useTranslation } from 'react-i18next';

const Percent = ({ weight, isOrder }) => {
  const { t } = useTranslation();
  const [resources] = useMesh(GAME_RESOURCES);
  const [context] = useMesh(DRAWER_CONTEXT);
  const { inputOrder } = useActions();
  const base =
    Math.floor(resources?.[context?.base?.toLowerCase()] * 1e2) / 1e2 || 0;
  const quote = Math.floor(resources?.[context?.quote?.toLowerCase()]) || 0;
  const input = context?.input;
  let balance = quote;
  if (isOrder) {
    balance = base / input?.base || 0;
  }

  const value = Math.floor(weight * balance);

  return (
    <AnimatePercent>
      <_percent
        onClick={() => {
          if (!isOrder || (isOrder && input?.base)) inputOrder(false, value);
        }}
      >
        {weight === 1 ? t('trade.percent.max') : `${weight * 100}%`}
      </_percent>
    </AnimatePercent>
  );
};

export default Percent;
