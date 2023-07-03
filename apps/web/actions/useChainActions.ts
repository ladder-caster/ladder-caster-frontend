import { useMesh } from 'core/state/mesh/useMesh';
import {
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
  GAME_CONFIRM,
  MODAL_ACTIVE,
  EQUIP_ITEM,
  UNEQUIP_ITEM,
  GAME_RESOURCES,
  TYPE_RES1,
  TYPE_RES2,
  TYPE_RES3,
  GAME_SPELLCASTERS,
  CREATE_MUTATION,
  USER_PHASE,
  PHASE_REWARDS,
  GAME_MAP,
  ATTRIBUTE_RES1,
  ATTRIBUTE_RES2,
  ATTRIBUTE_RES3,
  RARITY_COMMON,
  MODAL_BURN,
  SIDE_BUY,
  TRADE_ORDERBOOK,
  SIDE_SELL,
} from 'core/mesh/state';
import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_PLAYER,
  CHAIN_OLD_CASTERS,
} from 'chain/hooks/state';
import { COINS } from 'core/utils/markets';
import { floorPrice, decimalsToFloat } from 'core/utils/numbers';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import {
  CasterContext,
  GameContext,
  PlayerContext,
  Caster,
  SerumContext,
} from 'sdk/src/program';
import { Market } from '@project-serum/serum';
import * as anchor from '@project-serum/anchor';
import {
  INST_INIT_PLAYER,
  INST_COMMIT_CRAFT,
  INST_COMMIT_LOOT,
  INST_COMMIT_MOVE,
  INST_COMMIT_SPELL,
  INST_CRANK,
  INST_EQUIP,
  INST_MANUAL_RES_BURN,
  INST_MINT_NFT,
  INST_OPEN_CHEST,
  INST_REDEEM_ACTION,
  INST_UNEQUIP,
  INST_BURN_NFT,
  INST_PRESTIGE_CASTER,
  INST_PLACE_ORDER,
  INST_CANCEL_ORDER,
  INST_INIT_CASTER,
  INST_CLAIM_ALL,
} from 'core/mesh/rpc';
import { INIT_STATE_BOOST, INIT_STATE_REDEEM } from 'core/mesh/init';
import { find, filter } from 'lodash';
import { PublicKey } from '@solana/web3.js';
import { findMarket } from 'core/utils/markets';
import { TxStates, useMutation } from 'sdk/src/hooks/useMutations';

export const useChainActions = () => {
  const { t } = useTranslation();
  const [, setModal] = useMesh(MODAL_ACTIVE);
  const [drawer, setDrawer] = useMesh(DRAWER_ACTIVE);
  const [context, setContext] = useMesh(DRAWER_CONTEXT);
  const [, setPhase] = useMesh(USER_PHASE);
  const [, setEquip] = useMesh(EQUIP_ITEM);
  const [, setUnequip] = useMesh(UNEQUIP_ITEM);
  const [confirm, setConfirm] = useMesh(GAME_CONFIRM);
  const [, setMutation] = useMesh(CREATE_MUTATION);
  const [client] = useMesh(CHAIN_LOCAL_CLIENT);
  const [, setPlayer] = useMesh(CHAIN_PLAYER);
  const [game, setGame] = useMesh(CHAIN_GAME);
  const [items, setItems] = useMesh(CHAIN_ITEMS);
  const [casters, setCasters] = useMesh(CHAIN_CASTERS);
  const [oldCasters] = useMesh(CHAIN_OLD_CASTERS);
  const [, setResources] = useMesh(GAME_RESOURCES);
  const [spellcasters] = useMesh(GAME_SPELLCASTERS);
  const [orderbook, setOrderbook] = useMesh(TRADE_ORDERBOOK);
  const [board] = useMesh(GAME_MAP);
  const { handleState } = useMutation();

  const fetchCaster = async () => {
    setCasters(await new PlayerContext().getCasters());
  };
  const fetchResources = async () => {
    setResources(await new PlayerContext().getResources());
  };
  const fetchItems = async () => {
    setItems(await new PlayerContext().getInventory());
  };
  const fetchPlayer = async () => {
    setPlayer(await new PlayerContext().getPlayer());
  };
  const fetchGame = async () => {
    setGame(await new GameContext().getGameAccount());
  };

  const fetchOrder = async () => {
    const playerContext = new PlayerContext();
    setResources(playerContext.getResources());

    const pair = findMarket(context?.base, context?.quote);
    const market = `${pair?.base}/${pair?.quote}`;
    const nextOrderbook = await getBidsAsks(pair);
    setOrderbook({ ...orderbook, [market]: { ...nextOrderbook, pair } });
  };

  const claimRewards = async (caster) => {
    const casterContext = new CasterContext(
      find(
        casters,
        (match) => match?.publicKey?.toString() === caster?.publicKey,
      ),
    );

    const onConfirmation = async () => {
      fetchCaster();
      fetchItems();
      fetchResources();
    };

    return await handleState(
      await casterContext.casterRedeemAction(),
      INST_REDEEM_ACTION,
      {
        onConfirmation,
        onError: async (error: string) => {
          if (error.includes('Transaction too large'))
            return await handleState(
              await casterContext.fallbackRedeem(),
              INST_REDEEM_ACTION,
              {
                onConfirmation,
                atomicTransactions: true,
              },
            );
        },
      },
    );
  };

  const lootResources = async (caster) => {
    if (caster?.last_loot < game?.turnInfo?.turn) {
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      return await handleState(
        await casterContext.casterCommitLoot(),
        INST_COMMIT_LOOT,
        { onConfirmation: fetchCaster },
      );
    }
  };

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

  const confirmBurn = async (item) => {
    setModal('');
    const playerContext = new PlayerContext();

    if (item || context?.item) {
      const match_item = item ?? context?.item;
      return await handleState(
        await playerContext.manualItemBurn(
          new PublicKey(match_item?.publicKey),
        ),
        INST_BURN_NFT,
        { onConfirmation: fetchItems },
      );
    }
  };
  return {
    confirmBurn,
    async nextTurn() {
      setDrawer('');
      setContext('');

      await handleState(await new GameContext().crank(), INST_CRANK, {
        onConfirmation: async () => {
          fetchGame();
          fetchCaster();
          setPhase(PHASE_REWARDS);
        },
      });
    },
    async openChest(chest) {
      setDrawer('');
      setContext('');
      setConfirm({});

      return await handleState(
        await new PlayerContext().openChest(
          find(
            items,
            (match) => match?.publicKey?.toString() === chest?.publicKey,
          ),
        ),
        INST_OPEN_CHEST,
        { onConfirmation: fetchItems },
      );
    },
    async modalBurn(item) {
      if (localStorage.getItem('hide_burn_modal') === 'true') {
        await confirmBurn(item);
        return;
      }
      setModal({ active: true, type: MODAL_BURN, item });
    },
    async lootResources(caster) {
      if (caster?.last_loot < game?.turnInfo?.turn) {
        setModal('');
        setDrawer('');
        setContext('');

        await lootResources(caster);
      }
    },
    async moveToTile(caster) {
      setModal('');
      setDrawer('');
      setContext('');
      setConfirm({});

      const col = confirm?.position.slice(0, 1);
      const row = +confirm?.position.slice(1, confirm?.position.length);

      return await handleState(
        await new CasterContext(
          find(
            casters,
            (match) => match?.publicKey?.toString() === caster?.publicKey,
          ),
        ).casterCommitMove(
          row - 1,
          ['a', 'b', 'c'].findIndex((colLetter) => colLetter === col),
        ),
        INST_COMMIT_MOVE,
        { onConfirmation: fetchCaster },
      );
    },
    async redeemReward(caster) {
      setModal('');
      setDrawer('');
      setContext('');

      await claimRewards(caster);
    },
    async equipItem(item = context?.item, caster = context?.caster) {
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      setContext('');
      setDrawer('');
      setEquip('');
      setUnequip('');
      setModal('');

      return await handleState(
        await casterContext.equipItem(items[item.id]),
        INST_EQUIP,
        {
          onConfirmation: async () => {
            fetchCaster();
            fetchItems();
          },
        },
      );
    },
    async unequipItem() {
      const item = context?.item;
      const caster = context?.caster;
      try {
        const casterContext = new CasterContext(
          find(
            casters,
            (match) => match?.publicKey?.toString() === caster?.publicKey,
          ),
        );

        setModal('');
        setContext({
          ...context,
          confirm: false,
          unequip: false,
          back: undefined,
        });

        return await handleState(
          await casterContext.unequipItem(
            find(
              casters,
              (match) => match?.publicKey?.toString() === caster?.publicKey,
            )?.modifiers?.[item.type],
          ),
          INST_UNEQUIP,
          {
            onConfirmation: async () => {
              fetchCaster();
              fetchItems();
            },
          },
        );
      } catch (e) {
        console.log(e);
      }
    },
    async castSpell(spell, caster) {
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      setEquip('');
      setUnequip('');
      setModal('');

      return await handleState(
        await casterContext.castSpell(items[spell.id]),
        INST_COMMIT_SPELL,
        {
          onConfirmation: async () => {
            fetchCaster();
            fetchItems();
          },
        },
      );
    },
    async craftItem() {
      const materials = context?.materials || [];
      const caster = context?.caster;
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      setDrawer('');
      setModal('');
      setContext('');

      return await handleState(
        await casterContext.casterCommitCraft(
          find(
            items,
            (match) =>
              match?.publicKey?.toString() === materials?.[0]?.publicKey,
          ),
          find(
            items,
            (match) =>
              match?.publicKey?.toString() === materials?.[1]?.publicKey,
          ),
          find(
            items,
            (match) =>
              match?.publicKey?.toString() === materials?.[2]?.publicKey,
          ),
        ),
        INST_COMMIT_CRAFT,
        {
          onConfirmation: async () => {
            fetchCaster();
            fetchItems();
          },
        },
      );
    },
    async burnResourcesForXP() {
      const caster = find(spellcasters, (caster) => caster.id === drawer?.id);
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      const resources = [
        {
          itemFeature: { [ATTRIBUTE_RES1]: {} },
          amount: context?.[TYPE_RES1],
        },
        {
          itemFeature: { [ATTRIBUTE_RES2]: {} },
          amount: context?.[TYPE_RES2],
        },
        {
          itemFeature: { [ATTRIBUTE_RES3]: {} },
          amount: context?.[TYPE_RES3],
        },
      ];

      setContext(INIT_STATE_BOOST);
      setDrawer('');
      setModal('');

      return await handleState(
        await casterContext.bulkManualResourceBurn(resources),
        INST_MANUAL_RES_BURN,
        { onConfirmation: fetchResources },
      );
    },

    async buyCaster(count = 1) {
      const casterContext = new CasterContext();

      return await handleState(
        await casterContext.initCaster(count),
        INST_INIT_CASTER,
        {
          onConfirmation: async () => {
            fetchCaster();
            fetchResources();
          },
        },
      );
    },
    async redeemNFT() {
      const playerContext = new PlayerContext();

      setContext(INIT_STATE_REDEEM);
      setModal('');

      const transactionBuilder = async () => {
        if (
          context?.nft?.data?.image ===
          'https://arweave.net/9KF_5408KszsFlJpd0ZLheGfxOGSiw4QuGhD9oGfdMQ'
        ) {
          return await playerContext.redeemNFTTwinPack(
            new anchor.web3.PublicKey(context?.nft?.mint),
          );
        } else if (context?.nft?.data.name === 'Caster') {
          return await playerContext.redeemNFTCaster(
            new anchor.web3.PublicKey(context?.nft?.mint),
          );
        } else {
          return await playerContext.redeemNFTItem(
            new anchor.web3.PublicKey(context?.nft?.mint),
          );
        }
      };

      return await handleState(await transactionBuilder(), INST_MINT_NFT, {
        onConfirmation: async () => {
          fetchPlayer();
          fetchCaster();
          fetchItems();
        },
      });
    },
    async confirmMint(item, caster) {
      if (
        item?.rarity === RARITY_COMMON ||
        context?.item?.rarity === RARITY_COMMON
      ) {
        setMutation({
          id: nanoid(),
          state: TxStates.ERROR,
          text: {
            error: t('error.mint.item.tier_too_low'),
          },
        });
        return;
      }
      const playerContext = new PlayerContext();

      setContext({
        ...context,
        caster: undefined,
        item: item || undefined,
      });

      if (caster || context?.caster) {
        return await handleState(
          await playerContext.mintNFTCaster(casters[context?.caster?.index]),
          INST_MINT_NFT,
          {
            onConfirmation: async () => {
              fetchPlayer();
              fetchCaster();
            },
          },
        );
      } else if (item || context?.item) {
        const match_item = item || context?.item;
        return await handleState(
          await playerContext.mintNFTItem(
            find(
              items,
              (match) => match?.publicKey?.toString() === match_item?.publicKey,
            ),
          ),
          INST_MINT_NFT,
          {
            onConfirmation: async () => {
              fetchPlayer();
              fetchItems();
            },
          },
        ).then(async () => {
          if (caster || context?.caster)
            setCasters(await playerContext.getCasters());
        });
      }
    },
    async initPlayer() {
      const playerContext = new PlayerContext();
      //Do not remove for testing
      // console.log(client.program.provider.wallet.publicKey.toString());

      await handleState(await playerContext.initPlayer(), INST_INIT_PLAYER, {
        onConfirmation: fetchPlayer,
      });
    },
    async fullRefresh() {
      await Promise.all([
        fetchPlayer(),
        fetchItems(),
        fetchCaster(),
        fetchResources(),
        fetchGame(),
      ]);
    },
    async refreshResources() {
      await fetchResources();
    },
    async refreshGame() {
      await fetchGame();
    },
    async claimAllRewards() {
      const redeemableCasters = filter(spellcasters, (caster) => {
        return caster?.turnCommit < game?.turnInfo?.turn;
      })
        .map((caster) => {
          return find(casters, (c: Caster) => {
            return c.publicKey?.toString() === caster.publicKey;
          });
        })
        //Filter out caster with spells and more actions
        //It causes crashing
        .filter((caster) => {
          return (
            (caster.turnCommit?.actions.actionOrder.filter(
              (action: number) => action !== 0,
            ).length < 2 &&
              caster.turnCommit?.actions.spell) ||
            !caster.turnCommit?.actions.spell
          );
        });

      const casterInstance = new CasterContext();
      return await handleState(
        await casterInstance.casterRedeemAllActions(redeemableCasters),
        INST_CLAIM_ALL,
        {
          onConfirmation: async () => {
            fetchCaster();
            fetchItems();
            fetchResources();
          },
        },
      );
    },
    async prestigeCaster(casterPK) {
      const casterContext = new CasterContext(
        find(oldCasters, (match) => match?.publicKey?.toString() === casterPK),
      );
      return await handleState(
        await casterContext.prestigeCaster(),
        INST_PRESTIGE_CASTER,
        {
          onConfirmation: async () => {
            fetchResources();
            fetchCaster();
          },
        },
      );
    },
    async fixAccount() {
      const playerContext = new PlayerContext();

      await handleState(await playerContext.initPlayer(), INST_INIT_PLAYER, {
        onConfirmation: fetchPlayer,
      });
    },

    async switchTradeSymbols() {
      setContext({
        ...context,
        side: context?.side === SIDE_BUY ? SIDE_SELL : SIDE_BUY,
        input: {
          base: context?.input?.quote,
          quote: context?.input?.base,
        },
      });
    },
    async tradeDropdownClick(isBase, symbol) {
      if (isBase) setContext({ ...context, base: symbol });
      else setContext({ ...context, quote: symbol });
    },
    async inputSwap(isBase, value) {
      let input = { ...context?.input };
      const pair = findMarket(context?.base, context?.quote);
      const market = pair?.market;
      let side = context?.side;
      let liquid = false;
      const isBuy = side === SIDE_BUY;
      const isSell = side === SIDE_SELL;
      const orders = orderbook?.[market];

      const asks = orders?.asks;
      const bids = orders?.bids;

      const lowest_ask = +asks?.[0]?.[0];
      const highest_bid = +bids?.[0]?.[0];

      if (isBase) {
        input.base = value;
        if (isBuy)
          input.quote = lowest_ask ? Math.floor(value / lowest_ask) : 0;
        else input.quote = highest_bid ? Math.floor(value * highest_bid) : 0;
        if (input.quote !== 0) liquid = true;
      } else {
        input.quote = value;
        if (isBuy) input.base = lowest_ask ? Math.floor(lowest_ask * value) : 0;
        else input.base = highest_bid ? Math.floor(value / highest_bid) : 0;
        if (input.base !== 0) liquid = true;
      }

      setContext({
        ...context,
        input,
        side,
        liquid,
      });
    },
    async inputOrder(isBase, value) {
      let input = { ...context?.input };
      const pair = findMarket(context?.base, context?.quote);
      const market = pair?.market;
      let side = context?.side;

      if (isBase) {
        const bids = orderbook?.[market]?.bids;
        const asks = orderbook?.[market]?.asks;
        const includes_asks = find(asks, (ask) => +ask[0] === +value);
        const includes_bids = find(bids, (bid) => +bid[0] === +value);

        let lowest_ask = Infinity;
        let highest_bid = 0;
        const decimals = pair?.decimals;
        let valid = +value % Math.pow(1, -decimals) === 0;

        if (includes_bids) side = SIDE_BUY;
        if (includes_asks) side = SIDE_SELL;

        if (!includes_bids && !includes_asks) {
          if (bids?.length > 1) highest_bid = +bids[0][0];
          if (asks?.length > 1) lowest_ask = +asks[0][0];
          if (+value >= lowest_ask && valid) side = SIDE_SELL;
          if (+value <= highest_bid && valid) side = SIDE_BUY;
        }

        if (valid) {
          if (side === SIDE_BUY) {
            // Calculate profit
          }
        }

        input.base = value;
      } else {
        input.quote = value;
      }

      setContext({
        ...context,
        input,
        side,
      });
    },
    getBidsAsks,
    async getOpenOrders(pair, isPersonal = false) {
      const market_id = new PublicKey(pair?.market_id);
      const program_id = new PublicKey(pair?.program_id);

      const market = await Market.load(
        client?.connection,
        market_id,
        {},
        program_id,
      );
      const serumContext = new SerumContext(market);

      return await serumContext.openOrders(isPersonal);
    },
    async placeOrder(pair, side, price, size) {
      const orderType = 'limit';

      const market_id = new PublicKey(pair?.market_id);
      const program_id = new PublicKey(pair?.program_id);
      const market = await Market.load(
        client?.connection,
        market_id,
        {},
        program_id,
      );

      const serumContext = new SerumContext(market);

      setContext({
        ...context,
        input: {
          ...context?.input,
          quote: '',
        },
      });

      return await handleState(
        await serumContext.placeOrder({ side, price, size, orderType }),
        INST_PLACE_ORDER,
        { onConfirmation: fetchOrder },
      );
    },
    async cancelOrder(pair, order) {
      const market_id = new PublicKey(pair?.market_id);
      const program_id = new PublicKey(pair?.program_id);
      const market = await Market.load(
        client?.connection,
        market_id,
        {},
        program_id,
      );

      const serumContext = new SerumContext(market);

      return await handleState(
        await serumContext.cancelOrder(order),
        INST_CANCEL_ORDER,
        {
          onConfirmation: async () => {
            fetchResources();
            fetchOrder();
          },
        },
      );
    },
    async chooseOrderSide(side) {
      if (side !== context?.side)
        setContext({
          ...context,
          side,
        });
    },
    async getFilledOrders(pair) {
      const market_id = new PublicKey(pair?.market_id);
      const program_id = new PublicKey(pair?.program_id);
      const market = await Market.load(
        client?.connection,
        market_id,
        {},
        program_id,
      );

      const serumContext = new SerumContext(market);

      return await serumContext.getFilledOrders();
    },
    async getUnsettledFunds(pair, openOrders) {
      const market_id = new PublicKey(pair?.market_id);
      const program_id = new PublicKey(pair?.program_id);
      const market = await Market.load(
        client?.connection,
        market_id,
        {},
        program_id,
      );

      const serumContext = new SerumContext(market);

      return await serumContext.getUnsettledFunds(openOrders);
    },
    async settleFunds(pair, unsettledFund) {
      const market_id = new PublicKey(pair?.market_id);
      const program_id = new PublicKey(pair?.program_id);
      const market = await Market.load(
        client?.connection,
        market_id,
        {},
        program_id,
      );

      const serumContext = new SerumContext(market);

      return await handleState(
        await serumContext.settleFunds(unsettledFund),
        INST_PLACE_ORDER,
        {
          onConfirmation: async () => {
            fetchOrder();
            fetchResources();
          },
        },
      );
    },
    async swapOrder(pair, side, size) {
      const base_payer = find(COINS, (coin) => coin?.symbol === pair?.base)
        ?.address;
      const quote_payer = find(COINS, (coin) => coin?.symbol === pair?.quote)
        ?.address;

      const orderType = 'ioc';

      const market_id = new PublicKey(pair?.market_id);
      const program_id = new PublicKey(pair?.program_id);
      const market = await Market.load(
        client?.connection,
        market_id,
        {},
        program_id,
      );

      const serumContext = new SerumContext(market);

      setContext({
        ...context,
        input: {
          ...context?.input,
          quote: '',
        },
      });

      const market_name = pair?.market;
      const orders = orderbook?.[market_name];
      const decimals = pair?.decimals;
      let price = 0;

      if (side === SIDE_BUY) {
        const ask_price = orders?.asks?.[0]?.[0];
        if (ask_price) price = floorPrice(ask_price * 3, decimals);
      } else {
        price = decimalsToFloat(decimals);
      }

      if (price) {
        return await handleState(
          await serumContext.placeOrder({ side, price, size, orderType }),
          INST_PLACE_ORDER,
          {
            onConfirmation: async () => {
              fetchResources();
            },
          },
        );
      }
    },
    //TODO: to test
    async unequipAllItems(caster: Caster) {
      if (!caster) return;

      const casterObject = find(
        casters,
        (match) => match?.publicKey?.toString() === caster?.publicKey,
      );
      const casterContext = new CasterContext(casterObject);
      const casterItems: any[] = [];
      const keys = Object.keys(casterObject.modifiers || {}).filter(
        (item) => !['tileColumn', 'tileLevel'].includes(item),
      );
      for (let i = 0; i < keys.length; i++) {
        const item = casterObject.modifiers[keys[i]];
        if (item) {
          casterItems.push(item);
        }
      }

      if (casterItems.length == 0) return;
      await handleState(
        await casterContext.unequipAllItems(casterItems),
        INST_UNEQUIP,
        {
          onConfirmation: async () => {
            fetchItems();
            fetchCaster();
          },
        },
      );
    },
    async redeemCasterWhitelist(caster: Caster) {
      if (!caster) return;

      const casterObject = find(
        casters,
        (match) => match?.publicKey?.toString() === caster?.publicKey,
      );
      const casterContext = new CasterContext(casterObject);

      await handleState(await casterContext.redeemWhitelist(), INST_BURN_NFT, {
        onConfirmation: async () => {
          fetchCaster();
        },
      });
    },
    emptyInputs() {
      setContext({
        ...context,
        input: {
          base: '',
          quote: '',
        },
      });
    },
  };
};
