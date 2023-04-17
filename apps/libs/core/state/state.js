import gameConstantsContext from 'sdk/src/program/GameConstantsContext';
import {
  VIEW_SIZE,
  USER_LANGUAGE,
  DRAWER_ACTIVE,
  USER_THEME,
  GAME_MAP,
  EQUIP_ITEM,
  GAME_CONFIRM,
  GAME_INVENTORY,
  GAME_OPTIONS,
  GAME_RESOURCES,
  GAME_SPELL,
  GAME_SPELLCASTERS,
  MODAL_ACTIVE,
  USER_OFFLINE,
  TABS_CHARACTER_ACTIONS,
  TOKENS_ACTIVE,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
  UNEQUIP_ITEM,
  CREATE_MUTATION,
  DRAWER_CONTEXT,
  VIEW_NAVIGATION,
  USER_PHASE,
  WALLET_TYPE,
  GAME_INIT,
  SEEN_PHASE,
  GAME_OLD_SPELLCASTERS,
  GAME_CONSTANTS,
  PRESTIGE_TOGGLE,
  ARWEAVE_UTILS,
  TRADE_ORDERBOOK,
  WEB3AUTH_PROVIDER,
  WEB3AUTH_CLIENT,
  WEB3AUTH_PLUGIN_STORE,
} from '../mesh/state';
import {
  TAB_CHARACTER,
  TAB_WALLET,
  TAB_SWAP,
  TABS_MINT_REDEEM,
  TABS_SWAP_ORDER,
} from '../mesh/tabs';
import {
  CHAIN_GAME,
  CHAIN_PLAYER,
  CHAIN_ITEMS,
  CHAIN_CASTERS,
  CHAIN_OLD_CASTERS,
  CHAIN_LOCAL_CLIENT,
  INIT_CHAIN_LOAD,
  RPC_ERROR,
  CHAIN_NEXT_TURN,
  CHAIN_NFTS,
} from 'chain/hooks/state';
import arweaveUtil from 'sdk/src/utils/ArweaveUtil';

export const initialState = {
  [VIEW_SIZE]: {},
  [USER_LANGUAGE]: 'en',
  [USER_THEME]: 'gold',
  [GAME_MAP]: [],
  [CHAIN_GAME]: undefined,
  [CHAIN_PLAYER]: undefined,
  [CHAIN_ITEMS]: [],
  [CHAIN_CASTERS]: [],
  [CHAIN_OLD_CASTERS]: [],
  [GAME_SPELLCASTERS]: [],
  [GAME_OLD_SPELLCASTERS]: [],
  [CHAIN_LOCAL_CLIENT]: undefined,
  [GAME_INVENTORY]: { items: [], chests: [] },
  [GAME_CONSTANTS]: gameConstantsContext,
  [ARWEAVE_UTILS]: arweaveUtil,
  [GAME_RESOURCES]: {
    [TYPE_RES1]: 0,
    [TYPE_RES2]: 0,
    [TYPE_RES3]: 0,
    lada: 0,
    sol: 0,
    usdc: 0,
  },
  [SEEN_PHASE]: undefined,
  [TRADE_ORDERBOOK]: undefined,
  [INIT_CHAIN_LOAD]: true,
  [GAME_INIT]: undefined,
  [USER_PHASE]: undefined,
  [WALLET_TYPE]: undefined,
  [VIEW_NAVIGATION]: localStorage.getItem('lc-tab'),
  [USER_OFFLINE]: undefined,
  [DRAWER_CONTEXT]: {},
  [RPC_ERROR]: [],
  [CHAIN_NEXT_TURN]: undefined,
  [CHAIN_NFTS]: [],
  [CREATE_MUTATION]: undefined,
  [EQUIP_ITEM]: '',
  [UNEQUIP_ITEM]: '',
  [MODAL_ACTIVE]: {},
  [GAME_CONFIRM]: {},
  [TABS_CHARACTER_ACTIONS]: TAB_CHARACTER,
  [TABS_MINT_REDEEM]: TAB_WALLET,
  [TABS_SWAP_ORDER]: TAB_SWAP,
  [GAME_SPELL]: {},
  [TOKENS_ACTIVE]: '',
  [PRESTIGE_TOGGLE]: localStorage.getItem('hide_prestige') === 'true',
  [WEB3AUTH_PROVIDER]: null,
  [WEB3AUTH_CLIENT]: null,
  [WEB3AUTH_PLUGIN_STORE]: {
    plugins: {},
    addPlugin(name, instance) {
      this.plugins[name] = instance;
    },
    getPlugin(name) {
      return this.plugins[name];
    },
  },
  // TODO: Find purpose
  [GAME_OPTIONS]: {
    base: 1200,
    speed: 120,
    reward: 10,
    bars: 3,
    land: 3,
  },
  [DRAWER_ACTIVE]: '',
};
