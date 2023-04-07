import React, { useRef } from 'react';
import {
  _info,
  _equip,
  _equipment,
  _image,
  _text,
  _visual,
  _wrapper,
  _mint,
  _odds,
  _burn,
} from './Info.styled';
import Item from '../item/Item';
import { AnimateButton } from '../button/animations/AnimateButton';
import Attributes from '../../views/game/inventory/drawer/attributes/Attributes';
import { useTranslation } from 'react-i18next';
import { useSize } from 'core/hooks/useSize';
import { useMesh } from 'core/state/mesh/useMesh';
import {
  DRAWER_CONTEXT,
  ITEM_BOOK,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
} from 'core/mesh/state';
import { useActions } from '../../../actions';
import Power from '../power/Power';
import { IconDice } from 'design/icons/dice.icon';

const Info = ({ item, caster }) => {
  const { t } = useTranslation();
  const {
    unequipConfirm,
    chooseEquip,
    castSpell,
    confirmMint,
    modalBurn,
    closeDrawer,
  } = useActions();
  const [context] = useMesh(DRAWER_CONTEXT);
  const image_ref = useRef();
  const { width } = useSize(image_ref);
  const equip = context?.equip;
  const unequip = caster && context?.unequip;

  const odds = {
    [RARITY_COMMON]: t('modal.spell.odds.common'),
    [RARITY_RARE]: t('modal.spell.odds.rare'),
    [RARITY_EPIC]: t('modal.spell.odds.epic'),
    [RARITY_LEGENDARY]: t('modal.spell.odds.legendary'),
  }[item?.rarity];

  const isSpellbook = item?.type === ITEM_BOOK;
  const commonItem = item?.rarity === RARITY_COMMON;
  const mint = () => {
    if (commonItem) {
      return;
    }
    confirmMint(item, caster);
  };
  return (
    <_info>
      <_visual>
        <_image ref={image_ref} $height={width}>
          <Item small item={item} />
        </_image>
        <Power item={item} height={width} />
      </_visual>
      <_equipment>
        {!isSpellbook ? (
          <AnimateButton active key={'button-equip-button'}>
            <_equip
              key={'button-equip-item'}
              onClick={() => {
                isSpellbook
                  ? castSpell(item, caster)
                  : unequip
                  ? unequipConfirm(item, caster)
                  : chooseEquip(item);
              }}
            >
              {isSpellbook
                ? t('item.cast')
                : unequip
                ? t('item.remove')
                : t('item.equip')}
            </_equip>
          </AnimateButton>
        ) : null}
        <_mint onClick={mint} disabled={commonItem}>
          {t('item.mint')}
        </_mint>
        <_burn
          onClick={() => {
            closeDrawer();
            modalBurn(item);
          }}
        >
          {t('item.burn')}
        </_burn>
        {isSpellbook && (
          <_odds>
            <IconDice />
            <span>{odds}</span>
          </_odds>
        )}
      </_equipment>
      <_wrapper $spellbook={isSpellbook}>
        <Attributes spell={isSpellbook} info={item} />
      </_wrapper>
    </_info>
  );
};

export default Info;
