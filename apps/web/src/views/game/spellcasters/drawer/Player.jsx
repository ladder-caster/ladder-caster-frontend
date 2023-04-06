import React, { useMemo } from 'react';
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
import Tabs from '../../../../shared/tabs/Tabs';
import {
  CONFIRM_UNEQUIP,
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
  GAME_SPELLCASTERS,
  PLAYER_ACTIONS,
  PLAYER_CHARACTER,
  PLAYER_LEADERBOARD,
  SPELLCASTER_BUY,
  TABS_CHARACTER_ACTIONS,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import { find } from 'lodash';
import Rank from './rank/Rank';
import Boost from './boost/Boost';
import Leaderboard from '../../../../shared/leaderboard/Leaderboard';
import Confirm from '../../../../shared/confirm/Confirm';
import TabAction from '../../../../shared/tabs/TabActions/TabActions';

const Player = () => {
  const { t } = useTranslation();
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [drawer] = useRemix(DRAWER_ACTIVE);
  const [context] = useRemix(DRAWER_CONTEXT);
  const isBoost = drawer?.boost;
  const confirm = context?.confirm && context?.unequip;
  const id = drawer?.id;

  const caster = useMemo(
    () => find(spellcasters, (caster) => caster.id === id),
    [drawer, spellcasters],
  );
  // data struct added to allow easier future parse of data,
  // pulse used to make tab name pulse
  const tabs_character_actions = {
    [PLAYER_CHARACTER]: {
      name: t('player.character'),
      View: Character,
    },
    [PLAYER_LEADERBOARD]: {
      name: t('player.leaderboard'),
      View: Leaderboard,
    },
    [PLAYER_ACTIONS]: {
      name: t('player.actions'),
      View: TabAction,
    },
  };
  const renderMain = useMemo(() => {
    if (id === SPELLCASTER_BUY) {
      return (
        <_details>
          <_title>{t('wizard.title')}</_title>
          <_description>{t('wizard.description')}</_description>
        </_details>
      );
    }
    return <Rank caster={caster} />;
  }, [id]);
  const renderSecondary = useMemo(() => {
    if (isBoost) return <Boost />;
    if (confirm) return <Confirm type={CONFIRM_UNEQUIP} />;
    return (
      <Tabs
        tab_id={TABS_CHARACTER_ACTIONS}
        views={tabs_character_actions}
        caster={caster}
        back={context?.back}
      />
    );
  }, [isBoost, confirm, caster]);
  return (
    <_background>
      <_player>
        {renderMain}
        <_breakpoint />
        {renderSecondary}
      </_player>
    </_background>
  );
};

export default Player;
