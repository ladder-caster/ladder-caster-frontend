import { TYPE_RES3, TYPE_RES1, TYPE_RES2 } from './state';
import { TAB_MINT, TAB_WALLET } from './tabs';

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
