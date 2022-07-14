import React from 'react';
import { _percent } from './Percent.styled';
import { AnimatePercent } from '../../../animations/AnimatePercent';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';
import { DRAWER_CONTEXT, GAME_RESOURCES, SIDE_BUY } from 'core/remix/state';
import { useActions } from '../../../../../../../../actions';

const Percent = ({ weight }) => {
  const { t } = useTranslation();
  const [resources] = useRemix(GAME_RESOURCES);
  const [context] = useRemix(DRAWER_CONTEXT);
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
