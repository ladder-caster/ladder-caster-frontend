import React, { useRef, useMemo, useEffect } from 'react';
import {
  _drawer,
  _container,
  _background,
  _gradient,
  _shadow,
} from './Drawer.styled';
import { AnimateDrawer } from './animations/AnimateDrawer';
import { useClickOutside } from 'core/hooks/useClickOutside';
import {
  DRAWER_ACTIVE,
  EQUIP_ITEM,
  MODAL_ACTIVE,
  UNEQUIP_ITEM,
} from 'core/mesh/state';
import { nanoid } from 'nanoid';
import { useActions } from '../../../actions';
import usePrevious from 'core/hooks/usePrevious';
import { useMesh } from 'core/state/mesh/useMesh';

const Drawer = ({ children, height }) => {
  const { closeDrawer } = useActions();
  const [drawer] = useMesh(DRAWER_ACTIVE);
  const [modal] = useMesh(MODAL_ACTIVE);
  const [, setEquip] = useMesh(EQUIP_ITEM);
  const [, setUnequip] = useMesh(UNEQUIP_ITEM);
  const prevDrawer = usePrevious(drawer);
  const container_ref = useRef();
  const key = useMemo(() => nanoid(), [drawer]);

  useClickOutside(
    container_ref,
    () => drawer?.type && !modal?.type && closeDrawer(),
  );

  const childrenWProps = useMemo(
    () =>
      React.Children.map(
        children,
        (child) => child && React.cloneElement(child, { key, drawer }),
      ),
    [drawer],
  );

  useEffect(() => {
    if (!prevDrawer && drawer) {
      setEquip('');
      setUnequip('');
    }
  }, [drawer]);

  return (
    <_drawer>
      <_gradient>
        <_shadow />
      </_gradient>
      <AnimateDrawer empty={!children} active={drawer} height={height}>
        <_container ref={container_ref}>
          <_background>{childrenWProps}</_background>
        </_container>
      </AnimateDrawer>
    </_drawer>
  );
};

export default Drawer;
