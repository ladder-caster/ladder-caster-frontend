import React from 'react';
import {
  _items,
  _header,
  _container,
  _title,
  _scroll,
  _type,
  _name,
  _rarity,
  _tier,
  _attribute,
} from './InventoryDrawer.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  CONFIRM_EQUIP,
  DRAWER_CONTEXT,
  ITEM_BOOK,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  VIEW_SIZE,
} from 'core/remix/state';
import { AnimateButton } from '../../../../shared/button/animations/AnimateButton';
import { _close, _icon } from '../spellcaster/rank/Rank.styled';
import { IconClose } from 'design/icons/close.icon';
import IconItem from '../../../../shared/types/items/IconItem';
import TitleItem from '../../../../shared/types/items/TitleItem';
import { useTranslation } from 'react-i18next';
import RarityTitle from '../../../../shared/types/rarity/RarityTitle';
import AttributeItem from '../../../../shared/types/items/AttributeItem';
import { _breakpoint } from '../spellcaster/SpellcasterDrawer.styled';
import { useActions } from '../../../../../actions';
import Equip from './equip/Equip';
import Info from '../../../../shared/info/Info';
import Confirm from '../../../../shared/confirm/Confirm';

const InventoryDrawer = () => {
  const { t } = useTranslation();
  const { closeDrawer } = useActions();
  const [view_height] = useRemix(VIEW_SIZE);
  const [context] = useRemix(DRAWER_CONTEXT);
  const item = context?.item;
  const type = item?.type;
  const rarity = item?.rarity;
  const equip = context?.equip;
  const confirm = context?.confirm;

  const level = item?.level;
  const attribute = item?.attribute;

  const item_type = {
    head: [ITEM_HAT],
    robe: [ITEM_ROBE],
    staff: [ITEM_STAFF],
    spell: [ITEM_BOOK],
  }[type];

  return item ? (
    <_items $height={view_height}>
      <_header>
        <_container>
          <_type>
            <IconItem type={item_type} />
            <_title>
              <_rarity $rarity={rarity}>
                <RarityTitle rarity={rarity} />
              </_rarity>
              <_name>
                <TitleItem type={item_type} />
              </_name>
            </_title>
          </_type>
          <_title $right>
            <_attribute $attribute={attribute}>
              <AttributeItem attribute={attribute} />
            </_attribute>
            <_tier $right>
              {t('attribute.level').toUpperCase()} <span>{level}</span>
            </_tier>
          </_title>
        </_container>
        <_close>
          <AnimateButton high>
            <_icon onClick={() => closeDrawer()}>
              <IconClose />
            </_icon>
          </AnimateButton>
        </_close>
      </_header>
      <_breakpoint />
      <_scroll>
        {confirm && <Confirm type={CONFIRM_EQUIP} />}
        {!confirm && equip && <Equip />}
        {!confirm && !equip && <Info item={item} />}
      </_scroll>
    </_items>
  ) : null;
};

export default InventoryDrawer;
