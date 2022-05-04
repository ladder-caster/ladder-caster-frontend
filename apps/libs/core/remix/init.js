import { TYPE_RESOURCE3, TYPE_RESOURCE1, TYPE_RESOURCE2 } from './state';
import { TAB_MINT, TAB_WALLET } from './tabs';

export const INIT_STATE_BOOST = {
  [TYPE_RESOURCE2]: 0,
  [TYPE_RESOURCE1]: 0,
  [TYPE_RESOURCE3]: 0,
};

export const INIT_STATE_REDEEM = {
  tab: TAB_MINT,
};

export const INIT_STATE_WALLET = {
  tab: TAB_WALLET,
};
