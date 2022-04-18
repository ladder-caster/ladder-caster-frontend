import React, { useRef, useMemo } from 'react';
import { _item, _float, _background } from './Item.styled';
import { useSize } from 'core/hooks/useSize';
import NFT from 'web/src/shared/nft/NFT';
import { INVERSE_EQUIP_MAP } from 'core/utils/switch';
import {
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
} from 'core/remix/state';
import {
  _attribute,
  _level,
  _overlay,
  _overview,
} from '../../../../shared/item/Item.styled';
import IconAttribute from '../../../../shared/types/icons/IconAttribute';

const commonImg = require('../../../../../../libs/design/assets/common.png');
const rareImg = require('../../../../../../libs/design/assets/rare.png');
const epicImg = require('../../../../../../libs/design/assets/epic.png');
const legendaryImg = require('../../../../../../libs/design/assets/legendary.png');

const Item = ({ info, equipped }) => {
  const item_ref = useRef();
  const { height } = useSize(item_ref);

  const bgImg = useMemo(() => {
    switch (info?.rarity) {
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
  }, [info?.rarity]);

  return (
    <_item ref={item_ref}>
      <_float>
        <_background
          $equipped={equipped}
          $height={height}
          $rarity={info?.rarity}
        >
          {bgImg}
        </_background>
      </_float>
      <_float>
        <NFT
          height={height}
          type={INVERSE_EQUIP_MAP[info?.type]}
          tier={info?.tier}
        />
      </_float>
      <_overlay $end>
        <_overview $rarity={info?.rarity}>
          <_level $rarity={info?.rarity}>
            <span>{info?.level}</span>
          </_level>
          <_attribute $attribute={info?.attribute}>
            <IconAttribute attribute={info?.attribute} />
          </_attribute>
        </_overview>
      </_overlay>
    </_item>
  );
};

export default Item;
