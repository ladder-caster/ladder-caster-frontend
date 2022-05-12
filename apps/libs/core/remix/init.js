import { TYPE_RES3, TYPE_RES1, TYPE_RES2 } from './state';
import { TAB_MINT, TAB_WALLET } from './tabs';
import { COIN_EMBA, COIN_FRO, COIN_LADA, COIN_ROOT, COIN_USDC } from './coins';

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

export const INIT_STATE_TRADE = {
  base: COIN_USDC,
  quote: COIN_LADA,
  coins: {
    [COIN_USDC]: {
      symbol: COIN_USDC,
      name: 'USD Coin',
    },
    [COIN_LADA]: {
      symbol: COIN_LADA,
      name: 'LadderCaster',
    },
    [COIN_EMBA]: {
      symbol: COIN_EMBA,
      name: 'Ember',
    },
    [COIN_FRO]: {
      symbol: COIN_FRO,
      name: 'Frost',
    },
    [COIN_ROOT]: {
      symbol: COIN_ROOT,
      name: 'Root',
    },
  },
};
