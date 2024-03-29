import { useMesh } from 'core/state/mesh/useMesh';
import { useEventListener } from 'core/hooks/useEventListener';
import { useSize } from 'core/hooks/useSize';
import {
  DRAWER_ACTIVE,
  DRAWER_CRAFT,
  DRAWER_CRANK,
  DRAWER_INVENTORY,
  DRAWER_SETTINGS,
  DRAWER_SPELLCASTER,
  DRAWER_TOKENS,
  DRAWER_TRADE,
  DRAWER_WALLET,
  VIEW_SIZE,
} from 'core/mesh/state';
import { domMax, LazyMotion } from 'framer-motion';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import CrankDrawer from '../../../shared/crank/CrankDrawer';
import Drawer from '../../../shared/drawer/Drawer';
import SettingsDrawer from '../../../shared/settings/SettingsDrawer';
import TokensDrawer from '../../../shared/tokens/TokensDrawer';
import WalletDrawer from '../../../shared/wallet/WalletDrawer';
import { AnimatedViews } from '../animated/AnimatedViews';
import { _container, _view } from '../Game.styled';
import CraftDrawer from '../inventory/drawer/craft/CraftDrawer';
import InventoryDrawer from '../inventory/drawer/InventoryDrawer';
import Player from '../spellcasters/drawer/Player';
import TradeDrawer from '../../../shared/trade/TradeDrawer';

export const View = () => {
  const view_ref = useRef();
  const view_size = useSize(view_ref);
  const [dh, setDrawerHeight] = useState();
  const [, setViewHeight] = useMesh(VIEW_SIZE);
  const [drawer] = useMesh(DRAWER_ACTIVE);

  useEffect(() => {
    if (view_size?.height) setViewHeight(view_size?.height);
  }, [view_size]);

  // This is resource intensive
  const refreshHeight = () => {
    let next_height = view_ref?.current?.offsetHeight;
    if (next_height && next_height !== dh) setDrawerHeight(next_height);
  };

  useEffect(() => refreshHeight(), []);
  useEventListener('resize', () => refreshHeight());
  useEventListener('scroll', () => refreshHeight());

  const Drawers = useMemo(
    () =>
      ({
        [DRAWER_SETTINGS]: SettingsDrawer,
        [DRAWER_TOKENS]: TokensDrawer,
        [DRAWER_WALLET]: WalletDrawer,
        [DRAWER_INVENTORY]: InventoryDrawer,
        [DRAWER_CRAFT]: CraftDrawer,
        [DRAWER_SPELLCASTER]: Player,
        [DRAWER_CRANK]: CrankDrawer,
        [DRAWER_TRADE]: TradeDrawer,
      }[drawer?.type]),
    [drawer?.type],
  );

  return (
    <_view ref={view_ref}>
      <_container>
        <LazyMotion features={domMax}>
          <AnimatedViews />
        </LazyMotion>
      </_container>
      <Drawer height={dh}>{Drawers ? <Drawers /> : null}</Drawer>
    </_view>
  );
};
