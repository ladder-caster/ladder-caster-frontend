import { useRemix } from 'core/hooks/remix/useRemix';
import { useEventListener } from 'core/hooks/useEventListener';
import { useSize } from 'core/hooks/useSize';
import {
  DRAWER_ACTIVE,
  DRAWER_CRAFT,
  DRAWER_CRANK,
  DRAWER_INVENTORY,
  DRAWER_SETTINGS,
  DRAWER_SPELLCASTER,
  DRAWER_TOKENS, DRAWER_TRADE,
  DRAWER_WALLET,
  VIEW_SIZE,
} from 'core/remix/state';
import { domMax, LazyMotion } from 'framer-motion';
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
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
  const [, setViewHeight] = useRemix(VIEW_SIZE);
  const [drawer] = useRemix(DRAWER_ACTIVE);

  useEffect(() => {
    if (view_size?.height) setViewHeight(view_size?.height);
  }, [view_size]);

  const refreshHeight = () => {
    let next_height = view_ref?.current?.offsetHeight;
    if (next_height && next_height !== dh) setDrawerHeight(next_height);
  };

  useLayoutEffect(() => refreshHeight(), []);
  useEventListener('resize', () => refreshHeight());
  useEventListener('scroll', () => refreshHeight());
  
  const Drawers = {
    [DRAWER_SETTINGS]: SettingsDrawer,
    [DRAWER_WALLET]: WalletDrawer,
    [DRAWER_TOKENS]: TokensDrawer,
    [DRAWER_INVENTORY]: InventoryDrawer,
    [DRAWER_CRAFT]: CraftDrawer,
    [DRAWER_SPELLCASTER]: Player,
    [DRAWER_CRANK]: CrankDrawer,
    [DRAWER_TRADE]: TradeDrawer
  }[drawer?.type];

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
