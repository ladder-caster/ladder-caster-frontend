import React from 'react';
import { useRemix } from 'core/hooks/remix/useRemix';
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
} from 'core/remix/state';
import CraftDrawer from './craft/CraftDrawer';
import CrankDrawer from './crank/CrankDrawer';
import InventoryDrawer from './inventory/InventoryDrawer';
import SettingsDrawer from './settings/SettingsDrawer';
import SpellcasterDrawer from './spellcaster/SpellcasterDrawer';
import TokensDrawer from './tokens/TokensDrawer';
import TradeDrawer from './trade/TradeDrawer';
import WalletDrawer from './wallet/WalletDrawer';

export const Drawers = () => {
  const [drawer] = useRemix(DRAWER_ACTIVE);

  const Selected = {
    [DRAWER_SETTINGS]: SettingsDrawer,
    [DRAWER_WALLET]: WalletDrawer,
    [DRAWER_TOKENS]: TokensDrawer,
    [DRAWER_INVENTORY]: InventoryDrawer,
    [DRAWER_CRAFT]: CraftDrawer,
    [DRAWER_SPELLCASTER]: SpellcasterDrawer,
    [DRAWER_CRANK]: CrankDrawer,
    [DRAWER_TRADE]: TradeDrawer,
  }[drawer?.type];

  if (!Selected) return null;
  return <Selected />;
};
