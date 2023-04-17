import React from 'react';
import { _card, _icon } from './Card.styled';
import { IconHat } from 'design/icons/hat.icon';
import { useMesh } from 'core/state/mesh/useMesh';
import { GAME_OLD_SPELLCASTERS, GAME_SPELLCASTERS } from 'core/mesh/state';
import { find } from 'lodash';
import Spotlight from '../../../../../shared/spotlight/Spotlight';
import Caster from '../../../../../shared/caster/Caster';

const Card = ({ spell_id }) => {
  const [old_caster] =
    useMesh(GAME_OLD_SPELLCASTERS, (oldCasters) =>
      find(oldCasters, (caster) => caster?.id === spell_id),
    ) || null;
  const [caster] = useMesh(GAME_SPELLCASTERS, (spellcasters) =>
    find(spellcasters, (caster) => caster.id === spell_id),
  );

  return (
    <_card
      $caster={old_caster || caster}
      $disabled={!!caster?.turnCommit || !!old_caster?.turnCommit}
    >
      {old_caster || caster?.position ? (
        <Caster small caster={old_caster || caster} isOld={old_caster} />
      ) : (
        <Spotlight hue={caster?.hue}>
          <_icon>
            <IconHat />
          </_icon>
        </Spotlight>
      )}
    </_card>
  );
};

export default Card;
