import { VIEW_SIZE, USER_LANGUAGE, USER_THEME, GAME_MAP } from '../remix/state';
import { CHAIN_GAME, CHAIN_PLAYER } from 'chain/hooks/state';

export const initialState = {
  [VIEW_SIZE]: {},
  [USER_LANGUAGE]: 'en',
  [USER_THEME]: 'gold',
  [GAME_MAP]: [],
  [CHAIN_GAME]: undefined,
  [CHAIN_PLAYER]: undefined,
};
