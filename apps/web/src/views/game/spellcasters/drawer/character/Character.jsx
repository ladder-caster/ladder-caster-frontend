import React, { useRef } from 'react';
import {
  _character,
  _overall,
  _equipment,
  _power,
  _stats,
} from './Character.styled';
import Equipment from './equipment/Equipment';
import Stats from './stats/Stats';
import { _breakpoint } from '../Player.styled';
import { useMesh } from 'core/state/mesh/useMesh';
import { DRAWER_CONTEXT } from 'core/mesh/state';
import Power from '../../../../../shared/power/Power';
import Info from '../../../../../shared/info/Info';
import { useSize } from 'core/hooks/useSize';

const Character = ({ caster }) => {
  const [context] = useMesh(DRAWER_CONTEXT);
  const equipment_ref = useRef();
  const { width } = useSize(equipment_ref);
  const unequip = !!context?.unequip;

  return (
    <_character>
      {unequip && <Info item={context?.item} caster={caster} />}
      {!unequip && (
        <>
          <_overall>
            <_equipment $height={width} ref={equipment_ref}>
              <Equipment caster={caster} />
            </_equipment>
            <_power>
              <Power progress caster={caster} />
            </_power>
          </_overall>
          <_breakpoint />
          <_stats>
            <Stats caster={caster} grid />
          </_stats>
        </>
      )}
    </_character>
  );
};

export default Character;
