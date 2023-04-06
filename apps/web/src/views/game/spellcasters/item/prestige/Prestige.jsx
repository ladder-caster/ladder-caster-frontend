import React, { useState } from 'react';
import {
  _prestige,
  _title,
  _options,
  _option,
  _button,
  _cost,
} from './Prestige.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../../actions';
import { GAME_OLD_SPELLCASTERS } from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import { find } from 'lodash';
import { CHAIN_OLD_CASTERS } from 'chain/hooks/state';

const Prestige = ({ spell_id }) => {
  const { t } = useTranslation();
  const { prestigeCaster } = useActions();
  const [confirm, setConfirm] = useState(false);
  const [caster] = useRemix(GAME_OLD_SPELLCASTERS, (spellcasters) =>
    find(spellcasters, (caster) => caster.id === spell_id),
  );

  const [oldCasters] = useRemix(CHAIN_OLD_CASTERS);
  return (
    <_prestige>
      <_title>{t('prestige.caster')}</_title>
      <_options>
        <_option>
          {!confirm ? (
            <_button $high onClick={() => setConfirm(true)}>
              <span>{t('spellcasters.prestige')}</span>
            </_button>
          ) : (
            <_button
              onClick={() => {
                setConfirm(false);
                prestigeCaster(caster.publicKey);
              }}
            >
              <span>{t('prestige.confirm')}</span>
            </_button>
          )}
          <_cost>{t('prestige.cost')}</_cost>
        </_option>
      </_options>
    </_prestige>
  );
};

export default Prestige;
