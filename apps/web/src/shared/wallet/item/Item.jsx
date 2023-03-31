import React, { useRef, useMemo } from 'react';
import { _item, _float, _background } from './Item.styled';
import { _NFT } from '../nft/NFT.styled';
import { useSize } from 'core/hooks/useSize';
import { useActions } from '../../../../actions';
import NFT from 'web/src/shared/nft/NFT';
import { INVERSE_EQUIP_MAP } from 'core/utils/switch';
import {
  ITEM_CHEST,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
} from 'core/remix/state';

const commonImg = require('../../../../../libs/design/assets/common.png');
const rareImg = require('../../../../../libs/design/assets/rare.png');
const epicImg = require('../../../../../libs/design/assets/epic.png');
const legendaryImg = require('../../../../../libs/design/assets/legendary.png');

const Item = ({ item }) => {
  const item_ref = useRef();
  const { width, height } = useSize(item_ref);
  const { chooseMintItem } = useActions();

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
      $grid
      $height={width}
      ref={item_ref}
      onClick={() => chooseMintItem(item)}
    >
      <_float>
        <_background
          $height={height}
          $rarity={item?.rarity}
          $isChest={item?.type === ITEM_CHEST}
        >
          {bgImg}
        </_background>
      </_float>
      <_float>
        <NFT
          height={height}
          type={INVERSE_EQUIP_MAP[item?.type]}
          tier={item?.tier}
        />
      </_float>
    </_item>
  );
};

export default Item;
