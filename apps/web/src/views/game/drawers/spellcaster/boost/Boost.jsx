import React from 'react';
import { _boost, _explainer } from './Boost.styled';
import Resource from './resource/Resource';
import {
  DRAWER_CONTEXT,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
} from 'core/remix/state';
import { _burn, _float } from '../SpellcasterDrawer.styled';
import { useActions } from '../../../../../../actions';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';

const Boost = () => {
  const { t } = useTranslation();
  const [context] = useRemix(DRAWER_CONTEXT);
  const { burnResourcesForXP } = useActions();
  const total_amount =
    context?.[TYPE_RES1] + context?.[TYPE_RES2] + context?.[TYPE_RES3] || 0;

  return (
    <_boost>
      <_explainer></_explainer>
      <Resource element={TYPE_RES2} />
      <Resource element={TYPE_RES1} />
      <Resource element={TYPE_RES3} />
      <_burn onClick={() => burnResourcesForXP()}>
        {`${t('drawer.button.burn')} ${total_amount} ${t('drawer.button.xp')}`}
      </_burn>
    </_boost>
  );
};

export default Boost;
