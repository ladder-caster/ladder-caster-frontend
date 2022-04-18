import React, { useMemo, useState, useEffect } from 'react';
import {
  _player,
  _background,
  _breakpoint,
  _details,
  _title,
  _description,
  _float,
  _burn,
} from './Player.styled';
import { useTranslation } from 'react-i18next';
import Character from './character/Character';
import Actions from './actions/Actions';
import Tabs from '../../../../shared/tabs/Tabs';
import {
  CONFIRM_UNEQUIP,
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
  GAME_BOOST,
  GAME_SPELLCASTERS,
  PLAYER_ACTIONS,
  PLAYER_CHARACTER,
  PLAYER_LEADERBOARD,
  SPELLCASTER_BUY,
  TABS_CHARACTER_ACTIONS,
  TYPE_EARTH,
  TYPE_FIRE,
  TYPE_WATER,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { find } from 'lodash';
import Rank from './rank/Rank';
import Boost from './boost/Boost';
import { useActions } from '../../../../../actions';
import Leaderboard from '../../../../shared/leaderboard/Leaderboard';
import Confirm from '../../../../shared/confirm/Confirm';

const Player = () => {
  const { t } = useTranslation();
  const { burnResourcesForXP } = useActions();
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const [context] = useRemix(DRAWER_CONTEXT);
  const isBoost = drawer?.boost;
  const confirm = context?.confirm && context?.unequip;
  const id = drawer?.id;

  const caster = useMemo(
    () => find(spellcasters, (caster) => caster.id === id),
    [drawer, spellcasters],
  );

  const tabs_character_actions = {
    [PLAYER_CHARACTER]: {
      name: t('player.character'),
      View: Character,
    },
    [PLAYER_LEADERBOARD]: {
      name: t('player.leaderboard'),
      View: Leaderboard,
    },
  };

  return (
    <_background>
      <_player>
        {id === SPELLCASTER_BUY && (
          <_details>
            <_title>{t('wizard.title')}</_title>
            <_description>{t('wizard.description')}</_description>
          </_details>
        )}
        {id !== SPELLCASTER_BUY && <Rank caster={caster} />}
        <_breakpoint />
        {isBoost && <Boost />}
        {!confirm && !isBoost && (
          <Tabs
            tab_id={TABS_CHARACTER_ACTIONS}
            views={tabs_character_actions}
            caster={caster}
            back={context?.back}
          />
        )}
        {confirm && !isBoost && <Confirm type={CONFIRM_UNEQUIP} />}
      </_player>
    </_background>
  );
};

export default Player;
