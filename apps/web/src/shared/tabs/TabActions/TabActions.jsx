import React from 'react';
import { _container, _row, _player_actions, _text } from './TabActions.styled';
import { useTranslation } from 'react-i18next';
import Pill from '../../button/pill/Pill';
import {
  CASTER_UPGRADE_AVAILABLE,
  GAME_CONSTANTS,
  GAME_SPELLCASTERS,
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useActions } from '../../../../actions';
const TabAction = ({ caster }) => {
  const { t } = useTranslation();
  const [upgradeAvailable] = useRemix(CASTER_UPGRADE_AVAILABLE);
  const { unequipAllItems, upgradeAllItems } = useActions();
  const canUpgrade = upgradeAvailable?.canUpgrade(caster?.publicKey) ?? false;
  const equipBlocked = !!caster?.turnCommit ?? false;
  const unequip = () => {
    unequipAllItems(caster);
  };
  const upgrade = () => {
    //todo:}
    upgradeAllItems(caster);
  };
  return (
    <_container>
      <_row>
        <_player_actions>
          <_text>
            <span>{t('player.actions.main')}</span>
          </_text>
          <_row>
            <Pill
              disabled={equipBlocked}
              onClick={unequip}
              text={t('player.actions.main.unequip_all')}
            />
            <Pill
              onClick={upgrade}
              text={t('player.actions.main.upgrade_all')}
            />
          </_row>
        </_player_actions>
      </_row>
    </_container>
  );
};

export default TabAction;
