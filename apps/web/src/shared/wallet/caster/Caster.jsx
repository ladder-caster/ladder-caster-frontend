import React, { useRef } from 'react';
import {
  _caster,
  _level,
  _float,
  _overlay,
  _img,
  _background,
} from './Caster.styled';
import { _NFT } from '../nft/NFT.styled';
import { useSize } from 'core/hooks/useSize';
import { useActions } from '../../../../actions';
import NFT from 'web/src/shared/nft/NFT';
import { INVERSE_EQUIP_MAP } from 'core/utils/switch';

const Caster = ({ caster }) => {
  const item_ref = useRef();
  const { width, height } = useSize(item_ref);
  const { chooseMintCaster } = useActions();
  const src = require('../../../../../libs/design/assets/wizard.png');

  return (
    <_caster
      $grid
      $height={width}
      ref={item_ref}
      onClick={() => chooseMintCaster(caster)}
    >
      <_overlay>
        <_level>
          <span>{caster?.level}</span>
        </_level>
      </_overlay>
      <_float>
        <_background $height={width} />
      </_float>
      <_img src={src} alt={'Wizard NFT'} $height={width} />
    </_caster>
  );
};

export default Caster;
