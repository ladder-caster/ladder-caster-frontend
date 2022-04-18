import { TYPE_EARTH, TYPE_FIRE, TYPE_WATER } from './state';
import { TAB_MINT, TAB_WALLET } from './tabs';

export const INIT_STATE_BOOST = {
  [TYPE_WATER]: 0,
  [TYPE_FIRE]: 0,
  [TYPE_EARTH]: 0,
};

export const INIT_STATE_REDEEM = {
  tab: TAB_MINT,
};

export const INIT_STATE_WALLET = {
  tab: TAB_WALLET,
};
