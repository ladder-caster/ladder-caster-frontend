import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_PLAYER,
} from 'chain/hooks/state';
import {
  GAME_RESOURCES,
  CREATE_MUTATION,
  TRADE_ORDERBOOK,
  DRAWER_CONTEXT,
} from 'core/remix/state';
import { FETCH_PLAYER, FETCH_CASTERS, FETCH_ORDER } from 'core/remix/rpc';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Caster,
  CasterContext,
  GameContext,
  PlayerContext,
  SerumContext,
} from 'sdk/src/program';
import { useRemix } from 'core/hooks/remix/useRemix';
import remix from 'core/remix';
import { findMarket } from 'core/utils/markets';
import { Market } from '@project-serum/serum';
import { PublicKey } from '@solana/web3.js';

export const useFetchers = () => {
  const { t } = useTranslation();
  const [context] = useRemix(DRAWER_CONTEXT);
  const [orderbook, setOrderbook] = useRemix(TRADE_ORDERBOOK);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [, setGame] = useRemix(CHAIN_GAME);
  const [, setResources] = useRemix(GAME_RESOURCES);
  const [, setMutation] = useRemix(CREATE_MUTATION);
  const [, setCasters] = useRemix(CHAIN_CASTERS);
  const [, setPlayer] = useRemix(CHAIN_PLAYER);
  const [, setItems] = useRemix(CHAIN_ITEMS);

  const fetchPlayer = useCallback(
    async (result, casterInstance: CasterContext | null = null) => {
      if (result && !result?.value?.err) {
        const playerContext = new PlayerContext();

        setResources(await playerContext.getResources());
        if (casterInstance) {
          const nextCaster = await casterInstance.refreshCaster();
          const publicKey = casterInstance.getCasterId();
          if (nextCaster) nextCaster.publicKey = publicKey;
          const nextCasters = remix?.getValue(CHAIN_CASTERS);

          if (nextCaster && publicKey) {
            // Replace
            let updatedCasters = new Map<string, Caster>();
            for (const caster of nextCasters) {
              if (caster.publicKey?.toString() === publicKey?.toString()) {
                updatedCasters.set(caster.publicKey?.toString(), {
                  ...nextCaster,
                });
              } else {
                updatedCasters.set(caster.publicKey?.toString(), {
                  ...caster,
                });
              }
            }
            setCasters(updatedCasters);
          }

          setMutation({
            id: nanoid(),
            rpc: false,
            validator: false,
            success: false,
            error: false,
            done: true,
            text: {
              error: t('error.refresh.caster'),
            },
            FETCH_CASTERS,
          });
        } else {
          setPlayer(await playerContext.getPlayer());
          setItems(await playerContext.getInventory());
        }
      }
      setMutation({
        id: nanoid(),
        rpc: false,
        validator: false,
        success: false,
        error: false,
        done: true,
        text: {
          error: t('error.refresh.player'),
        },
        FETCH_PLAYER,
      });
    },
  );

  const fetchGame = useCallback(async (result) => {
    if (!result.value.err) {
      const gameContext = new GameContext();
      const next_game = await gameContext.getGameAccount();

      setGame(next_game);
    }
  });

  const fetchOrder = useCallback(async (result) => {
    if (result && !result?.value?.err) {
      const playerContext = new PlayerContext();
      setResources(playerContext.getResources());

      const pair = findMarket(context?.base, context?.quote);
      const market = `${pair?.base}/${pair?.quote}`;
      const nextOrderbook = await getBidsAsks(pair);
      setOrderbook({ ...orderbook, [market]: { ...nextOrderbook, pair } });
    }
    setMutation({
      id: nanoid(),
      rpc: false,
      validator: false,
      success: false,
      error: false,
      done: true,
      text: {
        error: t('error.refresh.order'),
      },
      FETCH_ORDER,
    });
  });

  const getBidsAsks = async (pair) => {
    const market_id = new PublicKey(pair?.market_id);
    const program_id = new PublicKey(pair?.program_id);

    const market = await Market.load(
      client?.connection,
      market_id,
      {},
      program_id,
    );
    const serumContext = new SerumContext(market);

    return await serumContext.getBidsAsks();
  };

  return { fetchPlayer, fetchGame, fetchOrder, getBidsAsks };
};
