import { useRemixOrigin } from 'core/hooks/remix/useRemixOrigin';
import { useAutoSignIn } from 'core/hooks/useAutoSignIn';
import {
  EQUIP_ITEM,
  GAME_BOOST,
  GAME_CONFIRM,
  GAME_INVENTORY,
  GAME_MAP,
  GAME_OPTIONS,
  GAME_RESOURCES,
  GAME_SPELL,
  GAME_SPELLCASTERS,
  MODAL_ACTIVE,
  USER_OFFLINE,
  TABS_CHARACTER_ACTIONS,
  TOKENS_ACTIVE,
  TYPE_EARTH,
  TYPE_FIRE,
  TYPE_WATER,
  UNEQUIP_ITEM,
  CREATE_MUTATION,
  DRAWER_CONTEXT,
  VIEW_NAVIGATION,
  USER_PHASE,
  WALLET_TYPE,
  GAME_INIT,
  ERROR_CODES,
  SEEN_PHASE,
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
  CHAIN_PLAYER,
  INIT_CHAIN_LOAD,
} from '../../../libs/chain/hooks/state';
import {
  Caster,
  Client,
  Environment,
  Game,
  GameContext,
  Item,
  ResourcesPK,
  Tile,
} from '../../../libs/sdk/src/laddercaster/program';
import * as anchor from '@project-serum/anchor';
import resources from 'sdk/src/laddercaster/config/resources.json';
import { RPC_ERROR, RPC_LOADING } from 'core/remix/rpc';
import { TAB_CHARACTER, TAB_WALLET, TABS_MINT_REDEEM } from 'core/remix/tabs';
import { map, sortBy, reverse } from 'lodash';

const Remix = () => {
  const [, setMap] = useRemixOrigin(GAME_MAP);
  const [game, setGame] = useRemixOrigin(CHAIN_GAME);
  const [codes, setCodes] = useRemixOrigin(ERROR_CODES);
  const [player] = useRemixOrigin(CHAIN_PLAYER);
  const [seen] = useRemixOrigin(SEEN_PHASE);
  const [items] = useRemixOrigin(CHAIN_ITEMS, []);
  const [casters] = useRemixOrigin(CHAIN_CASTERS, []);
  const [, setSpellcasters] = useRemixOrigin(GAME_SPELLCASTERS, []);
  const [client] = useRemixOrigin(CHAIN_LOCAL_CLIENT);
  const [loading] = useRemixOrigin(RPC_LOADING, {});
  const [inventory, setInventory] = useRemixOrigin(GAME_INVENTORY, {
    items: [],
    chests: [],
  });
  useRemixOrigin(GAME_RESOURCES, {
    fire: 0,
    earth: 0,
    water: 0,
    lada: 0,
  });

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
  useRemixOrigin(GAME_SPELL, {});
  useRemixOrigin(TOKENS_ACTIVE, '');
  useRemixOrigin(GAME_BOOST, {
    [TYPE_WATER]: 0,
    [TYPE_FIRE]: 0,
    [TYPE_EARTH]: 0,
  });

  // TODO: Remove! Only added for esthetics
  useRemixOrigin(GAME_OPTIONS, {
    base: 1200,
    speed: 120,
    reward: 10,
    bars: 3,
    land: 3,
  });

  const { request: requestCachePubKey } = useAutoSignIn();

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
    const lands = [];
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

  const generateSpellCaster = (casterArr: Caster[]) => {
    let spellcastersArr = [];

    for (let i = 0; i < casterArr.length; i++) {
      const caster = casterArr[i];
      const position = `${COLUMNS_ALPHA[caster.modifiers.tileColumn]}${
        caster.modifiers.tileLevel + 1
      }`;

      const doneActions = {};

      let isMoveActionBefore = false;
      let isLootActionBefore = false;
      let moveAction = caster.turnCommit?.actions?.mv;

      //TODO need to check order

      // caster?.turnCommit?.actions.forEach((action) => {
      //   doneActions[Object.keys(action)[0]] = caster.turnCommit.turn.toNumber();

      //   if (Object.keys(action)[0] === 'move') {
      //     moveAction = action.move;
      //   }
      //   if (Object.keys(action)[0] === 'move' && !isLootActionBefore) {
      //     isMoveActionBefore = true;
      //   } else if (Object.keys(action)[0] === 'loot' && !isMoveActionBefore) {
      //     isLootActionBefore = true;
      //   }
      // });

      const currentTurn = game?.turnInfo?.turn;

      const generateModifier = (itemPK: anchor.web3.PublicKey) => {
        if (!itemPK) return null;

        let item: Item = items.find(
          (i: Item) => i.publicKey.toString() === itemPK.toString(),
        );

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
            attribute: Object.keys(item?.itemType?.spellBook?.spell)?.[0],
            rarity: Object.keys(item?.itemType?.spellBook?.rarity)?.[0],
            value: item?.itemType?.equipment?.value,
            publicKey: item?.publicKey?.toString(),
          };
        }
      };

      spellcastersArr.push({
        index: i,
        publicKey: caster?.publicKey?.toString(),
        hue: Math.floor(convertStrToRandom(caster?.publicKey?.toString(), 360)),
        casterActionPosition: moveAction
          ? `${COLUMNS_ALPHA[moveAction[1]]}${moveAction[0] + 1}`
          : null,
        turnCommit: caster?.turnCommit?.turn,
        isLootActionBefore,
        level: caster.level,
        position: position,
        id: nanoid(),
        xp: caster.experience.toNumber(),
        hat: generateModifier(caster.modifiers.head),
        robe: generateModifier(caster.modifiers.robe),
        staff: generateModifier(caster.modifiers.staff),
        spell: generateModifier(caster.modifiers.spellBook),
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

  const generateInventory = (inventory: Item[]) => {
    let items = [];
    let chests = [];

    inventory.forEach((item, key) => {
      if (Object.keys(item.itemType)[0] === 'chest') {
        chests.push({
          type: 'chest',
          index: key,
          tier: getTier(item.level),
          level: item.level,
          publicKey: item?.publicKey?.toString(),
        });
      } else {
        if (item.itemType.equipment) {
          items.push({
            type: Object.keys(item.itemType.equipment.equipmentType)[0],
            id: key,
            tier: getTier(item.level),
            level: item.level,
            attribute: Object.keys(item.itemType.equipment.feature)[0],
            rarity: Object.keys(item.itemType.equipment.rarity)[0],
            value: item.itemType.equipment.value,
            publicKey: item?.publicKey?.toString(),
            equippedOwner: item.equippedOwner,
          });
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
            publicKey: item?.publicKey?.toString(),
            equippedOwner: item.equippedOwner,
          });
        }
      }
    });

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
    let listener;
    if (game) {
      setMap(generateMap(game));

      // if (client) {
      //   window.addEventListener('focus', () => {
      //     if (client.program._events._eventCallbacks.size === 0)
      //       listener = client.program.addEventListener('NewTurn', async () => {
      //         const gameContext = new GameContext(
      //           client,
      //           localStorage.getItem('gamePK'),
      //         );
      //         setGame(await gameContext.getGameAccount());
      //       });
      //   });

      //   if (client.program._events._eventCallbacks.size === 0)
      //     listener = client.program.addEventListener('NewTurn', async () => {
      //       const gameContext = new GameContext(
      //         client,
      //         localStorage.getItem('gamePK'),
      //       );
      //       setGame(await gameContext.getGameAccount());
      //     });
      // }
    }

    // return () => {
    //   console.log('unmounted wtf');
    //   if (client) client.program.removeEventListener(listener);
    // };
  }, [game, client]);

  useEffect(() => {
    let interval, timeout;

    const gamePoll = () => {
      const poll = async () => {
        const prevGame = game;
        const gameContext = new GameContext(
          client,
          localStorage.getItem('gamePK'),
        );
        const nextGame = await gameContext.getGameAccount();
        setGame(nextGame);

        if (prevGame?.turnInfo?.turn !== nextGame?.turnInfo?.turn) {
          clearInterval(interval);
        }
      };

      poll();
      interval = setInterval(() => {
        poll();
      }, 10000);
    };

    if (game) {
      console.log(game);
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
    }
  }, [casters]);

  useEffect(() => {
    if (items) {
      setInventory(generateInventory(items));
    }
  }, [items]);

  useEffect(() => {
    requestCachePubKey();

    // DO NOT REMOVE, the game breaks if removed
    switch (process.env.REACT_APP_ENV as Environment) {
      case 'devnet': {
        localStorage.setItem('gamePK', (resources as ResourcesPK).gameAccount);
        break;
      }
      case 'mainnet': {
        localStorage.setItem(
          'gamePK',
          (resources as ResourcesPK).gameAccountProd,
        );
        break;
      }
    }
  }, []);

  // useEffect(() => {
  //   if (player) {
  //     console.log('player', player);
  //   }
  // }, [player]);

  // useEffect(() => {
  //   if (inventory) {
  //     console.log('inventory', inventory);
  //   }
  // }, [inventory]);

  // useEffect(() => {
  //   if (casters) {
  //     console.log('casters', casters);
  //   }
  // }, [casters]);

  // useEffect(() => {
  //   if (game) {
  //     console.log('game', game);
  //     console.log(
  //       'last crank',
  //       new Date(game.turnInfo.lastCrankSeconds.toNumber() * 1000),
  //     );
  //   }
  // }, [game]);

  useEffect(() => {
    if (loading) {
      Object.keys(loading).forEach((key) => {
        if (loading[key].rpc || loading[key].validator) {
          console.log(
            `${key} is loading ${loading[key].rpc ? 'rpc' : 'validator'}`,
          );
        }
      });
    }
  }, [loading]);

  useEffect(() => {
    const IDL = Client.getIDL(process.env.REACT_APP_ENV as Environment);
    const errors = IDL?.errors;
    const next_codes = {};
    if (errors?.length) {
      map(errors, ({ code, name, msg }) => {
        next_codes[code] = { name, msg };
      });
      setCodes(next_codes);
    }
  }, []);

  return null;
};

export default Remix;
