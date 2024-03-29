import React from 'react';
import { _percent } from './Percent.styled';
import { AnimatePercent } from '../../../animations/AnimatePercent';
import { useTranslation } from 'react-i18next';
import { useMesh } from 'core/state/mesh/useMesh';
import { DRAWER_CONTEXT, GAME_RESOURCES, SIDE_BUY } from 'core/mesh/state';
import { useActions } from '../../../../../../actions';

const Percent = ({ weight }) => {
  const { t } = useTranslation();
  const [resources] = useMesh(GAME_RESOURCES);
  const [context] = useMesh(DRAWER_CONTEXT);
  const { inputSwap } = useActions();
  const base = context?.base;
  const quote = context?.quote;
  const side = context?.side;
  const balance =
    Math.floor(
      resources?.[
        side === SIDE_BUY ? base?.toLowerCase() : quote?.toLowerCase()
      ],
    ) || 0;

  const value = Math.floor(weight * balance);

  return (
    <AnimatePercent>
      <_percent onClick={() => inputSwap(true, value)}>
        {weight === 1 ? t('trade.percent.max') : `${weight * 100}%`}
      </_percent>
    </AnimatePercent>
  );
};

export default Percent;
