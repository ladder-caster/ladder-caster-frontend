import React from 'react';
import {
  _prestige,
  _title,
  _options,
  _option,
  _button,
  _estimate,
  _or,
} from './Prestige.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../../actions';
import { GAME_OLD_SPELLCASTERS } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { find } from 'lodash';

const Prestige = ({ spell_id }) => {
  const { t } = useTranslation();
  const { prestigeCaster } = useActions();

  const [caster] = useRemix(GAME_OLD_SPELLCASTERS, (spellcasters) =>
    find(spellcasters, (caster) => caster.id === spell_id),
  );

  return (
    <_prestige>
      <_title>{t('buy.now')}</_title>
      <_options>
        <_option>
          <_button onClick={() => prestigeCaster(caster.publicKey)}>
            <span>{t('spellcasters.prestige')}</span>
          </_button>
        </_option>
      </_options>
    </_prestige>
  );
};

export default Prestige;
