import {
  CHANGE_TILE,
  GIVE_ITEM,
  GIVE_LADA,
  GIVE_RESOURCES,
  INST_CLAIM_ALL,
  INST_COMMIT_CRAFT,
  INST_COMMIT_LOOT,
  INST_COMMIT_MOVE,
  INST_COMMIT_SPELL,
  INST_CRANK,
  INST_EQUIP,
  INST_INIT_CASTER,
  INST_INIT_LADA_ACCOUNT,
  INST_INIT_PLAYER,
  INST_MANUAL_RES_BURN,
  INST_MINT_NFT,
  INST_OPEN_CHEST,
  INST_REDEEM_ACTION,
  INST_UNEQUIP,
  INST_UPGRADE,
  INST_PLACE_ORDER,
  INST_CANCEL_ORDER,
  INST_PRESTIGE_CASTER,
  INST_SETTLE_FUNDS,
} from './rpc';
import { WALLET_AUTO_CONNECT, WALLET_DISCONNECT } from './state';

export const fetching = {
  [INST_INIT_PLAYER]: 'init.player',
  [INST_INIT_LADA_ACCOUNT]: 'init.lada_account',
  [INST_INIT_CASTER]: 'init.caster',
  [INST_OPEN_CHEST]: 'action.open_chest',
  [INST_MANUAL_RES_BURN]: 'action.burn_resources',
  [INST_COMMIT_MOVE]: 'action.move',
  [INST_COMMIT_CRAFT]: 'action.craft',
  [INST_COMMIT_SPELL]: 'action.spell',
  [INST_COMMIT_LOOT]: 'action.loot',
  [INST_REDEEM_ACTION]: 'action.redeem',
  [INST_EQUIP]: 'action.equip',
  [INST_UNEQUIP]: 'action.unequip',
  [INST_CRANK]: 'action.crank',
  [GIVE_LADA]: 'test.lada',
  [GIVE_RESOURCES]: 'test.resources',
  [GIVE_ITEM]: 'test.item',
  [CHANGE_TILE]: 'test.tile',
  [WALLET_AUTO_CONNECT]: 'auto.connect',
  [WALLET_DISCONNECT]: 'auto.disconnect',
  [INST_MINT_NFT]: 'action.mint',
  [INST_PRESTIGE_CASTER]: 'action.prestige',
  [INST_CLAIM_ALL]: 'action.claim.all',
  [INST_UPGRADE]: 'action.upgrade',
  [INST_PLACE_ORDER]: 'action.place_order',
  [INST_SETTLE_FUNDS]: 'action.settle',
  [INST_CANCEL_ORDER]: 'action.cancel_order',
};
