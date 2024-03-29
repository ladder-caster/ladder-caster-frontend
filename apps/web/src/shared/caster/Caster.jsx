import React, { useRef } from 'react';
import {
  _caster,
  _level,
  _overview,
  _overlay,
  _img,
  _cover,
  _name,
  _upgrade,
} from './Caster.styled';
import { useSize } from 'core/hooks/useSize';
import { useActions } from '../../../actions';
import { EDITION_LIMITED } from 'core/mesh/state';

const Caster = ({ caster, grid, small, callback, isOld }) => {
  const caster_ref = useRef();
  const { width } = useSize(caster_ref);
  const { craftChooseCharacter } = useActions();

  const src = isOld
    ? require('../../../../libs/design/assets/old_wizard.png')
    : caster?.edition === EDITION_LIMITED
    ? require('../../../../libs/design/assets/wizard_limited_edition.png')
    : require('../../../../libs/design/assets/wizard.png');
  const onClick = () => {
    if (!isOld && callback) callback();
    else if (!isOld) craftChooseCharacter(caster);
  };
  const caster_hue =
    caster?.hue !== undefined
      ? `hsla(${caster?.hue},60%,34%,100%)`
      : `hsla(360,60%,100%,100%)`;

  return (
    <_caster
      $hue={caster?.hue}
      $grid={grid}
      $height={width}
      ref={caster_ref}
      onClick={onClick}
    >
      <_img $isOld={isOld} src={src} alt={'Wizard NFT'} $height={width} />
      <_overlay>
        <_overview $small={small} $hue={caster?.hue}>
          <_level $small={small} $hue={caster?.hue}>
            <span>{caster?.level}</span>
          </_level>
          <_name $small={small} $hue={caster?.hue}>
            {caster?.publicKey
              ?.substr(caster?.publicKey?.length - 4, 4)
              ?.toUpperCase()}
          </_name>
        </_overview>
        <_cover $hue={caster?.hue} />
      </_overlay>
    </_caster>
  );
};

export default Caster;
