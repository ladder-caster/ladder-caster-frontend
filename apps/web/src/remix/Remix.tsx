import {
  GAME_INVENTORY,
  GAME_MAP,
  GAME_SPELLCASTERS,
  GAME_OLD_SPELLCASTERS,
  EDITION_NORMAL,
  EDITION_LIMITED,
  GAME_CONSTANTS,
  ARWEAVE_UTILS,
} from 'core/mesh/state';
import { COLUMNS_ALPHA, getTier } from 'core/utils/switch';
import { convertStrToRandom } from 'core/utils/numbers';
import { nanoid } from 'nanoid';
import { useEffect, useCallback } from 'react';
import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_OLD_CASTERS,
  CHAIN_PLAYER,
} from '../../../libs/chain/hooks/state';
import {
  Caster,
  Game,
  GameContext,
  Item,
  Tile,
} from '../../../libs/sdk/src/program';
import * as anchor from '@project-serum/anchor';
import { useMesh } from 'core/state/mesh/useMesh';
import { sortBy, reverse } from 'lodash';
import { useGame } from 'chain/hooks/useGame';
import { useConnectionClient } from 'chain/hooks/connections/useConnectionClient';

//ensures pre-setup is done
const Remix = () => {
  const [game, setGame] = useMesh(CHAIN_GAME);
  const [, setMap] = useMesh(GAME_MAP);
  const [player] = useMesh(CHAIN_PLAYER);
  const [items] = useMesh(CHAIN_ITEMS);
  const [casters] = useMesh(CHAIN_CASTERS);
  const [oldCasters] = useMesh(CHAIN_OLD_CASTERS);
  const [, setSpellcasters] = useMesh(GAME_SPELLCASTERS);
  const [, setOldSpellcasters] = useMesh(GAME_OLD_SPELLCASTERS);
  const [client] = useMesh(CHAIN_LOCAL_CLIENT);
  const [inventory, setInventory] = useMesh(GAME_INVENTORY);
  const { getGame } = useGame();
  useConnectionClient(client);
  const [gameConstants] = useMesh(GAME_CONSTANTS);
  const [arweave] = useMesh(ARWEAVE_UTILS);

  // useMeshOrigin(
  //   PRESTIGE_TOGGLE,
  //   localStorage.getItem('hide_prestige') === 'true',
  // );

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

  const generateSpellCaster = (casterArr: Caster[]) => {
    let spellcastersArr: any[] = [];

    for (let i = 0; i < casterArr.length; i++) {
      const caster = casterArr[i];
      const position = `${COLUMNS_ALPHA[caster.modifiers.tileColumn]}${
        caster.modifiers.tileLevel + 1
      }`;

      let isLootActionBefore = false;
      let moveAction = caster.turnCommit?.actions?.mv;

      const currentTurn = game?.turnInfo?.turn;

      const generateModifier = (itemPK: anchor.web3.PublicKey | undefined) => {
        if (!itemPK) return null;

        let item: Item = items.find(
          (i: Item) => i.publicKey?.toString() === itemPK.toString(),
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

  const generateInventory = (inventory: Item[]) => {
    let items: any[] = [];
    let chests: any[] = [];
    // https://leanylabs.com/blog/js-forEach-map-reduce-vs-for-for_of/
    // forEach does 33% less ops-per sec than a regular for loop/forOf
    for (let key = 0; key < inventory.length; key++) {
      const item = inventory[key];
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
            publicKey: item?.publicKey?.toString(),
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
            publicKey: item?.publicKey?.toString(),
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

  const initClient = useCallback(async () => {
    await gameConstants.initClient(client);
    await getGame(client);
  }, [client]);

  useEffect(() => {
    if (game) {
      const next_map = generateMap(game);

      setMap(next_map);
    }
    if (client && !gameConstants.Client) {
      initClient();
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
      }, 10000);
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
    }
  }, [casters]);

  useEffect(() => {
    if (oldCasters) {
      setOldSpellcasters(generateSpellCaster(oldCasters));
    }
  }, [oldCasters]);

  useEffect(() => {
    if (items) {
      setInventory(generateInventory(items));
    }
  }, [items]);

  return null;
};

export default Remix;
