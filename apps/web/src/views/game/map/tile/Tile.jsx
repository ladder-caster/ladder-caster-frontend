import React, { useCallback, useMemo } from 'react';
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
} from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import { IconBeaker } from 'design/icons/beaker.icon';
import { withTheme } from 'styled-components';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
import { AnimateBackground } from './animations/AnimateBackground';
import { AnimateEnchant } from './animations/AnimateEnchant';
import { IconAnvil } from 'design/icons/anvil.icon';
import { IconMap } from 'design/icons/map.icon';
import { IconWizard } from 'design/icons/wizard.icon';
import { useActions } from '../../../../../actions';

const COST_MULTIPLIER = 10;

const Tile = withTheme(({ theme, level, col, isModal, status }) => {
  const { confirmMove, cancelMove } = useActions();
  const [confirm] = useMesh(GAME_CONFIRM);
  const [modal] = useMesh(MODAL_ACTIVE);
  const row = level - 1;
  const position = `${col}${level}`;
  const sumPosition = useCallback((spellcasters) => {
    let count = 0;
    for (const caster of spellcasters) {
      const casterPosition = caster.casterActionPosition
        ? caster.casterActionPosition
        : caster.position;
      if (casterPosition === position) count++;
    }
    return count;
  }, []);
  const [casters] = useMesh(GAME_SPELLCASTERS, (spellcasters) =>
    sumPosition(spellcasters),
  );
  const [land] = useMesh(GAME_MAP, (lands) => lands?.[row]?.[col]);
  const remaining = land?.remaining;
  const isActive = land !== undefined && !land?.empty;
  const type = land?.type;
  const move_to =
    confirm?.type === CONFIRM_MOVE && confirm.position === position;
  const move_from =
    confirm?.type === CONFIRM_MOVE &&
    modal?.type === MODAL_MOVE &&
    modal?.options?.caster?.position === position;

  const Icon = useMemo(
    () =>
      ({
        [TYPE_RES1]: IconResourcee1,
        [TYPE_RES2]: IconResource2,
        [TYPE_RES3]: IconResource3,
        [TYPE_CRAFT]: IconAnvil,
        [TYPE_LEGENDARY]: IconMap,
      }[type]),
    [type],
  );

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
    <_tile key={`tile-${land?.id}`}>
      <_cutout key={`cutout-${land?.id}`}>
        {isActive && (
          <>
            <_float key={`float-${land?.id}`}>
              <_float key={`float-2-${land?.id}`}>
                <_backdrop key={`backdrop-${land?.id}`} />
              </_float>
              <_float>
                <_enchant
                  key={`enchant-${land?.id}`}
                  $color={color}
                  $element={type}
                  $move_to={move_to}
                  $casters={casters > 0}
                  $status={status}
                >
                  {remaining && (
                    <span key={`remaining-${land?.id}`}>{remaining}</span>
                  )}
                </_enchant>
              </_float>
            </_float>
            {(status === TILE_CHIP ||
              (status === TILE_GLOWING && move_to) ||
              move_from) && (
              <_float key={`float-3-${land?.id}`}>
                {move_from ? (
                  <_outline key={`outline-${land?.id}`} />
                ) : (
                  <_chip key={`chip-${land?.id}`}>
                    <IconWizard key={`icon-wizard-${land?.id}`} />
                  </_chip>
                )}
              </_float>
            )}
            <_background
              key={`background-${land?.id}`}
              onClick={() => clickTile()}
              $color={color}
              $element={type}
              $tier={tier_multiply}
              $move_to={move_to}
              $casters={casters > 0}
              $status={status}
            >
              <_floaticon key={`float-icon-${land?.id}`} $element={type}>
                <Icon key={`float-icon-icon-${land?.id}`} />
              </_floaticon>
              <_tier key={`tier-${land?.id}`} $element={type}>
                <span key={`tier-span-${land?.id}`}>{show_tier}</span>
              </_tier>
              <_element key={`element-${land?.id}`} $element={type} $width={90}>
                <_icon
                  key={`icon-${land?.id}`}
                  $offset={0}
                  $element={type}
                  $casters={casters}
                >
                  <Icon key={`icon-icon-${land?.id}`} />
                </_icon>
                {+casters > 0 && (
                  <_casters key={`casters-${land?.id}`} $element={type}>
                    {casters}
                  </_casters>
                )}
              </_element>
            </_background>
          </>
        )}
      </_cutout>
    </_tile>
  );
});

export default Tile;
