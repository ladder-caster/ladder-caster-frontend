import { useState, useCallback } from 'react';
import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_NFTS,
  CHAIN_OLD_CASTERS,
  CHAIN_PLAYER,
  INIT_CHAIN_LOAD,
} from './state';
import { useMesh } from 'core/state/mesh/useMesh';
import { Client } from '../../sdk/src/program/Client';
import { GameContext } from '../../sdk/src/program/GameContext';
import { PlayerContext } from '../../sdk/src/program';
import { GAME_RESOURCES } from 'core/mesh/state';

export const useGame = () => {
  const [game, setGame] = useMesh(CHAIN_GAME);
  const [player, setPlayer] = useMesh(CHAIN_PLAYER);
  const [, setNfts] = useMesh(CHAIN_NFTS);
  const [, setItems] = useMesh(CHAIN_ITEMS);
  const [, setCasters] = useMesh(CHAIN_CASTERS);
  const [, setOldCasters] = useMesh(CHAIN_OLD_CASTERS);
  const [, setResources] = useMesh(GAME_RESOURCES);
  const [, setInitLoading] = useMesh(INIT_CHAIN_LOAD);
  const [error, setError] = useState();
  const [waiting, setWaiting] = useState(false);

  const request = useCallback(
    async (client: Client) => {
      try {
        setWaiting(true);

        if (client) {
          const gameContext = new GameContext();

          const next_game = await gameContext.getGameAccount();

          setGame(next_game);

          const playerContext = new PlayerContext();
          try {
            setPlayer(await playerContext.getPlayer());
          } catch (e) {
            console.log(e);
          }

          try {
            setResources(await playerContext.getResources());
            setItems(await playerContext.getInventory());
            setCasters(await playerContext.getCasters());
            setOldCasters(await playerContext.getPreSeasonCasters());
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {
        console.log(e);
        setError(e);
      } finally {
        setWaiting(false);
        setInitLoading(false);
      }
    },
    [setPlayer, setResources, setItems, setCasters, setNfts, setGame],
  );

  return {
    player,
    game,
    waiting,
    error,
    getGame: (program) => {
      setWaiting(true);
      return request(program);
    },
  };
};
