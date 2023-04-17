import React, { useRef, useMemo } from 'react';
import {
  _item,
  _background,
  _float,
  _selected,
  _level,
  _overlay,
  _checkmark,
  _overview,
  _attribute,
  _image,
  _row,
} from './Item.styled';
import { useSize } from 'core/hooks/useSize';
import NFT from '../nft/NFT';
import {
  ITEM_BOOK,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
} from 'core/mesh/state';
import IconAttribute from '../types/icons/IconAttribute';
import { IconAnvil } from '../../../../libs/design/icons/anvil.icon';

const commonImg = require('../../../../libs/design/assets/common.png');
const rareImg = require('../../../../libs/design/assets/rare.png');
const epicImg = require('../../../../libs/design/assets/epic.png');
const legendaryImg = require('../../../../libs/design/assets/legendary.png');

const Item = ({ item, grid, small, craft, selected, callback, all }) => {
  const materials_ref = useRef();
  const { width } = useSize(materials_ref);

  const bgImg = useMemo(() => {
    switch (item?.rarity) {
      case RARITY_COMMON: {
        return <img src={commonImg} />;
      }
      case RARITY_RARE: {
        return <img src={rareImg} />;
      }
      case RARITY_EPIC: {
        return <img src={epicImg} />;
      }
      case RARITY_LEGENDARY: {
        return <img src={legendaryImg} />;
      }
    }
  }, [item?.rarity]);

  return (
    <_item
      $grid={grid}
      $height={width}
      ref={materials_ref}
      onClick={() => callback && callback()}
    >
      <_overlay>
        <_level $rarity={item?.rarity}>
          <span>{item?.level}</span>
        </_level>
      </_overlay>
      {!small && !craft && (
        <_overlay>
          {selected && (
            <_selected $height={width}>
              <_checkmark>
                <IconAnvil />
              </_checkmark>
            </_selected>
          )}
        </_overlay>
      )}
      <_float>
        <_background $equipped $height={width} $rarity={item?.rarity}>
          {bgImg}
        </_background>
      </_float>
      <_image $height={width}>
        {all && (
          <>
            <_row>
              <NFT
                zindex={'item_img'}
                type={ITEM_HAT}
                tier={item?.tier}
                $height={width / 2}
                all
              />
              <NFT
                zindex={'item_img'}
                type={ITEM_STAFF}
                tier={item?.tier}
                $height={width / 2}
                all
              />
            </_row>
            <_row>
              <NFT
                zindex={'item_img'}
                type={ITEM_ROBE}
                tier={item?.tier}
                $height={width / 2}
                all
              />
              <NFT
                zindex={'item_img'}
                type={ITEM_BOOK}
                tier={item?.tier}
                $height={width / 2}
                grid
                all
              />
            </_row>
          </>
        )}
        {!all && (
          <NFT
            zindex={'item_img'}
            type={item?.type}
            tier={item?.tier}
            $height={width}
            small={small}
          />
        )}
      </_image>
      <_overlay $end>
        {!all && !craft && (
          <_overview $small={small} $rarity={item?.rarity}>
            <_attribute $small={small} $attribute={item?.attribute}>
              <IconAttribute attribute={item?.attribute} />
              {+item?.value ? <span>{item?.value}</span> : null}
            </_attribute>
          </_overview>
        )}
      </_overlay>
    </_item>
  );
};

export default Item;
