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
  GAME_BOOST,
  TYPE_FIRE,
  TYPE_WATER,
  TYPE_EARTH,
  GAME_SPELLCASTERS,
  CREATE_MUTATION,
  DRAWER_SPELLCASTER,
  CRAFT_MATERIALS,
  USER_PHASE,
  PHASE_ACTIONS,
  PHASE_EQUIP,
  PHASE_REWARDS,
  CRAFT_ITEM,
  CRAFT_CHARACTER,
  VIEW_NAVIGATION,
  BURNER_TYPE,
  WALLET_TYPE,
  GAME_MAP,
} from 'core/remix/state';
import { TAB_REDEEM, TAB_WALLET, TABS_MINT_REDEEM } from 'core/remix/tabs';
import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_PLAYER,
  CHAIN_NFTS,
} from 'chain/hooks/state';
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
} from 'sdk/src/laddercaster/program';
import * as anchor from '@project-serum/anchor';
import {
  GIVE_ITEM,
  GIVE_LADA,
  GIVE_RESOURCES,
  INST_INIT_PLAYER,
  FETCH_PLAYER,
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
  RPC_ERROR,
  RPC_LOADING,
} from 'core/remix/rpc';
import { INIT_STATE_BOOST, INIT_STATE_REDEEM } from 'core/remix/init';
import { useLocalWallet } from 'chain/hooks/useLocalWallet';
import { map, find, indexOf } from 'lodash';
import { handleCustomErrors } from 'core/utils/parsers';

let retry_count = {};

export const useChainActions = () => {
  const { t } = useTranslation();
  const [, setCasterTab] = useRemix(TABS_CHARACTER_ACTIONS);
  const [, setWalletTab] = useRemix(TABS_MINT_REDEEM);
  const [modal, setModal] = useRemix(MODAL_ACTIVE);
  const [drawer, setDrawer, isSetDrawer] = useRemix(DRAWER_ACTIVE);
  const [context, setContext] = useRemix(DRAWER_CONTEXT);
  const [, setPhase] = useRemix(USER_PHASE);
  const [, setEquip] = useRemix(EQUIP_ITEM);
  const [, setUnequip] = useRemix(UNEQUIP_ITEM);
  const [confirm, setConfirm] = useRemix(GAME_CONFIRM);
  const [mutation, setMutation] = useRemix(CREATE_MUTATION);
  const [client, setClient] = useRemix(CHAIN_LOCAL_CLIENT);
  const [, setPlayer] = useRemix(CHAIN_PLAYER);
  const [game, setGame] = useRemix(CHAIN_GAME);
  const [items, setItems] = useRemix(CHAIN_ITEMS);
  const [casters, setCasters] = useRemix(CHAIN_CASTERS);
  const [resources, setResources] = useRemix(GAME_RESOURCES);
  const [spellcasters, setSpellcasters] = useRemix(GAME_SPELLCASTERS);
  const [boost, setBoost] = useRemix(GAME_BOOST);
  const [inventory, setInventory] = useRemix(GAME_INVENTORY);
  const [board] = useRemix(GAME_MAP);
  const [tokens, setTokens] = useRemix(TOKENS_ACTIVE);
  const [loading, setLoading] = useRemix(RPC_LOADING);
  const [error, setError] = useRemix(RPC_ERROR);
  const { createLocalWallet } = useLocalWallet();
  const [, setWalletType] = useRemix(WALLET_TYPE);
  const [view, setView] = useRemix(VIEW_NAVIGATION);
  const [, setNfts] = useRemix(CHAIN_NFTS);

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

      const confirmationResult = await client.connection.confirmTransaction(
        validatorSignature,
      );

      const e = confirmationResult?.value?.err;

      if (
        String(e).includes('Blockhash') ||
        String(e).includes('Solana') ||
        String(e).includes('Raw')
      ) {
        retry_count[id] ? retry_count[id]++ : (retry_count[id] = 0);
        if (retry_count[id] < 2) await stateHandler(rpcCallback, type, id);
      } else {
        const parsedMessage = handleCustomErrors(e);
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
      if (
        String(e).includes('Blockhash') ||
        String(e).includes('Solana') ||
        String(e).includes('Raw')
      ) {
        retry_count[id] ? retry_count[id]++ : (retry_count[id] = 0);
        if (retry_count[id] < 2) await stateHandler(rpcCallback, type, id);
      } else {
        const parsedMessage = handleCustomErrors(e.message);
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
    }
  };

  const fetchPlayer = async (
    preInstructionsCallback,
    casterInstance = null,
  ) => {
    const result = await preInstructionsCallback();
    if (result && !result?.value?.err) {
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );

      setResources(await playerContext.getResources());
      if (casterInstance) {
        const nextCaster = await casterInstance.refreshCaster();
        const publicKey = casterInstance.getCasterId();
        const nextCasters = [...casters];

        if (nextCaster && publicKey) {
          let changed = false;
          const updatedCasters = nextCasters.map((caster) => {
            if (caster.publicKey?.toString() === publicKey?.toString()) {
              changed = true;
              return { ...nextCaster, publicKey: publicKey };
            } else {
              return { ...caster };
            }
          });

          if (changed) {
            setCasters(updatedCasters);
          }
        } else {
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
        }
      } else {
        setPlayer(await playerContext.getPlayer());
        setItems(await playerContext.getInventory());
      }
    } else {
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
    }
  };

  const fetchGame = async (preInstructionsCallback) => {
    const result = await preInstructionsCallback();
    if (!result.value.err) {
      const gameContext = new GameContext(
        client,
        localStorage.getItem('gamePK'),
      );
      const next_game = await gameContext.getGameAccount();

      setGame(next_game);
    } else {
      //TODO: display user error from blockchain
    }
  };

  const claimRewards = async (caster) => {
    const casterContext = new CasterContext(
      client,
      client.program.provider.wallet.publicKey,
      localStorage.getItem('gamePK'),
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
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
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
    return new CasterContext(
      client,
      client?.program?.provider?.wallet?.publicKey,
      localStorage.getItem('gamePK'),
    );
  };

  return {
    startDemo() {},
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
        accept: async () => {
          const casterContext = new CasterContext(
            client,
            client?.program?.provider?.wallet?.publicKey,
            localStorage.getItem('gamePK'),
          );

          await fetchPlayer(async () => {
            return await stateHandler(
              async () => {
                return await casterContext.initCaster();
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
      await fetchGame(async () => {
        return await stateHandler(
          async () => {
            return await new GameContext(
              client,
              localStorage.getItem('gamePK'),
            ).crank();
          },
          INST_CRANK,
          '',
        );
      });
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );

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
      setContext({ type: CRAFT_ITEM, caster });
    },
    actionMove(action) {
      setConfirm(action);
    },
    cancelMove() {
      setConfirm({});
    },
    async confirmChest(chest) {
      setModal('');
      setDrawer('');
      setContext('');
      setConfirm({});

      await fetchPlayer(async () => {
        return await stateHandler(
          async () => {
            return await new PlayerContext(
              client,
              client?.program?.provider?.wallet?.publicKey,
              localStorage.getItem('gamePK'),
            ).openChest(
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
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
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
              client,
              client.program.provider.wallet.publicKey,
              localStorage.getItem('gamePK'),
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
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
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
          client,
          client.program.provider.wallet.publicKey,
          localStorage.getItem('gamePK'),
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
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
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
      setContext({ ...context, type: CRAFT_ITEM, caster });
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
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
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
        [TYPE_EARTH]: 0,
        [TYPE_FIRE]: 0,
        [TYPE_WATER]: 0,
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
      let amount = context?.[element];
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
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
        find(
          casters,
          (match) => match?.publicKey?.toString() === caster?.publicKey,
        ),
      );

      const resources = [
        {
          itemFeature: { fire: {} },
          amount: context?.[TYPE_FIRE],
        },
        {
          itemFeature: { water: {} },
          amount: context?.[TYPE_WATER],
        },
        {
          itemFeature: { earth: {} },
          amount: context?.[TYPE_EARTH],
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
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );

      setDrawer('');
      setContext({});
      setModal('');

      await fetchPlayer(async () => {
        return await stateHandler(
          async () => {
            if (context?.nft?.data.name === 'Caster') {
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
      });
    },
    async chooseMint(item) {
      setContext({ ...context, item });
    },
    async chooseMintCaster(caster) {
      setContext({ ...context, caster });
    },
    async confirmMint(item, caster) {
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );

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
        });
      }
    },
    async testGiveLADA() {
      console.log('Give Lada');
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
      console.log('Initialize Caster');
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
      console.log('Give Chest');
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
      console.log('Give Resources');
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
      console.log('Give Hat');
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveItem({
            equipment: {
              feature: { water: {} },
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
      console.log('Give Robe');
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveItem({
            equipment: {
              feature: { water: {} },
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
      console.log('Give Staff');
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveItem({
            equipment: {
              feature: { water: {} },
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
      console.log('Give Spell');
      const casterContext = createCasterContext();

      await stateHandler(
        async () => {
          return await casterContext.giveItem({
            spellBook: {
              spell: { fire: {} },
              costFeature: { fire: {} },
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
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );

      setPlayer(await playerContext.getPlayer());
      setResources(await playerContext.getResources());
      setItems(await playerContext.getInventory());
    },
    async initPlayer() {
      const playerContext = new PlayerContext(
        client,
        client.program.provider.wallet.publicKey,
        localStorage.getItem('gamePK'),
      );

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
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );

      setPlayer(await playerContext.getPlayer());
      setResources(await playerContext.getResources());
      setItems(await playerContext.getInventory());
    },
    async refreshResources() {
      const playerContext = new PlayerContext(
        client,
        client?.program?.provider?.wallet?.publicKey,
        localStorage.getItem('gamePK'),
      );
      setResources(await playerContext.getResources());
    },
    async refreshGame() {
      const gameContext = new GameContext(
        client,
        localStorage.getItem('gamePK'),
      );
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
        fire: 0,
        earth: 0,
        water: 0,
        lada: 0,
      });
    },
    async claimAllRewards() {
      map(spellcasters, (caster) => {
        const turnCommitTurn = caster?.turnCommit;
        const currentTurn = game?.turnInfo?.turn;

        if (turnCommitTurn < currentTurn) {
          claimRewards(caster);
        }
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
              (tile?.type === TYPE_WATER ||
                tile?.type === TYPE_EARTH ||
                tile?.type === TYPE_FIRE)
            ) {
              setTimeout(async () => await lootResources(caster), 1000 * count);
              count++;
            }
          }
        });
      });
    },
  };
};
