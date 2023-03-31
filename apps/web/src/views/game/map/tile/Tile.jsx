import React, { useMemo } from 'react';
import {
  _tile,
  _cutout,
  _float,
  _enchant,
  _background,
  _element,
  _icon,
  _casters,
  _tier,
  _floaticon,
  _backdrop,
  _chip,
  _outline,
} from './Tile.styled';
import {
  CONFIRM_MOVE,
  GAME_CONFIRM,
  GAME_MAP,
  GAME_SPELLCASTERS,
  MODAL_ACTIVE,
  MODAL_MOVE,
  TIER_I,
  TIER_II,
  TIER_III,
  TIER_IV,
  TILE_CHIP,
  TILE_GLOWING,
  TYPE_CRAFT,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_LEGENDARY,
  TYPE_RES2,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { IconBeaker } from 'design/icons/beaker.icon';
import { withTheme } from 'styled-components';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
import { AnimateBackground } from './animations/AnimateBackground';
import { AnimateEnchant } from './animations/AniamteEnchant';
import { IconAnvil } from 'design/icons/anvil.icon';
import { IconMap } from 'design/icons/map.icon';
import { IconWizard } from 'design/icons/wizard.icon';
import { useActions } from '../../../../../actions';

const COST_MULTIPLIER = 10;

const Tile = withTheme(({ theme, level, col, isModal, status }) => {
  const { confirmMove, cancelMove } = useActions();
  const [confirm] = useRemix(GAME_CONFIRM);
  const [modal] = useRemix(MODAL_ACTIVE);
  const row = level - 1;
  const position = `${col}${level}`;
  const sumPosition = (spellcasters) => {
    let count = 0;
    for (const caster of spellcasters) {
      const casterPosition = caster.casterActionPosition
        ? caster.casterActionPosition
        : caster.position;
      if (casterPosition === position) count++;
    }
    return count;
  };
  const [casters] = useRemix(GAME_SPELLCASTERS, (spellcasters) =>
    sumPosition(spellcasters),
  );
  const [land] = useRemix(GAME_MAP, (lands) => lands?.[row]?.[col]);
  const remaining = land?.remaining;
  const isActive = land !== undefined && !land?.empty;
  const type = land?.type;
  const move_to =
    confirm?.type === CONFIRM_MOVE && confirm.position === position;
  const move_from =
    confirm?.type === CONFIRM_MOVE &&
    modal?.type === MODAL_MOVE &&
    modal?.options?.caster?.position === position;

  const Icon = {
    [TYPE_RES1]: IconResourcee1,
    [TYPE_RES2]: IconResource2,
    [TYPE_RES3]: IconResource3,
    [TYPE_CRAFT]: IconAnvil,
    [TYPE_LEGENDARY]: IconMap,
  }[type];

  const show_tier = {
    '1': '',
    '2': 'II',
    '3': 'III',
    '4': 'IV',
  }[land?.tier?.toString()];

  const color = theme.tile[type];
  const getCost = () => {
    // incase future tile costs are added such as towers, fights, etc.
    switch (type) {
      case TYPE_RES1:
      case TYPE_RES2:
      case TYPE_RES3:
        return level * COST_MULTIPLIER;
      default:
        return 0;
    }
  };
  const clickTile = () => {
    if (isModal) {
      if (status === TILE_GLOWING)
        confirmMove({
          type: CONFIRM_MOVE,
          position,
          cost: getCost(),
          tileType: type,
        });
      if (status === TILE_CHIP) cancelMove();
    }
  };

  const tier_multiply = {
    [TIER_I]: 1,
    [TIER_II]: 2,
    [TIER_III]: 3,
    [TIER_IV]: 4,
  }[land?.tier];

  return (
    <_tile>
      <_cutout>
        {isActive && (
          <>
            <_float>
              <_float>
                <_backdrop />
              </_float>
              <_float>
                <AnimateEnchant
                  move_to={move_to}
                  status={status}
                  $casters={casters}
                >
                  <_enchant $color={color} $element={type}>
                    {remaining && <span>{remaining}</span>}
                  </_enchant>
                </AnimateEnchant>
              </_float>
            </_float>
            {(status === TILE_CHIP ||
              (status === TILE_GLOWING && move_to) ||
              move_from) && (
              <_float>
                {move_from ? (
                  <_outline />
                ) : (
                  <_chip>
                    <IconWizard />
                  </_chip>
                )}
              </_float>
            )}
            <AnimateBackground
              move_to={move_to}
              status={status}
              $casters={casters}
            >
              <_background
                onClick={() => clickTile()}
                $color={color}
                $element={type}
                $tier={tier_multiply}
              >
                <_floaticon $element={type}>
                  <Icon />
                </_floaticon>
                <_tier $element={type}>
                  <span>{show_tier}</span>
                </_tier>
                <_element $element={type} $width={90}>
                  <_icon $offset={0} $element={type} $casters={casters}>
                    <Icon />
                  </_icon>
                  {+casters > 0 && (
                    <_casters $element={type}>{casters}</_casters>
                  )}
                </_element>
              </_background>
            </AnimateBackground>
          </>
        )}
      </_cutout>
    </_tile>
  );
});

export default Tile;
