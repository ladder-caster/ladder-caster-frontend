import React, { useRef, useMemo } from 'react';
import { _item, _float, _background } from './Item.styled';
import { useTranslation } from 'react-i18next';
import { AnimateSlide } from '../../../animations/AnimateSlide';
import NFT from '../../../../nft/NFT';
import { INVERSE_EQUIP_MAP } from 'core/utils/switch';
import {
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
} from 'core/mesh/state';
import {
  _attribute,
  _level,
  _overlay,
  _overview,
} from '../../../../item/Item.styled';
import IconAttribute from '../../../../types/icons/IconAttribute';

const commonImg = require('../../../../../../../libs/design/assets/common.png');
const rareImg = require('../../../../../../../libs/design/assets/rare.png');
const epicImg = require('../../../../../../../libs/design/assets/epic.png');
const legendaryImg = require('../../../../../../../libs/design/assets/legendary.png');

const Item = ({ index, count, info, height }) => {
  const { t } = useTranslation();
  const item_ref = useRef();
  const active = index === count;
  const prev = index === count - 1;
  const next = index === count + 1;

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
    <AnimateSlide index={index} active={active} prev={prev} next={next}>
      <_item ref={item_ref} $width={100} $active={active}>
        <_overlay>
          <_level $rarity={info?.rarity}>
            <span>{info?.level}</span>
          </_level>
        </_overlay>
        <NFT
          zindex={'item_img'}
          height={height}
          type={info?.type}
          tier={info?.tier}
        />
        <_float>
          <_float>
            <_background $height={height} $rarity={info?.rarity}>
              {bgImg}
            </_background>
          </_float>
        </_float>
        <_overlay $end>
          <_overview $rarity={info?.rarity}>
            <_attribute $attribute={info?.attribute}>
              <IconAttribute attribute={info?.attribute} />
            </_attribute>
          </_overview>
        </_overlay>
      </_item>
    </AnimateSlide>
  );
};

export default Item;
