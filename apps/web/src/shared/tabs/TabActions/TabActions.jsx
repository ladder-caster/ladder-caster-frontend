import React from 'react';
import { _container, _row, _player_actions, _text } from './TabActions.styled';
import { useTranslation } from 'react-i18next';
import Pill from '../../button/pill/Pill';
import { useActions } from '../../../../actions';
const TabAction = ({ caster, pulse }) => {
  const { t } = useTranslation();
  const { unequipAllItems, upgradeAllItems } = useActions();
  const canUpgrade = pulse ?? false;
  const equipBlocked = !!caster?.turnCommit ?? false;
  const unequip = () => {
    unequipAllItems(caster);
  };
  const upgrade = () => {
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
              disabled={!canUpgrade || equipBlocked}
              onClick={upgrade}
              $pulse={canUpgrade}
              text={t('player.actions.main.upgrade_all')}
            />
          </_row>
        </_player_actions>
      </_row>
    </_container>
  );
};

export default TabAction;
