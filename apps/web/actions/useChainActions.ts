import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_ACTIVE,
  DRAWER_WALLET,
  DRAWER_SETTINGS,
  DRAWER_TOKENS,
  DRAWER_INVENTORY,
  DRAWER_CRAFT,
  DRAWER_CONTEXT,
  GAME_INVENTORY,
  GAME_CONFIRM,
  MODAL_ACTIVE,
  MODAL_CHEST,
  MODAL_MINT,
  MODAL_IMPORT,
  DRAWER_CRANK,
  MODAL_LOOT,
  MODAL_MOVE,
  MODAL_SPELL,
  PLAYER_ACTIONS,
  PLAYER_CHARACTER,
  TABS_CHARACTER_ACTIONS,
  EQUIP_ITEM,
  UNEQUIP_ITEM,
  MODAL_REDEEM,
  GAME_RESOURCES,
  TOKENS_ACTIVE,
  TYPE_RES1,
  TYPE_RES2,
  TYPE_RES3,
  GAME_SPELLCASTERS,
  CREATE_MUTATION,
  DRAWER_SPELLCASTER,
  CRAFT_MATERIALS,
  USER_PHASE,
  PHASE_ACTIONS,
  PHASE_EQUIP,
  PHASE_REWARDS,
  CRAFT_CHARACTER,
  VIEW_NAVIGATION,
  BURNER_TYPE,
  WALLET_TYPE,
  GAME_MAP,
  WEB3AUTH_CLIENT,
  WEB3AUTH_PROVIDER,
  ATTRIBUTE_RES1,
  ATTRIBUTE_RES2,
  ATTRIBUTE_RES3,
  DRAWER_TRADE,
  RARITY_COMMON,
  MODAL_BURN,
  CASTER_UPGRADE_AVAILABLE,
  SIDE_BUY,
  TRADE_ORDERBOOK,
  SIDE_SELL,
} from 'core/remix/state';
import {
  TAB_REDEEM,
  TAB_WALLET,
  TABS_MINT_REDEEM,
  TAB_MINT,
} from 'core/remix/tabs';
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
import {
  VIEW_SPELLCASTERS,
  VIEW_INVENTORY,
  VIEW_MAP,
} from 'core/routes/routes';
import { useTranslation } from 'react-i18next';
import {
  CasterContext,
  GameContext,
  PlayerContext,
  Caster,
  SerumContext,
} from 'sdk/src/laddercaster/program';
import { Market } from '@project-serum/serum';
import * as anchor from '@project-serum/anchor';
import {
  GIVE_ITEM,
  GIVE_LADA,
  GIVE_RESOURCES,
  INST_INIT_PLAYER,
  FETCH_PLAYER,
  FETCH_ORDER,
  FETCH_CASTERS,
  INST_COMMIT_CRAFT,
  INST_COMMIT_LOOT,
  INST_COMMIT_MOVE,
  INST_COMMIT_SPELL,
  INST_CRANK,
  INST_EQUIP,
  INST_INIT_CASTER,
  INST_MANUAL_RES_BURN,
  INST_MINT_NFT,
  INST_OPEN_CHEST,
  INST_REDEEM_ACTION,
  INST_UNEQUIP,
  INST_BURN_NFT,
  INST_CLAIM_ALL,
  INST_PRESTIGE_CASTER,
  INST_PLACE_ORDER,
  INST_CANCEL_ORDER,
} from 'core/remix/rpc';
import {
  INIT_STATE_BOOST,
  INIT_STATE_REDEEM,
  INIT_STATE_TRADE,
} from 'core/remix/init';
import { useLocalWallet } from 'chain/hooks/useLocalWallet';
import { map, find, filter } from 'lodash';
import { handleCustomErrors } from 'core/utils/parsers';
import remix from 'core/remix';
import { WALLET_ADAPTERS } from '@web3auth/base';
import { PublicKey } from '@solana/web3.js';
import { findMarket } from 'core/utils/markets';
let retry_count = {};

export const useChainActions = () => {
  const { t } = useTranslation();
  const [, setCasterTab] = useRemix(TABS_CHARACTER_ACTIONS);
  const [, setWalletTab] = useRemix(TABS_MINT_REDEEM);
  const [, setModal] = useRemix(MODAL_ACTIVE);
  const [drawer, setDrawer, isSetDrawer] = useRemix(DRAWER_ACTIVE);
  const [context, setContext] = useRemix(DRAWER_CONTEXT);
  const [, setPhase] = useRemix(USER_PHASE);
  const [, setEquip] = useRemix(EQUIP_ITEM);
  const [, setUnequip] = useRemix(UNEQUIP_ITEM);
  const [confirm, setConfirm] = useRemix(GAME_CONFIRM);
  const [, setMutation] = useRemix(CREATE_MUTATION);
  const [client, setClient] = useRemix(CHAIN_LOCAL_CLIENT);
  const [, setPlayer] = useRemix(CHAIN_PLAYER);
  const [game, setGame] = useRemix(CHAIN_GAME);
  const [items, setItems] = useRemix(CHAIN_ITEMS);
  const [casters, setCasters] = useRemix(CHAIN_CASTERS);
  const [oldCasters] = useRemix(CHAIN_OLD_CASTERS);
  const [resources, setResources] = useRemix(GAME_RESOURCES);
  const [spellcasters, setSpellcasters] = useRemix(GAME_SPELLCASTERS);
  const [orderbook, setOrderbook] = useRemix(TRADE_ORDERBOOK);
  const [inventory, setInventory] = useRemix(GAME_INVENTORY);
  const [board] = useRemix(GAME_MAP);
  const [tokens, setTokens] = useRemix(TOKENS_ACTIVE);
  const { createLocalWallet } = useLocalWallet();
  const [, setWalletType] = useRemix(WALLET_TYPE);
  const [, setView] = useRemix(VIEW_NAVIGATION);
  const [web3Auth] = useRemix(WEB3AUTH_CLIENT);
  const [, setProvider] = useRemix(WEB3AUTH_PROVIDER);

  const [upgradeAvailable] = useRemix(CASTER_UPGRADE_AVAILABLE);
  const stateHandler = async (rpcCallback, type, retry_id) => {
    const id = retry_id || nanoid();

    try {
      setMutation({
        id,
        rpc: true,
        validator: false,
        success: false,
        retry_id,
        error: false,
        type,
      });

      const validatorSignature = await rpcCallback();

      setMutation({
        id,
        rpc: false,
        validator: true,
        success: false,
        retry_id,
        error: false,
        type,
      });

      let confirmationResult: any = {};
      if (typeof validatorSignature === 'string') {
        confirmationResult = await client.connection.confirmTransaction(
          validatorSignature,
        );
      }
      const e = confirmationResult?.value?.err;

      if (String(e).includes('Blockhash')) {
        retry_count[id] ? retry_count[id]++ : (retry_count[id] = 0);
        if (retry_count[id] < 2) await stateHandler(rpcCallback, type, id);
      } else {
        let parsedMessage = handleCustomErrors(e);
        if (e?.includes('Solana')) parsedMessage = t('mutations.timeout');
        setMutation({
          id,
          rpc: false,
          validator: false,
          success: !e,
          retry_id,
          error: !!e,
          type,
          text: {
            error: parsedMessage,
          },
        });
      }

      return confirmationResult;
    } catch (e) {
      console.log('mutation failed', e);
      if (String(e).includes('Blockhash')) {
        retry_count[id] ? retry_count[id]++ : (retry_count[id] = 0);
        if (retry_count[id] < 2) await stateHandler(rpcCallback, type, id);
      } else {
        let parsedMessage = handleCustomErrors(e.message);
        if (e.message?.includes('Solana'))
          parsedMessage = t('mutations.timeout');
        setMutation({
          id,
          rpc: false,
          validator: false,
          success: false,
          error: true,
          text: {
            error: parsedMessage,
          },
          type,
        });
      }
      return null;
    }
  };

  const fetchPlayer = async (
    preInstructionsCallback,
    casterInstance: CasterContext | null = null,
  ) => {
    const result = await preInstructionsCallback();
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
          const updatedCasters = nextCasters.map((caster) => {
            if (caster.publicKey?.toString() === publicKey?.toString()) {
              return { ...nextCaster, publicKey: publicKey };
            } else {
              return { ...caster };
            }
          });

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
  };

  const fetchGame = async (preInstructionsCallback) => {
    const result = await preInstructionsCallback();
    if (result && !result.value.err) {
      const gameContext = new GameContext(localStorage.getItem('gamePK')!);
      const next_game = await gameContext.getGameAccount();

      setGame(next_game);
    }
  };

  const fetchOrder = async (preInstructionsCallback) => {
    const result = await preInstructionsCallback();
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
  };

  const claimRewards = async (caster) => {
    const casterContext = new CasterContext(
      find(
        casters,
        (match) => match?.publicKey?.toString() === caster?.publicKey,
      ),
    );

    await fetchPlayer(async () => {
      return await stateHandler(
        async () => {
          return await casterContext.casterRedeemAction();
        },
        INST_REDEEM_ACTION,
        '',
      );
    }, casterContext);
  };

  const lootResources = async (caster) => {
    if (caster?.last_loot < game?.turnInfo?.turn) {
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      await fetchPlayer(async () => {
        return await stateHandler(
          async () => {
            return await casterContext.casterCommitLoot();
          },
          INST_COMMIT_LOOT,
          '',
        );
      }, casterContext);
    }
  };

  const createCasterContext = () => {
    return new CasterContext();
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
      await fetchPlayer(async () => {
        return await stateHandler(
          async () => {
            return await playerContext.manualItemBurn(
              new PublicKey(match_item?.publicKey),
            );
          },
          INST_BURN_NFT,
          '',
        );
      });
    }
  };
  return {
    confirmBurn,
    closeDrawer() {
      setDrawer('');
      setEquip('');
      setUnequip('');
      setContext('');
      setWalletTab('');
    },
    visitCasters() {
      setView(VIEW_SPELLCASTERS);
    },
    visitMap() {
      setView(VIEW_MAP);
    },
    visitInventory() {
      setView(VIEW_INVENTORY);
    },
    tabActions(id) {
      setCasterTab(PLAYER_ACTIONS);
      setDrawer({ type: DRAWER_SPELLCASTER, id });
    },
    tabCharacter(id) {
      setCasterTab(PLAYER_CHARACTER);
      setDrawer({ type: DRAWER_SPELLCASTER, id });
    },
    modalClear() {
      setModal({});
      setDrawer('');
      setContext('');
      setConfirm({});
    },
    modalBuyLADA() {
      setModal({
        active: true,
        type: MODAL_MINT,
        description: t('modal.demo.description'),
        accept: async (count) => {
          const casterContext = new CasterContext();

          await fetchPlayer(async () => {
            return await stateHandler(
              async () => {
                return await casterContext.initCaster(count);
              },
              INST_INIT_CASTER,
              '',
            );
          });
        },
        deny: () => {
          setModal({});
        },
      });
    },
    modalImportKey() {
      setModal({
        active: true,
        type: MODAL_IMPORT,
        description: null,
        import: (inputValue) => {
          setModal({});
        },
        generate: () => {
          createLocalWallet();
          setWalletType(BURNER_TYPE);
          setModal({});
        },
      });
    },
    async nextTurn() {
      setDrawer('');
      setContext('');

      await fetchGame(async () => {
        return await stateHandler(
          async () => {
            return await new GameContext(
              localStorage.getItem('gamePK')!,
            ).crank();
          },
          INST_CRANK,
          '',
        );
      });
      const playerContext = new PlayerContext();

      setCasters(await playerContext.getCasters());
      setPhase(PHASE_REWARDS);
    },
    modalLoot(caster) {
      setModal({
        active: true,
        type: MODAL_LOOT,
        options: { caster },
        success: caster?.last_loot === game?.turnInfo?.turn,
      });
    },
    modalSpell(caster) {
      setModal({
        active: true,
        type: MODAL_SPELL,
        options: { caster },
        success: caster?.last_spell === game?.turnInfo?.turn,
      });
    },
    modalMove(caster) {
      setModal({
        active: true,
        type: MODAL_MOVE,
        options: { caster },
        success: caster?.last_move === game?.turnInfo?.turn,
      });
    },
    modalRedeem(caster) {
      setModal({
        active: true,
        type: MODAL_REDEEM,
        options: { caster },
      });
    },
    modalCraft(caster) {
      setDrawer({ type: DRAWER_CRAFT });
      setContext({ type: CRAFT_MATERIALS, caster });
    },
    actionMove(action) {
      setConfirm(action);
    },
    cancelMove() {
      setConfirm({});
    },
    async confirmChest(chest) {
      setDrawer('');
      setContext('');
      setConfirm({});

      await fetchPlayer(async () => {
        return await stateHandler(
          async () => {
            return await new PlayerContext().openChest(
              find(
                items,
                (match) => match?.publicKey?.toString() === chest?.publicKey,
              ),
            );
          },
          INST_OPEN_CHEST,
          '',
        );
      });
    },
    actionCraft() {},
    actionSpell() {},
    chooseEquip(item) {
      if (item) {
        setContext({
          equip: {
            ...context,
            item,
          },
        });
      }
    },
    chooseUnequip(item, caster) {
      if (item) {
        setContext({
          ...context,
          item,
          caster,
          unequip: true,
          back: () =>
            setContext({ ...context, unequip: false, back: undefined }),
        });
      }
    },
    modalChest(tier) {
      setModal({
        active: true,
        type: MODAL_CHEST,
        tier,
      });
    },
    modalBurn(item) {
      if (localStorage.getItem('hide_burn_modal') === 'true') {
        confirmBurn(item);
        return;
      }
      setModal({ active: true, type: MODAL_BURN, item });
    },
    async actionLoot(caster) {
      if (caster?.last_loot < game?.turnInfo?.turn) {
        setModal('');
        setDrawer('');
        setContext('');

        await lootResources(caster);
      }
    },
    async confirmMove(caster) {
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      setModal('');
      setDrawer('');
      setContext('');
      setConfirm({});
      await fetchPlayer(async () => {
        const col = confirm?.position.slice(0, 1);
        const row = +confirm?.position.slice(1, confirm?.position.length);

        return await stateHandler(
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
          INST_COMMIT_MOVE,
          '',
        );
      }, casterContext);
    },
    async actionRedeem(caster) {
      setModal('');
      setDrawer('');
      setContext('');

      await claimRewards(caster);
    },
    async equipChoose(item) {
      setContext({
        ...context,
        equip: true,
        item,
        back: () =>
          setContext({
            ...context,
            equip: false,
          }),
      });
    },
    async equipConfirm(item, caster) {
      setContext({
        ...context,
        confirm: true,
        item,
        caster,
        back: () =>
          setContext({
            ...context,
            confirm: false,
            back: () => setContext({ ...context, equip: false }),
          }),
      });
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

      await fetchPlayer(async () => {
        return await stateHandler(
          async () => {
            return await casterContext.equipItem(items[item.id]);
          },
          INST_EQUIP,
          '',
        );
      }, casterContext);
    },
    async unequipConfirm(item, caster) {
      setContext({
        ...context,
        confirm: true,
        item,
        caster,
        back: () =>
          setContext({
            ...context,
            confirm: false,
            back: () =>
              setContext({ ...context, unequip: false, back: undefined }),
          }),
      });
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

        await fetchPlayer(async () => {
          return await stateHandler(
            async () => {
              return await casterContext.unequipItem(
                find(
                  casters,
                  (match) => match?.publicKey?.toString() === caster?.publicKey,
                )?.modifiers?.[item.type],
              );
            },
            INST_UNEQUIP,
            '',
          );
        }, casterContext);
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

      await fetchPlayer(async () => {
        return await stateHandler(
          async () => {
            return await casterContext.castSpell(items[spell.id]);
          },
          INST_COMMIT_SPELL,
          '',
        );
      }, casterContext);
    },
    async craftChooseCharacter(caster) {
      setContext({ ...context, type: CRAFT_MATERIALS, caster });
    },
    async craftChooseItem(item) {
      setContext({ ...context, type: CRAFT_MATERIALS, item });
    },
    async craftChooseMaterials(item) {
      let materials = context?.materials || [];

      for (let i = 0; i < 3; i++) {
        if (!materials[i]) {
          materials[i] = item;
          break;
        }
      }

      setContext({ ...context, materials });
    },
    async removeMaterials(index) {
      let materials = context?.materials || [];
      let type = context?.type;
      materials[index] = null;

      if (!materials[0] || !materials[1] || !materials[2]) {
        type = CRAFT_MATERIALS;
      }
      setContext({ ...context, type, materials });
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

      await fetchPlayer(async () => {
        return await stateHandler(
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
          INST_COMMIT_CRAFT,
          '',
        );
      });
    },
    async decrementResource() {
      const amount = tokens?.amount;
      if (amount >= 1) setTokens({ ...tokens, amount: amount - 1 });
    },
    async incrementResource() {
      const amount = tokens?.amount;
      const flip = tokens?.flip;
      const input = tokens?.pair?.split('/')?.[!flip ? 0 : 1];
      const input_amount = resources?.[input];
      if (amount < input_amount) setTokens({ ...tokens, amount: amount + 1 });
    },
    async boostXP(caster) {
      if (!drawer?.boost) {
        setDrawer({
          ...drawer,
          boost: true,
          id: caster?.id,
        });
      }
      setContext({
        ...context,
        caster,
        [TYPE_RES3]: 0,
        [TYPE_RES1]: 0,
        [TYPE_RES2]: 0,
      });
    },
    async decrementXP(element, custom) {
      let amount = context?.[element];
      if (custom && amount >= custom) {
        amount = amount - custom;
      } else if (custom && amount < custom) {
        amount = 0;
      } else if (amount >= 1) amount--;
      setContext({
        ...context,
        [element]: amount,
      });
    },
    async incrementXP(element, custom) {
      let amount = context?.[element] || 0;
      let max_amount = +resources?.[element];
      if (custom && amount + custom <= max_amount) {
        amount = amount + custom;
      } else if (custom && amount + custom > max_amount) {
        amount = max_amount;
      } else if (amount < max_amount) {
        amount++;
      }
      setContext({
        ...context,
        [element]: amount,
      });
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

      await fetchPlayer(async () => {
        let result;
        for (let i = 0; i < resources.length; i++) {
          if (resources[i].amount) {
            result = await stateHandler(
              async () => {
                return await casterContext.manualResourceBurn(
                  resources[i].itemFeature,
                  resources[i].amount,
                );
              },
              INST_MANUAL_RES_BURN,
              '',
            );
          }
        }
        return result;
      }, casterContext);
    },
    async updateCasterLevel(caster) {},
    async openDrawerWallet() {
      setDrawer({ type: DRAWER_WALLET });
      setWalletTab(TAB_WALLET);
      setContext(INIT_STATE_REDEEM);
    },
    async openDrawerRedeem() {
      setDrawer({ type: DRAWER_WALLET });
      setWalletTab(TAB_REDEEM);
      setContext(INIT_STATE_REDEEM);
    },
    async openDrawerMint() {
      setDrawer({ type: DRAWER_WALLET });
      setWalletTab(TAB_MINT);
      setContext(INIT_STATE_REDEEM);
    },
    async openDrawerSettings() {
      setDrawer({ type: DRAWER_SETTINGS });
    },
    async openDrawerTokens() {
      setDrawer({ type: DRAWER_TOKENS });
    },
    async openDrawerInventory(item) {
      setDrawer({ type: DRAWER_INVENTORY });
      setContext({ ...inventory, item });
    },
    async openDrawerCraft() {
      setDrawer({ type: DRAWER_CRAFT });
      setContext({ type: CRAFT_CHARACTER });
    },
    async chooseRedeem(nft) {
      setContext({ ...context, nft });
    },
    async confirmRedeem() {
      const playerContext = new PlayerContext();

      setContext(INIT_STATE_REDEEM);
      setModal('');

      await fetchPlayer(async () => {
        return await stateHandler(
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
          INST_MINT_NFT,
          '',
        );
      }).then(async () => {
        if (context?.nft?.data.name === 'Caster')
          setCasters(await playerContext.getCasters());
      });
    },
    async chooseMint(item) {
      setContext({ ...context, item });
    },
    async chooseMintCaster(caster) {
      setContext({ ...context, caster });
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
        await fetchPlayer(async () => {
          return await stateHandler(
            async () => {
              return await playerContext.mintNFTCaster(
                casters[context?.caster?.index],
              );
            },
            INST_MINT_NFT,
            '',
          );
        });
      } else if (item || context?.item) {
        const match_item = item || context?.item;
        await fetchPlayer(async () => {
          return await stateHandler(
            async () => {
              return await playerContext.mintNFTItem(
                find(
                  items,
                  (match) =>
                    match?.publicKey?.toString() === match_item?.publicKey,
                ),
              );
            },
            INST_MINT_NFT,
            '',
          );
        }).then(async () => {
          if (caster || context?.caster)
            setCasters(await playerContext.getCasters());
        });
      }
    },
    async testGiveLADA() {
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveLada();
        },
        GIVE_LADA,
        '',
      );
    },
    async testInitCaster() {
      const casterContext = createCasterContext();

      return await stateHandler(
        async () => {
          return await casterContext.initCaster();
        },
        INST_INIT_CASTER,
        '',
      );
    },
    async testGiveChest() {
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveItem({
            chest: {
              tier: 1,
            },
          });
        },
        GIVE_ITEM,
        '',
      );
    },
    async testGiveResources() {
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveResources();
        },
        GIVE_RESOURCES,
        '',
      );
    },
    async testGiveHat() {
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveItem({
            equipment: {
              feature: { [ATTRIBUTE_RES2]: {} },
              rarity: { common: {} },
              equipmentType: { head: {} },
              value: 1, // 8
            },
          });
        },
        GIVE_ITEM,
        '',
      );
    },
    async testGiveRobe() {
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveItem({
            equipment: {
              feature: { [ATTRIBUTE_RES2]: {} },
              rarity: { common: {} },
              equipmentType: { robe: {} },
              value: 1, // 8
            },
          });
        },
        GIVE_ITEM,
        '',
      );
    },
    async testGiveStaff() {
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveItem({
            equipment: {
              feature: { [ATTRIBUTE_RES2]: {} },
              rarity: { common: {} },
              equipmentType: { staff: {} },
              value: 1, // 8
            },
          });
        },
        GIVE_ITEM,
        '',
      );
    },
    async testGiveSpell() {
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveItem({
            spellBook: {
              spell: { [ATTRIBUTE_RES1]: {} },
              costFeature: { [ATTRIBUTE_RES1]: {} },
              rarity: { common: {} },
              /// 1-300
              cost: 1, // 16
              /// 0-3.6k
              value: 19, // 16
            },
          });
        },
        GIVE_ITEM,
        '',
      );
    },
    async testRefresh() {
      const playerContext = new PlayerContext();

      setPlayer(await playerContext.getPlayer());
      setResources(await playerContext.getResources());
      setItems(await playerContext.getInventory());
    },
    async initPlayer() {
      const playerContext = new PlayerContext();

      await stateHandler(
        async () => {
          //Do not remove for testing
          // console.log(client.program.provider.wallet.publicKey.toString());
          const result = await playerContext.initPlayer();
          setPlayer(await playerContext.getPlayer());
          return result;
        },
        INST_INIT_PLAYER,
        '',
      );
    },
    async continueRewardsEquip() {
      setPhase(PHASE_EQUIP);
    },
    async continueEquipActions() {
      setPhase(PHASE_ACTIONS);
    },
    async fullRefresh() {
      const playerContext = new PlayerContext();

      setPlayer(await playerContext.getPlayer());
      setResources(await playerContext.getResources());
      setItems(await playerContext.getInventory());
    },
    async refreshResources() {
      const playerContext = new PlayerContext();
      setResources(await playerContext.getResources());
    },
    async refreshGame() {
      const gameContext = new GameContext(localStorage.getItem('gamePK')!);
      setGame(await gameContext.getGameAccount());
    },
    async openCrankDrawer() {
      setDrawer({
        type: DRAWER_CRANK,
      });
    },

    async clearStates() {
      setGame(null);
      setClient(null);
      setPlayer(null);
      setSpellcasters(null);
      setCasters([]);
      setItems([]);
      setInventory({
        items: [],
        chests: [],
        last_mint: 0,
      });
      setResources({
        [TYPE_RES1]: 0,
        [TYPE_RES2]: 0,
        [TYPE_RES3]: 0,
        lada: 0,
      });
    },
    async claimAllRewards() {
      const redeemableCasters = filter(spellcasters, (caster) => {
        return caster?.turnCommit < game?.turnInfo?.turn;
      }).map((caster) => {
        return find(casters, (c) => {
          return c.publicKey.toString() === caster.publicKey;
        });
      });

      await fetchPlayer(async () => {
        return await stateHandler(
          async () => {
            return await new CasterContext().casterRedeemAllActions(
              redeemableCasters,
            );
          },
          INST_CLAIM_ALL,
          '',
        );
      });
    },
    async lootAllResources() {
      map(spellcasters, (caster) => {
        const col = caster?.position?.[0];
        const level = +caster?.position?.slice(1);
        let count = 0;
        map(board, async (row) => {
          if (row?.level === level) {
            const tile = row?.[col];
            if (
              caster?.last_loot < game?.turnInfo?.turn &&
              (tile?.type === TYPE_RES2 ||
                tile?.type === TYPE_RES3 ||
                tile?.type === TYPE_RES1)
            ) {
              setTimeout(async () => await lootResources(caster), 1000 * count);
              count++;
            }
          }
        });
      });
    },
    async prestigeCaster(casterPK) {
      const casterContext = new CasterContext(
        find(oldCasters, (match) => match?.publicKey?.toString() === casterPK),
      );
      await fetchPlayer(async () => {
        return await stateHandler(
          async () => {
            return await casterContext.prestigeCaster();
          },
          INST_PRESTIGE_CASTER,
          '',
        );
      });
    },
    async web3AuthConnect(loginProvider: string) {
      try {
        if (!web3Auth) {
          console.log('web3auth not initialized yet');
          return;
        }
        const provider = await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
          loginProvider,
          login_hint: '',
        });

        setProvider(provider);
        const user = await web3Auth.getUserInfo();
        console.log(user);
      } catch (error) {
        console.error(error);
      }
    },
    async web3AuthDisconnect() {
      if (!web3Auth) {
        console.log('web3auth not initialized yet');
        return;
      }
      await web3Auth.logout();
      setProvider(null);
    },
    async fixAccount() {
      const playerContext = new PlayerContext();

      await stateHandler(
        async () => {
          const result = await playerContext.initPlayer();
          setPlayer(await playerContext.getPlayer());
          return result;
        },
        INST_INIT_PLAYER,
        '',
      );
    },
    async openDrawerTrade() {
      setDrawer({
        type: DRAWER_TRADE,
      });
      setContext(INIT_STATE_TRADE);
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

      await fetchOrder(async () => {
        return await stateHandler(
          async () => {
            await serumContext.placeOrder({ side, price, size, orderType });
          },
          INST_PLACE_ORDER,
          '',
        );
      });
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

      await fetchPlayer(async () => {
        return await stateHandler(
          async () => {
            console.log('start cancel');
            await serumContext.cancelOrder(order);
            console.log('end cancel');
          },
          INST_CANCEL_ORDER,
          '',
        );
      });
    },
    async chooseOrderSide(side) {
      if (side !== context?.side)
        setContext({
          ...context,
          side,
        });
    },
    async filledOrders(pair) {
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

      await fetchOrder(async () => {
        return await stateHandler(
          async () => {
            return await serumContext.settleFunds(unsettledFund);
          },
          INST_PLACE_ORDER,
          '',
        );
      });
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
        console.log('ask price', ask_price);
        if (ask_price) price = floorPrice(ask_price * 3, decimals);
      } else {
        price = decimalsToFloat(decimals);
      }

      if (price) {
        await fetchPlayer(async () => {
          return await stateHandler(
            async () => {
              await serumContext.placeOrder({ side, price, size, orderType });
            },
            INST_PLACE_ORDER,
            '',
          );
        });
      }
    },
    async unequipAllItems(caster: Caster) {
      if (!caster) return;
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      const casterItems = await upgradeAvailable?.getEquippedItems(
        caster.publicKey,
      );
      if (casterItems.length == 0) return;
      await stateHandler(
        async () => {
          return await casterContext.unequipAllItems(casterItems);
        },
        INST_UNEQUIP,
        '',
      );
    },
    async upgradeAllItems(caster: Caster) {
      if (!caster) return;
      const casterContext = new CasterContext(
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      const casterWrapper = await upgradeAvailable?.casters?.get(
        caster?.publicKey,
      );

      if (!casterWrapper) return;
      const keys = Object.keys(casterWrapper);
      const casterItems: any[] = [];
      for (let i = 0; i < keys.length; i++) {
        const items = casterWrapper[keys[i]]?.items;
        const item = upgradeAvailable.items.get(items?.[0]);
        if (!items || items?.length <= 0 || !item) continue;
        casterItems.push(item);
      }
      upgradeAvailable.removeUpgrade(casterItems);

      //if(casterItems.length == 0)return;

      await stateHandler(
        async () => {
          return await casterContext.equipBestGear(casterItems);
        },
        INST_UNEQUIP,
        '',
      );
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
