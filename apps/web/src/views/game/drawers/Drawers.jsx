import React, { useMemo } from 'react';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_ACTIVE,
  DRAWER_CRAFT,
  DRAWER_INVENTORY,
  DRAWER_WALLET,
  DRAWER_SETTINGS,
  DRAWER_TOKENS,
  DRAWER_SPELLCASTER,
  DRAWER_CRANK,
} from 'core/remix/state';
import SettingsDrawer from '../../../shared/settings/SettingsDrawer';
import CrankDrawer from '../../../shared/crank/CrankDrawer';
import CraftDrawer from '../inventory/drawer/craft/CraftDrawer';
import WalletDrawer from '../../../shared/wallet/WalletDrawer';
import InventoryDrawer from '../inventory/drawer/InventoryDrawer';
import TokensDrawer from '../../../shared/tokens/TokensDrawer';
import Player from '../spellcasters/drawer/Player';

export const Drawers = () => {
  return Selected;
};
