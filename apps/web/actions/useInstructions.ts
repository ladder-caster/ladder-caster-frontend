import {
  GAME_RESOURCES,
  PHASE_REWARDS,
  GAME_CONFIRM,
  USER_PHASE,
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
  MODAL_ACTIVE,
  EQUIP_ITEM,
  UNEQUIP_ITEM,
  GAME_SPELLCASTERS,
  ATTRIBUTE_RES1,
  TYPE_RES1,
  ATTRIBUTE_RES2,
  TYPE_RES2,
  ATTRIBUTE_RES3,
  TYPE_RES3,
  RARITY_COMMON,
  CREATE_MUTATION,
  SIDE_BUY,
  TRADE_ORDERBOOK,
  MODAL_BURN,
} from 'core/remix/state';
import {
  CHAIN_GAME,
  CHAIN_PLAYER,
  CHAIN_CASTERS,
  CHAIN_ITEMS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_OLD_CASTERS,
} from 'chain/hooks/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  INST_INIT_CASTER,
  INST_INIT_PLAYER,
  INST_CRANK,
  INST_OPEN_CHEST,
  INST_REDEEM_ACTION,
  INST_COMMIT_LOOT,
  INST_COMMIT_MOVE,
  INST_EQUIP,
  INST_UNEQUIP,
  INST_COMMIT_SPELL,
  INST_COMMIT_CRAFT,
  INST_MANUAL_RES_BURN,
  INST_MINT_NFT,
  INST_CLAIM_ALL,
  INST_PRESTIGE_CASTER,
  INST_PLACE_ORDER,
  INST_CANCEL_ORDER,
  INST_BURN_NFT,
} from 'core/remix/rpc';
import { filter, find } from 'lodash';
import { PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';
import * as anchor from '@project-serum/anchor';
import {
  Caster,
  CasterContext,
  GameContext,
  PlayerContext,
  SerumContext,
} from 'sdk/src/program';
import { useFetchers } from './useFetchers';
import { useHandler } from './useHandler';
import { INIT_STATE_BOOST, INIT_STATE_REDEEM } from 'core/remix/init';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import { decimalsToFloat, floorPrice } from 'core/utils/numbers';

export const useInstructions = () => {
  const { t } = useTranslation();
  const [context, setContext] = useRemix(DRAWER_CONTEXT);
  const [casters, setCasters] = useRemix(CHAIN_CASTERS);
  const [confirm, setConfirm] = useRemix(GAME_CONFIRM);
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const [, setPlayer] = useRemix(CHAIN_PLAYER);
  const [, setResources] = useRemix(GAME_RESOURCES);
  const [, setPhase] = useRemix(USER_PHASE);
  const [, setModal] = useRemix(MODAL_ACTIVE);
  const [, setEquip] = useRemix(EQUIP_ITEM);
  const [, setUnequip] = useRemix(UNEQUIP_ITEM);
  const [, setMutation] = useRemix(CREATE_MUTATION);
  const [orderbook] = useRemix(TRADE_ORDERBOOK);
  const [oldCasters] = useRemix(CHAIN_OLD_CASTERS);
  const [spellcasters] = useRemix(GAME_SPELLCASTERS);
  const [items] = useRemix(CHAIN_ITEMS);
  const [game] = useRemix(CHAIN_GAME);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const { stateHandler } = useHandler();
  const { fetchPlayer, fetchGame, fetchOrder, getBidsAsks } = useFetchers();

  const closeDrawer = () => {
    setModal('');
    setDrawer('');
    setContext('');
    setConfirm({});
  };

  const burnItemAccount = async (item) => {
    setModal('');
    const playerContext = new PlayerContext();

    if (item || context?.item) {
      const match_item = item ?? context?.item;
      await stateHandler(
        async () => {
          return await playerContext.manualItemBurn(
            new PublicKey(match_item?.publicKey),
          );
        },
        fetchPlayer,
        INST_BURN_NFT,
      );
    }
  };

  return {
    getBidsAsks,
    async fixAccount() {
      const playerContext = new PlayerContext();

      await stateHandler(
        async () => {
          const result = await playerContext.initPlayer();
          return result;
        },
        async () => {
          setPlayer(await playerContext.getPlayer());
        },
        INST_INIT_PLAYER,
      );
    },
    async buyCaster(count = 1) {
      const casterContext = new CasterContext();

      await stateHandler(
        async () => {
          return await casterContext.initCaster(count);
        },
        fetchPlayer,
        INST_INIT_CASTER,
      );
    },
    async initPlayer() {
      const playerContext = new PlayerContext();

      await stateHandler(
        async () => {
          return await playerContext.initPlayer();
        },
        async () => {
          setPlayer(await playerContext.getPlayer());
        },
        INST_INIT_PLAYER,
      );
    },
    async refreshResources() {
      const playerContext = new PlayerContext();
      setResources(await playerContext.getResources());
    },
    async crankTurn() {
      //close before call
      closeDrawer();

      await stateHandler(
        async () => {
          return await new GameContext().crank();
        },
        fetchGame,
        INST_CRANK,
      );

      setCasters(await new PlayerContext().getCasters());
      setPhase(PHASE_REWARDS);
    },
    async prestigeCaster(casterPK) {
      const casterContext = new CasterContext(
        find(oldCasters, (match) => match?.publicKey?.toString() === casterPK),
      );
      await stateHandler(
        async () => {
          return await casterContext.prestigeCaster();
        },
        fetchPlayer,
        INST_PRESTIGE_CASTER,
      );
    },
    async openChest(chest) {
      closeDrawer();
      await stateHandler(
        async () => {
          return await new PlayerContext().openChest(
            find(
              items,
              (match) => match?.publicKey?.toString() === chest?.publicKey,
            ),
          );
        },
        fetchPlayer,
        INST_OPEN_CHEST,
      );
    },
    async redeemReward(caster) {
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      await stateHandler(
        async () => {
          return await casterContext.casterRedeemAction();
        },
        fetchPlayer,
        INST_REDEEM_ACTION,
        '',
        casterContext,
      );
    },
    async claimAllRewards() {
      const redeemableCasters = filter(spellcasters, (caster) => {
        return caster?.turnCommit < game?.turnInfo?.turn;
      }).map((caster) => {
        return find(casters, (c) => {
          return c.publicKey.toString() === caster.publicKey;
        });
      });
      await stateHandler(
        async () => {
          return await new CasterContext().casterRedeemAllActions(
            redeemableCasters,
          );
        },
        fetchPlayer,
        INST_CLAIM_ALL,
      );
    },
    async lootResources(caster) {
      if (caster?.last_loot < game?.turnInfo?.turn) {
        closeDrawer();

        if (caster?.last_loot < game?.turnInfo?.turn) {
          const casterContext = new CasterContext(
            find(
              casters,
              (match) => match?.publicKey?.toString() === caster?.publicKey,
            ),
          );

          await stateHandler(
            async () => {
              return await casterContext.casterCommitLoot();
            },
            fetchPlayer,
            INST_COMMIT_LOOT,
            '',
            casterContext,
          );
        }
      }
    },
    async moveToTile(caster) {
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      closeDrawer();

      const col = confirm?.position.slice(0, 1);
      const row = +confirm?.position.slice(1, confirm?.position.length);
      await stateHandler(
        async () => {
          return await new CasterContext(
            find(
              casters,
              (match) => match?.publicKey?.toString() === caster?.publicKey,
            ),
          ).casterCommitMove(
            row - 1,
            ['a', 'b', 'c'].findIndex((colLetter) => colLetter === col),
          );
        },
        fetchPlayer,
        INST_COMMIT_MOVE,
        '',
        casterContext,
      );
    },
    async equipItem(item = context?.item, caster = context?.caster) {
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      closeDrawer();
      setEquip('');
      setUnequip('');

      await stateHandler(
        async () => {
          return await casterContext.equipItem(items[item.id]);
        },
        fetchPlayer,
        INST_EQUIP,
        '',
        casterContext,
      );
    },
    async unequipItem() {
      const item = context?.item;
      const caster = context?.caster;
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

      await stateHandler(
        async () => {
          return await casterContext.unequipItem(
            find(
              casters,
              (match) => match?.publicKey?.toString() === caster?.publicKey,
            )?.modifiers?.[item.type],
          );
        },
        fetchPlayer,
        INST_UNEQUIP,
        '',
        casterContext,
      );
    },
    async castSpell(spell, caster) {
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      setModal('');
      setEquip('');
      setUnequip('');

      await stateHandler(
        async () => {
          return await casterContext.castSpell(items[spell.id]);
        },
        fetchPlayer,
        INST_COMMIT_SPELL,
        '',
        casterContext,
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

      closeDrawer();

      await stateHandler(
        async () => {
          return await casterContext.casterCommitCraft(
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
          );
        },
        fetchPlayer,
        INST_COMMIT_CRAFT,
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

      for (let i = 0; i < resources.length; i++) {
        if (resources[i].amount) {
          await stateHandler(
            async () => {
              return await casterContext.manualResourceBurn(
                resources[i].itemFeature,
                resources[i].amount,
              );
            },
            fetchPlayer,
            INST_MANUAL_RES_BURN,
            '',
            casterContext,
          );
        }
      }
    },
    burnItemAccount,
    async modalBurn(item) {
      if (localStorage.getItem('hide_burn_modal') === 'true') {
        await burnItemAccount(item);
        return;
      }
      setModal({ active: true, type: MODAL_BURN, item });
    },
    async redeemNFT() {
      const playerContext = new PlayerContext();

      setContext(INIT_STATE_REDEEM);
      setModal('');

      await stateHandler(
        async () => {
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
        },
        fetchPlayer,
        INST_MINT_NFT,
      );

      if (context?.nft?.data.name === 'Caster')
        setCasters(await playerContext.getCasters());
    },
    async unequipAllItems(caster: Caster) {
      if (!caster) return;
      const foundCaster = find(
        casters,
        (match) => match?.publicKey?.toString() === caster?.publicKey,
      );
      const casterContext = new CasterContext(foundCaster);
      const casterItems: any[] = [];
      const keys = Object.keys(caster || {});
      for (let i = 0; i < keys.length; i++) {
        const item = caster[keys[i]]?.currentItem;
        if (item) {
          casterItems.push(item);
        }
      }
      await stateHandler(
        async () => {
          return await casterContext.unequipAllItems(casterItems);
        },
        fetchPlayer,
        INST_UNEQUIP,
      );
    },
    async confirmMint(item, caster) {
      if (
        item?.rarity === RARITY_COMMON ||
        context?.item?.rarity === RARITY_COMMON
      ) {
        setMutation({
          id: nanoid(),
          rpc: false,
          validator: false,
          success: false,
          error: true,
          done: false,
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
        await stateHandler(
          async () => {
            return await playerContext.mintNFTCaster(
              casters[context?.caster?.index],
            );
          },
          fetchPlayer,
          INST_MINT_NFT,
        );
      } else if (item || context?.item) {
        const match_item = item || context?.item;
        await stateHandler(
          async () => {
            return await playerContext.mintNFTItem(
              find(
                items,
                (match) =>
                  match?.publicKey?.toString() === match_item?.publicKey,
              ),
            );
          },
          fetchPlayer,
          INST_MINT_NFT,
        );
        if (caster || context?.caster)
          setCasters(await playerContext.getCasters());
      }
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

      await stateHandler(
        async () => {
          await serumContext.placeOrder({ side, price, size, orderType });
        },
        fetchOrder,
        INST_PLACE_ORDER,
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
      await stateHandler(
        async () => {
          await serumContext.cancelOrder(order);
        },
        fetchOrder,
        INST_CANCEL_ORDER,
      );
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
      await stateHandler(
        async () => {
          return await serumContext.settleFunds(unsettledFund);
        },
        fetchOrder,
        INST_PLACE_ORDER,
      );
    },

    async swapOrder(pair, side, size) {
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
        console.log('ask price', ask_price);
        if (ask_price) price = floorPrice(ask_price * 3, decimals);
      } else {
        price = decimalsToFloat(decimals);
      }

      if (price) {
        await stateHandler(
          async () => {
            await serumContext.placeOrder({ side, price, size, orderType });
          },
          fetchPlayer,
          INST_PLACE_ORDER,
        );
      }
    },
    //Getters moved somewhere else?
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
  };
};
