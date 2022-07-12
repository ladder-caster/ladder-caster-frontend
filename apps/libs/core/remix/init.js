import { TYPE_RES3, TYPE_RES1, TYPE_RES2, SIDE_BUY } from './state';
import { TAB_MINT, TAB_WALLET } from './tabs';
import {
  COIN_EMBA,
  COIN_FRO,
  COIN_LADA,
  COIN_LAVA,
  COIN_POSO,
  COIN_ROOT,
  COIN_TORM,
  COIN_USDC,
} from './coins';

export const INIT_STATE_BOOST = {
  [TYPE_RES2]: 0,
  [TYPE_RES1]: 0,
  [TYPE_RES3]: 0,
};

export const INIT_STATE_REDEEM = {
  tab: TAB_MINT,
};

export const INIT_STATE_WALLET = {
  tab: TAB_WALLET,
};

export const INIT_STATE_STAKING = {
  view: TAB_STAKING_HOME,
};

export const INIT_STATE_TRADE = {
  side: SIDE_BUY,
  base: COIN_USDC,
  quote: COIN_LADA,
  coins: {
    [COIN_LADA]: {
      symbol: COIN_LADA,
      name: 'LadderCaster',
    },
    [COIN_POSO]: {
      symbol: COIN_POSO,
      name: 'Poison',
    },
    [COIN_LAVA]: {
      symbol: COIN_LAVA,
      name: 'Lava',
    },
    [COIN_TORM]: {
      symbol: COIN_TORM,
      name: 'Storm',
    },
  },
  fiat: {
    [COIN_USDC]: {
      symbol: COIN_USDC,
      name: 'USD Coin',
    },
  },
};
