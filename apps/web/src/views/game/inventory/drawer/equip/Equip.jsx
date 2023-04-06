import React, { useMemo, useState } from 'react';
import {
  _equip,
  _caster,
  _item,
  _current,
  _empty,
  _player,
  _compare,
  _from,
  _to,
  _choose,
  _header,
  _side,
  _back,
  _title,
  _other,
  _attribute,
  _tile,
  _tile_text,
  _tile_icon,
} from './Equip.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import {
  DRAWER_CONTEXT,
  EQUIP_ITEM,
  GAME_MAP,
  GAME_SPELLCASTERS,
  ITEM_BOOK,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  TIER_I,
  TYPE_CRAFT,
  TYPE_LEGENDARY,
  TYPE_RES1,
  TYPE_RES2,
  TYPE_RES3,
} from 'core/remix/state';
import { sortBy } from 'lodash';
import { IconCloak } from 'design/icons/cloak.icon';
import { IconBook } from 'design/icons/book.icon';
import { IconStaff } from 'design/icons/staff.icon';
import { IconHat } from 'design/icons/hat.icon';
import { IconChevronRight } from 'design/icons/chevron-right.icon';
import { useActions } from '../../../../../../actions';
import Caster from '../../../../../shared/caster/Caster';
import { IconChevronLeft } from 'design/icons/chevron-left.icon';
import { useTranslation } from 'react-i18next';
import IconAttribute from '../../../../../shared/types/icons/IconAttribute';
import Item from '../../../../../shared/item/Item';
import { IconMap } from 'design/icons/map.icon';
import { IconAnvil } from 'design/icons/anvil.icon';
import { IconResource3 } from 'design/icons/resource3.icon';
import { IconResource2 } from 'design/icons/resource2.icon';
import { IconResourcee1 } from 'design/icons/resourcee1.icon';

const Equip = () => {
  const { t } = useTranslation();
  const { equipItem } = useActions();
  const [context] = useRemix(DRAWER_CONTEXT);
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const item = context?.item;
  const back = context?.back;
  const [lands] = useMesh(GAME_MAP);
  const sort_casters = useMemo(() => {
    return sortBy(spellcasters, (sort) => sort?.hue);
  }, [spellcasters]);

  const item_type = {
    [ITEM_ROBE]: 'robe',
    [ITEM_BOOK]: 'spell',
    [ITEM_STAFF]: 'staff',
    [ITEM_HAT]: 'hat',
  }[item?.type];

  const type = {
    [ITEM_HAT]: 'Hat',
    [ITEM_ROBE]: 'Robe',
    [ITEM_STAFF]: 'Staff',
    [ITEM_BOOK]: 'Spellbook',
  }[item?.type];

  const EmptyIcon = {
    [ITEM_ROBE]: IconCloak,
    [ITEM_BOOK]: IconBook,
    [ITEM_STAFF]: IconStaff,
    [ITEM_HAT]: IconHat,
  }[item?.type];
  const TileIcons = {
    [TYPE_RES1]: IconResourcee1,
    [TYPE_RES2]: IconResource2,
    [TYPE_RES3]: IconResource3,
    [TYPE_CRAFT]: IconAnvil,
    [TYPE_LEGENDARY]: IconMap,
  };
  const equip_casters = useMemo(() => {
    if (sort_casters)
      return sortBy(spellcasters, (sort) => sort?.hue).map((caster) => {
        const hasEquipped = caster?.[item_type];
        const from_attribute = hasEquipped?.attribute;
        const to_attribute = item?.attribute;
        const other_attributes = [];
        if (item?.type !== ITEM_HAT) {
          other_attributes.push(
            <_attribute $attribute={caster?.hat?.attribute}>
              {caster?.hat ? (
                <IconAttribute attribute={caster?.hat?.attribute} />
              ) : (
                <IconHat />
              )}
            </_attribute>,
          );
        }
        if (item?.type !== ITEM_ROBE) {
          other_attributes.push(
            <_attribute $attribute={caster?.robe?.attribute}>
              {caster?.robe ? (
                <IconAttribute attribute={caster?.robe?.attribute} />
              ) : (
                <IconCloak />
              )}
            </_attribute>,
          );
        }
        if (item?.type !== ITEM_STAFF) {
          other_attributes.push(
            <_attribute $attribute={caster?.staff?.attribute}>
              {caster?.staff ? (
                <IconAttribute attribute={caster?.staff?.attribute} />
              ) : (
                <IconStaff />
              )}
            </_attribute>,
          );
        }
        // position e.g A10

        const col = caster?.position?.substring(0, 1);
        const row = caster?.position?.substring(1);
        const intRow = row ? parseInt(row) - 1 : 0;
        const element = lands?.[intRow]?.[col]?.type;
        const Icon = TileIcons[element];

        return (
          <_caster onClick={() => equipItem(item, caster)}>
            <_item>
              <_other>
                {other_attributes[0]}
                {other_attributes[1]}
              </_other>
              <_player>
                <Caster small caster={caster} />
              </_player>
              <_current>
                {hasEquipped ? (
                  <Item item={hasEquipped} />
                ) : (
                  <_empty>{!!EmptyIcon && <EmptyIcon />}</_empty>
                )}
              </_current>
            </_item>
            <_compare>
              <_from $attribute={from_attribute || to_attribute}>
                <IconAttribute attribute={from_attribute || to_attribute} />
                <span>{from_attribute ? hasEquipped?.value : 0}</span>
              </_from>
              <_to $attribute={to_attribute}>
                {to_attribute && (
                  <>
                    <IconAttribute attribute={to_attribute} />
                    <span>{item?.value}</span>
                  </>
                )}
              </_to>
            </_compare>
            <_tile $element={element} $image={Icon}>
              <_tile_icon>
                <Icon />
              </_tile_icon>
              <_tile_text $element={element}>
                {caster?.position?.toUpperCase()}
              </_tile_text>
            </_tile>
            <_choose>
              <IconChevronRight />
            </_choose>
          </_caster>
        );
      });
  }, [sort_casters]);
  return (
    <_equip>
      <_header>
        <_side>
          <_back onClick={() => back && back()}>
            <IconChevronLeft />
          </_back>
        </_side>
        <_title>
          <span>{type && t('drawer.inventory.equip.title', { type })}</span>
        </_title>
      </_header>
      {equip_casters}
    </_equip>
  );
};

export default Equip;
