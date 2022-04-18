import React from 'react';
import { _card, _icon } from './Card.styled';
import { useTranslation } from 'react-i18next';
import { IconHat } from 'design/icons/hat.icon';
import { useRemix } from 'core/hooks/remix/useRemix';
import { GAME_SPELLCASTERS } from 'core/remix/state';
import { find } from 'lodash';
import Spotlight from '../../../../../shared/spotlight/Spotlight';
import { IconWizard } from 'design/icons/wizard.icon';
import Caster from '../../../../../shared/caster/Caster';

const Card = ({ spell_id, mint }) => {
  const { t } = useTranslation();
  const [caster] = useRemix(GAME_SPELLCASTERS, (spellcasters) =>
    find(spellcasters, (caster) => caster.id === spell_id),
  );

  return (
    <_card $caster={caster}>
      {caster?.position ? (
        <Caster small caster={caster} />
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
