import { useState, useCallback } from 'react';
import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_NFTS,
  CHAIN_PLAYER,
  INIT_CHAIN_LOAD,
} from './state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { Client } from '../../sdk/src/laddercaster/program/Client';
import { GameContext } from '../../sdk/src/laddercaster/program/GameContext';
import { PlayerContext } from '../../sdk/src/laddercaster/program';
import { GAME_RESOURCES } from 'core/remix/state';

export const useGame = () => {
  const [game, setGame] = useRemix(CHAIN_GAME);
  const [player, setPlayer] = useRemix(CHAIN_PLAYER);
  const [, setNfts] = useRemix(CHAIN_NFTS);
  const [, setItems] = useRemix(CHAIN_ITEMS);
  const [, setCasters] = useRemix(CHAIN_CASTERS);
  const [, setResources] = useRemix(GAME_RESOURCES);
  const [, setInitLoading] = useRemix(INIT_CHAIN_LOAD);
  const [error, setError] = useState();
  const [waiting, setWaiting] = useState(false);

  const request = useCallback(
    async (client: Client) => {
      try {
        setWaiting(true);

        if (client) {
          const gameContext = new GameContext(
            client,
            localStorage.getItem('gamePK'),
          );

          const next_game = await gameContext.getGameAccount();

          setGame(next_game);

          const playerContext = new PlayerContext(
            client,
            client.program.provider.wallet.publicKey,
            localStorage.getItem('gamePK'),
          );

          try {
            setResources(await playerContext.getResources());

            setItems(await playerContext.getInventory());
            setCasters(await playerContext.getCasters());
            setNfts(
              await playerContext.getNFTUris(await playerContext.getNFTS()),
            );
          } catch (e) {
            console.log(e);
          }

          try {
            setPlayer(await playerContext.getPlayer());
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
