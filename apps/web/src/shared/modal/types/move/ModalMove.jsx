import React, { useState, useRef, useMemo } from 'react';
import {
  _move,
  _board,
  _row,
  _float,
  _actions,
  _header,
  _title,
  _description,
  _limit,
  _confirm,
  _amount,
  _icon,
  _cost,
  _cost_text,
  _caster_gear,
  _caster_gear_text,
  _caster_gear_icon,
  _caster_gear_icons,
} from './ModalMove.styled';
import { useClickOutside } from 'core/hooks/useClickOutside';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../actions';
import Tiles from './tiles/Tiles';
import Level from './level/Level';
import Letters from './letters/Letters';
import { AnimateBoard } from '../../animations/AnimateBoard';
import { AnimateLimit } from '../../animations/AnimateLimit';
import { _button } from '../loot/ModalLoot.styled';
import { AnimateButton } from '../../../../views/game/nav/animations/AnimateButton';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  CONFIRM_MOVE,
  GAME_CONFIRM,
  TYPE_CRAFT,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_LEGENDARY,
  TYPE_RES2,
  CASTER_UPGRADE_AVAILABLE,
} from 'core/remix/state';
import { IconResourcee1IMG } from 'design/icons/resourcee1.icon';
import { IconResource2IMG } from 'design/icons/resource2.icon';
import { IconResource3IMG } from 'design/icons/resource3.icon';
import { IconAnvil } from 'design/icons/anvil.icon';
import { IconHat } from 'design/icons/hat.icon';
import { IconStaff } from 'design/icons/staff.icon';
import { IconCloak } from 'design/icons/cloak.icon';
import { getTierNumber } from 'core/utils/switch';
import {
  IconMoney,
  IconMoneyIMG,
} from '../../../../../../libs/design/icons/money.icon';
import { IconSwirl } from 'design/icons/swirl.icon';
import IconAttribute from '../../../../shared/types/icons/IconAttribute';
const ModalMove = ({ height, options }) => {
  const action_ref = useRef();
  const button_ref = useRef();
  const confirm_ref = useRef();
  const { t } = useTranslation();
  const { modalClear, confirmMove, modalChest } = useActions();
  const [confirm] = useRemix(GAME_CONFIRM);
  const [upgradeAvailable] = useRemix(CASTER_UPGRADE_AVAILABLE);
  const isConfirm = confirm && confirm?.type === CONFIRM_MOVE;
  useClickOutside([confirm_ref, button_ref], () => modalClear());

  const caster = options?.caster;
  const level = caster?.casterActionPosition
    ? +caster?.casterActionPosition?.slice(
        1,
        caster?.casterActionPosition?.length,
      )
    : +caster?.position?.slice(1, caster?.position?.length);
  const next_level = level + 1 <= 30 ? level + 1 : 30;
  const position = caster?.casterActionPosition
    ? caster?.casterActionPosition
    : caster?.position;
  const confirm_level = +confirm?.position?.slice(1);
  const level_up = confirm_level > level;
  const confirm_tier = getTierNumber(level_up);

  const Icon = {
    [TYPE_RES1]: IconResourcee1IMG,
    [TYPE_RES2]: IconResource2IMG,
    [TYPE_RES3]: IconResource3IMG,
    [TYPE_CRAFT]: IconAnvil,
    [TYPE_LEGENDARY]: IconAnvil,
  }[confirm?.tileType];
  const EquipmentBaseIcon = {
    head: IconHat,
    robe: IconCloak,
    staff: IconStaff,
  };
  const casterEquipment = useMemo(() => {
    if (caster && upgradeAvailable) {
      const casterWrapper = upgradeAvailable?.casters?.get(caster?.publicKey);
      //console.log("CASTER WRAPPER",casterWrapper)
      if (!casterWrapper) return [];
      const keys = Object.keys(casterWrapper);
      const array = [];
      //console.log("KEYS",keys)
      for (let i = 0; i < keys.length; i++) {
        const currentItem = casterWrapper[keys[i]]?.currentItem;
        //console.log("CurrentItem",currentItem)
        if (!currentItem) {
          const BaseIcon = EquipmentBaseIcon[keys[i]];
          console.log('baseicon', BaseIcon);
          array.push(
            <_caster_gear_icon key={keys[i]}>
              <BaseIcon />
            </_caster_gear_icon>,
          );
          continue;
        }
        console.log(
          'fancyicon',
          <IconAttribute attribute={currentItem.attribute} />,
        );
        array.push(
          <_caster_gear_icon
            key={currentItem.type}
            $attribute={currentItem.attribute}
          >
            <IconAttribute attribute={currentItem.attribute} />
          </_caster_gear_icon>,
        );
      }
      //console.log("ARRAY",array)
      return array;
    }
  }, [upgradeAvailable?.casters, caster]);
  console.log('CASTER MAP', casterEquipment);
  return (
    <_move $height={height}>
      <_actions ref={action_ref}>
        <AnimateBoard>
          <_board ref={confirm_ref}>
            <_header>
              <_title>{t('modal.move.title')}</_title>
              <_description>{t('modal.move.description')}</_description>
            </_header>
            {next_level && (
              <_row>
                <Level level={next_level} />
                <Tiles caster={caster} level={next_level} position={position} />
                <Level level={next_level} $right />
              </_row>
            )}
            <_row>
              <Level level={level} />
              <Tiles level={level} position={position} />
              <Level level={level} $right />
            </_row>
            <_float>
              <Letters />
              <_float>
                <_float>
                  <_caster_gear>
                    <_caster_gear_text>
                      {t('modal.move.caster_equipment')}:
                    </_caster_gear_text>
                    <_caster_gear_icons>{casterEquipment}</_caster_gear_icons>
                  </_caster_gear>
                </_float>
                {isConfirm && (
                  <_cost>
                    <_cost_text>{t('modal.move.cost')}:</_cost_text>
                    {level_up ? (
                      <>
                        <_icon $element={'lada'}>
                          <IconMoneyIMG />
                        </_icon>
                        <_amount>{confirm_tier}</_amount>
                      </>
                    ) : null}
                    {confirm?.cost > 0 && (
                      <_icon $element={confirm?.tileType}>
                        <Icon />
                      </_icon>
                    )}
                    {!(level_up && !confirm?.cost) && (
                      <_amount>
                        {confirm?.cost > 0
                          ? confirm?.cost
                          : t('modal.move.free')}
                      </_amount>
                    )}
                  </_cost>
                )}
              </_float>
            </_float>
          </_board>
        </AnimateBoard>
        <_confirm>
          {isConfirm && (
            <>
              <AnimateButton $hidden={!confirm} key={'button-modal-move'}>
                <_button
                  disabled={!confirm}
                  key={'button-modal-mover'}
                  ref={button_ref}
                  onClick={() => confirmMove(caster)}
                >
                  {t('modal.move.action')} {confirm?.position?.toUpperCase()}
                </_button>
              </AnimateButton>
              <AnimateLimit $hidden={!confirm}>
                <_limit>
                  <span>{t('modal.limit')}</span>
                </_limit>
              </AnimateLimit>
            </>
          )}
        </_confirm>
      </_actions>
    </_move>
  );
};

export default ModalMove;
