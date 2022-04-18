import React, { useState, useRef } from 'react';
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
  TYPE_EARTH,
  TYPE_FIRE,
  TYPE_LEGENDARY,
  TYPE_WATER,
} from 'core/remix/state';
import { IconFireeIMG } from 'design/icons/firee.icon';
import { IconWaterIMG } from 'design/icons/water.icon';
import { IconEarthIMG } from 'design/icons/earth.icon';
import { IconAnvil } from 'design/icons/anvil.icon';

const ModalMove = ({ height, options }) => {
  const action_ref = useRef();
  const button_ref = useRef();
  const confirm_ref = useRef();
  const { t } = useTranslation();
  const { modalClear, confirmMove, modalChest } = useActions();
  const [confirm] = useRemix(GAME_CONFIRM);

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

  const Icon = {
    [TYPE_FIRE]: IconFireeIMG,
    [TYPE_WATER]: IconWaterIMG,
    [TYPE_EARTH]: IconEarthIMG,
    [TYPE_CRAFT]: IconAnvil,
    [TYPE_LEGENDARY]: IconAnvil,
  }[confirm?.tileType];

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
                <Tiles level={next_level} position={position} />
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
              {isConfirm && (
                <_cost>
                  <_cost_text>{t('modal.move.cost')}:</_cost_text>
                  {confirm?.cost > 0 && (
                    <_icon $element={confirm?.tileType}>
                      <Icon />
                    </_icon>
                  )}
                  <_amount>
                    {confirm?.cost > 0 ? confirm?.cost : t('modal.move.free')}
                  </_amount>
                </_cost>
              )}
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
