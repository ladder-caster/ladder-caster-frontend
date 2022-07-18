import { useRemixOrigin } from 'core/hooks/remix/useRemixOrigin';
import {
  EQUIP_ITEM,
  GAME_CONFIRM,
  GAME_INVENTORY,
  GAME_MAP,
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
  GAME_OLD_SPELLCASTERS,
  EDITION_NORMAL,
  EDITION_LIMITED,
  GAME_CONSTANTS,
  CURRENT_SEASON,
  PRESTIGE_TOGGLE,
  ARWEAVE_UTILS,
  TRADE_ORDERBOOK,
  WEB3AUTH_PROVIDER,
  WEB3AUTH_CLIENT,
  WEB3AUTH_PLUGIN_STORE,
} from 'core/remix/state';
import { COLUMNS_ALPHA, getTier } from 'core/utils/switch';
import { convertStrToRandom } from 'core/utils/numbers';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_NEXT_TURN,
  CHAIN_NFTS,
  CHAIN_OLD_CASTERS,
  CHAIN_PLAYER,
  INIT_CHAIN_LOAD,
} from '../../../libs/chain/hooks/state';
import {
  Caster,
  Game,
  GameContext,
  Item,
  Tile,
} from '../../../libs/sdk/src/program';
import * as anchor from '@project-serum/anchor';
import resources from 'sdk/src/config/resources.json';
import { RPC_ERROR, RPC_LOADING } from 'core/remix/rpc';
import {
  TAB_CHARACTER,
  TAB_WALLET,
  TAB_SWAP,
  TABS_MINT_REDEEM,
  TABS_SWAP_ORDER,
} from 'core/remix/tabs';
import { map, sortBy, reverse } from 'lodash';
import gameConstantsContext from '../../../libs/sdk/src/program/GameConstantsContext';
import arweaveUtil from '../../../libs/sdk/src/utils/ArweaveUtil';
import config from '../../../../config';
import { useW3A } from 'chain/hooks/connections/useW3A';
import { useWalletAdapter } from 'chain/hooks/connections/useWalletAdapter';

const Remix = () => {
  const [, setMap] = useRemixOrigin(GAME_MAP);
  const [game, setGame] = useRemixOrigin(CHAIN_GAME);
  const [player] = useRemixOrigin(CHAIN_PLAYER);
  const [items] = useRemixOrigin(CHAIN_ITEMS, new Map<string, Item>());
  const [casters] = useRemixOrigin(CHAIN_CASTERS, new Map<string, Caster>());
  const [oldCasters] = useRemixOrigin(
    CHAIN_OLD_CASTERS,
    new Map<string, Caster>(),
  );
  const [, setSpellcasters] = useRemixOrigin(GAME_SPELLCASTERS, []);
  const [, setOldSpellcasters] = useRemixOrigin(GAME_OLD_SPELLCASTERS, []);
  const [client] = useRemixOrigin(CHAIN_LOCAL_CLIENT);
  const [loading] = useRemixOrigin(RPC_LOADING, {});
  const [inventory, setInventory] = useRemixOrigin(GAME_INVENTORY, {
    items: [],
    chests: [],
  });

  const [gameConstants] = useRemixOrigin(GAME_CONSTANTS, gameConstantsContext);
  const [arweave] = useRemixOrigin(ARWEAVE_UTILS, arweaveUtil);
  useRemixOrigin(GAME_RESOURCES, {
    [TYPE_RES1]: 0,
    [TYPE_RES2]: 0,
    [TYPE_RES3]: 0,
    lada: 0,
    sol: 0,
    usdc: 0,
  });

  useRemixOrigin(TRADE_ORDERBOOK);
  useRemixOrigin(INIT_CHAIN_LOAD, true);
  useRemixOrigin(GAME_INIT);
  useRemixOrigin(USER_PHASE);
  useRemixOrigin(WALLET_TYPE);
  useRemixOrigin(VIEW_NAVIGATION);
  useRemixOrigin(USER_OFFLINE);
  useRemixOrigin(DRAWER_CONTEXT, {});
  useRemixOrigin(RPC_ERROR, []);
  useRemixOrigin(CHAIN_NEXT_TURN);
  useRemixOrigin(CHAIN_NFTS, []);
  useRemixOrigin(CREATE_MUTATION);
  useRemixOrigin(EQUIP_ITEM, '');
  useRemixOrigin(UNEQUIP_ITEM, '');
  useRemixOrigin(MODAL_ACTIVE, {});
  useRemixOrigin(GAME_CONFIRM, {});
  useRemixOrigin(TABS_CHARACTER_ACTIONS, TAB_CHARACTER);
  useRemixOrigin(TABS_MINT_REDEEM, TAB_WALLET);
  useRemixOrigin(TABS_SWAP_ORDER, TAB_SWAP);
  useRemixOrigin(GAME_SPELL, {});
  useRemixOrigin(TOKENS_ACTIVE, '');
  useRemixOrigin(
    PRESTIGE_TOGGLE,
    localStorage.getItem('hide_prestige') === 'true',
  );
  useRemixOrigin(WEB3AUTH_PROVIDER, null);
  useRemixOrigin(WEB3AUTH_CLIENT, null);
  useRemixOrigin(WEB3AUTH_PLUGIN_STORE, {
    plugins: {},
    addPlugin(name: string, instance: unknown): void {
      this.plugins[name] = instance;
    },
    getPlugin(name: string) {
      return this.plugins[name];
    },
  });

  const { handleConnectInitial: handleConnectInitialW3A } = useW3A();
  useWalletAdapter(true);

  const init_land = (tile: Tile, row: number, col: number) => ({
    col,
    id: nanoid(),
    tier: getTier(row),
    empty: false,
    remaining: tile.life,
    level: row,
    cooldown: false,
    type: Object.keys(tile.tileType)[0],
  });

  const empty_land = (col: string, level: number) => ({
    col,
    id: nanoid(),
    level: level,
    empty: true,
  });

  const generateMap = (game: Game) => {
    const lands: any[] = [];
    const map = game.map;

    if (map) {
      for (let row = 0; row < map.length; row++) {
        let level: any = {};
        level.id = nanoid();
        level.level = row;

        for (let col = 0; col < map[row]?.length; col++) {
          const tileSearched = map[row][col];
          if (tileSearched)
            level[COLUMNS_ALPHA[col]] = init_land(tileSearched, row, col);
          else level[COLUMNS_ALPHA[col]] = empty_land(COLUMNS_ALPHA[col], row);
        }
        lands.push(level);
      }
    }

    return lands;
  };

  const generateSpellCaster = (casterArr: Map<string, Caster>) => {
    let spellcastersArr: any[] = [];

    for (const [i, caster] of casterArr) {
      const position = `${COLUMNS_ALPHA[caster.modifiers.tileColumn]}${
        caster.modifiers.tileLevel + 1
      }`;

      let isLootActionBefore = false;
      let moveAction = caster.turnCommit?.actions?.mv;

      const currentTurn = game?.turnInfo?.turn;

      const generateModifier = (itemPK: anchor.web3.PublicKey | undefined) => {
        if (!itemPK) return null;

        let item: Item = items.get(itemPK.toString());

        if (!item) return null;

        if (item?.itemType?.equipment) {
          return {
            type: Object.keys(item?.itemType?.equipment?.equipmentType)?.[0],
            id: 0,
            tier: getTier(item.level),
            level: item?.level,
            attribute: Object.keys(item?.itemType?.equipment?.feature)?.[0],
            rarity: Object.keys(item?.itemType?.equipment?.rarity)?.[0],
            value: item?.itemType?.equipment?.value,
            publicKey: item?.publicKey?.toString(),
          };
        } else {
          return {
            type: Object.keys(item?.itemType)?.[0],
            id: 0,
            tier: getTier(item.level),
            level: item?.level,
            attribute: Object.keys(item?.itemType?.spellBook?.spell || {})?.[0],
            rarity: Object.keys(item?.itemType?.spellBook?.rarity || {})?.[0],
            value: item?.itemType?.equipment?.value,
            publicKey: item?.publicKey?.toString(),
          };
        }
      };
      const hat = generateModifier(caster.modifiers.head);
      const robe = generateModifier(caster.modifiers.robe);
      const staff = generateModifier(caster.modifiers.staff);
      spellcastersArr.push({
        index: i,
        publicKey: i,
        hue: Math.floor(convertStrToRandom(i, 360)),
        casterActionPosition: moveAction
          ? `${COLUMNS_ALPHA[moveAction[1]]}${moveAction[0] + 1}`
          : null,
        turnCommit: caster?.turnCommit?.turn,
        isLootActionBefore,
        level: caster.level,
        position: position,
        id: nanoid(),
        xp: caster.experience.toNumber(),
        hat: hat,
        robe: robe,
        staff: staff,
        spell: generateModifier(caster.modifiers.spellBook),
        edition: caster?.edition === 1 ? EDITION_NORMAL : EDITION_LIMITED,
        last_loot: caster?.turnCommit?.actions?.loot
          ? currentTurn
          : currentTurn - 1,
        last_craft: caster?.turnCommit?.actions?.crafting
          ? currentTurn
          : currentTurn - 1,
        last_move: caster?.turnCommit?.actions?.mv
          ? currentTurn
          : currentTurn - 1,
        last_spell: caster?.turnCommit?.actions?.spell
          ? currentTurn
          : currentTurn - 1,
      });
    }
    return spellcastersArr;
  };

  const generateInventory = (inventory: Map<string, Item>) => {
    let items: any[] = [];
    let chests: any[] = [];

    for (const [key, item] of inventory) {
      if (Object.keys(item.itemType)[0] === 'chest') {
        chests.push({
          type: 'chest',
          index: key,
          tier: getTier(item.level),
          level: item.level,
          publicKey: key,
        });
      } else {
        if (item.itemType.equipment) {
          const itemType = Object.keys(
            item.itemType.equipment.equipmentType,
          )[0];
          const arrayItem = {
            type: itemType,
            id: key,
            tier: getTier(item.level),
            level: item.level,
            attribute: Object.keys(item.itemType.equipment.feature)[0],
            rarity: Object.keys(item.itemType.equipment.rarity)[0],
            value: item.itemType.equipment.value,
            publicKey: key,
            equippedOwner: item.equippedOwner,
          };

          items.push(arrayItem);
        } else if (item.itemType.spellBook) {
          items.push({
            type: Object.keys(item.itemType)[0],
            id: key,
            tier: getTier(item.level),
            level: item.level,
            attribute: Object.keys(item.itemType.spellBook.spell)[0],
            rarity: Object.keys(item.itemType.spellBook.rarity)[0],
            cost: item.itemType.spellBook.cost,
            costFeature: Object.keys(item.itemType.spellBook.costFeature)[0],
            value: item.itemType.spellBook.value,
            publicKey: key,
            equippedOwner: item.equippedOwner,
          });
        }
      }
    }
    return {
      items: reverse(
        sortBy(items, ['level', 'attribute', 'rarity']).filter((item) => {
          return !item.equippedOwner;
        }),
      ),
      chests,
    };
  };

  useEffect(() => {
    if (game) {
      setMap(generateMap(game));
    }
    if (client && !gameConstants.clientInitialized()) {
      gameConstants.initClient(client);
    }
    if (client && !arweave.isMerkleInit()) {
      arweave.initMerkle();
    }
  }, [game, client]);

  useEffect(() => {
    let interval, timeout;

    const gamePoll = () => {
      const poll = async () => {
        const prevGame = game;
        const gameContext = new GameContext();
        const nextGame = await gameContext.getGameAccount();
        setGame(nextGame);

        if (prevGame?.turnInfo?.turn !== nextGame?.turnInfo?.turn) {
          clearInterval(interval);
        }
      };

      poll();
      interval = setInterval(() => {
        poll();
      }, config.pollInterval);
    };

    if (game) {
      const timeTwentyMinute = game.turnInfo.turnDelay * 1000; // 20 minute in milliseconds 1200000
      const timeDiff =
        new Date().getTime() -
        new Date(game.turnInfo.lastCrankSeconds.toNumber() * 1000).getTime();
      const crankTime = timeTwentyMinute - timeDiff;

      if (crankTime > 0) {
        setTimeout(() => gamePoll(), crankTime + 10000);
      } else {
        gamePoll();
      }
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [game?.turnInfo?.lastCrankSeconds?.toNumber()]);

  useEffect(() => {
    if (casters) {
      setSpellcasters(generateSpellCaster(casters));
      console.log('casters', casters);
    }
  }, [casters]);

  useEffect(() => {
    if (oldCasters) {
      setOldSpellcasters(generateSpellCaster(oldCasters));
      console.log('old casters', oldCasters);
    }
  }, [oldCasters]);

  useEffect(() => {
    if (items) {
      setInventory(generateInventory(items));
      console.log('inventory', inventory);
    }
  }, [items]);

  useEffect(() => {
    if (player) {
      console.log('player', player);
    }
  }, [player]);

  useEffect(() => {
    // DO NOT REMOVE, the game breaks if removed
    localStorage.setItem(
      'gamePK',
      resources.seasons[CURRENT_SEASON][config.pkString],
    );

    const IDL = config.idl;
    const errors = IDL?.errors;
    const next_codes = {};
    if (errors?.length) {
      map(errors, ({ code, name, msg }) => {
        next_codes[code] = { name, msg };
      });
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('w3a-connected')) {
      handleConnectInitialW3A();
    }
  }, []);

  return null;
};

export default Remix;
