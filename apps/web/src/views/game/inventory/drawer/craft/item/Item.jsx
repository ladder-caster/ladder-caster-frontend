import React, { useRef } from 'react';
import {
  _item,
  _breakpoint,
  _title,
  _body,
  _choose,
  _row,
  _hat,
  _float,
  _amount,
  _robe,
  _staff,
  _inner,
} from './Item.styled';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
  GAME_INVENTORY,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  VIEW_SIZE,
} from 'core/remix/state';
import Rank from '../../../../spellcasters/drawer/rank/Rank';
import { useSize } from 'core/hooks/useSize';
import { IconHat } from 'design/icons/hat.icon';
import { IconCloak } from 'design/icons/cloak.icon';
import { IconStaff } from 'design/icons/staff.icon';
import { IconGem } from 'design/icons/gem.icon';
import { useActions } from '../../../../../../../actions';
import Boost from '../../../../spellcasters/drawer/boost/Boost';
import { filter } from 'lodash';

const Item = () => {
  const { t } = useTranslation();
  const { craftChooseItem } = useActions();
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const [context, setContext] = useRemix(DRAWER_CONTEXT);
  const [inventory] = useRemix(GAME_INVENTORY);
  const [view_height] = useRemix(VIEW_SIZE);
  const isBoost = drawer?.boost;
  const caster = context?.caster;
  const choose_ref = useRef();
  const { width } = useSize(choose_ref);

  const hats = filter(inventory?.items, (match) => match?.type === ITEM_HAT)
    ?.length;
  const staffs = filter(inventory?.items, (match) => match?.type === ITEM_STAFF)
    ?.length;
  const robes = filter(inventory?.items, (match) => match?.type === ITEM_ROBE)
    ?.length;

  return (
    <_item $height={view_height}>
      <Rank caster={caster} />
      <_breakpoint />
      {isBoost && <Boost />}
      {!isBoost && (
        <_body>
          <_title>{t('drawer.inventory.item.title')}</_title>
          <_choose $height={width} ref={choose_ref}>
            <_row>
              <_hat onClick={() => craftChooseItem(ITEM_HAT)}>
                <_inner $scale={0.95}>
                  <IconHat />
                </_inner>
                <_float>
                  <_amount>
                    <span>{hats}</span>
                  </_amount>
                </_float>
              </_hat>
              <_staff onClick={() => craftChooseItem(ITEM_STAFF)}>
                <_inner $scale={1.4}>
                  <IconStaff />
                </_inner>
                <_float>
                  <_amount>
                    <span>{staffs}</span>
                  </_amount>
                </_float>
              </_staff>
            </_row>
            <_row>
              <_robe onClick={() => craftChooseItem(ITEM_ROBE)}>
                <_inner $scale={1.1}>
                  <IconCloak />
                </_inner>
                <_float>
                  <_amount>
                    <span>{robes}</span>
                  </_amount>
                </_float>
              </_robe>
            </_row>
          </_choose>
        </_body>
      )}
    </_item>
  );
};

export default Item;
