import { CasterContext, PlayerContext } from 'sdk/src/program';
import {
  GIVE_ITEM,
  GIVE_LADA,
  GIVE_RESOURCES,
  INST_INIT_CASTER,
} from 'core/mesh/rpc';
import {
  ATTRIBUTE_RES1,
  ATTRIBUTE_RES2,
  GAME_RESOURCES,
} from 'core/mesh/state';
import { CHAIN_ITEMS, CHAIN_PLAYER } from 'chain/hooks/state';
import { useMesh } from 'core/state/mesh/useMesh';
import { useMutation } from 'sdk/src/hooks/useMutations';

export const useTesters = () => {
  const { handleState } = useMutation();
  const [, setPlayer] = useMesh(CHAIN_PLAYER);
  const [, setItems] = useMesh(CHAIN_ITEMS);
  const [, setResources] = useMesh(GAME_RESOURCES);

  const createCasterContext = () => {
    return new CasterContext();
  };

  return {
    async testGiveLADA() {
      const casterContext = createCasterContext();

      await handleState(await casterContext.giveLada(), GIVE_LADA);
    },
    async testInitCaster() {
      const casterContext = createCasterContext();

      return await handleState(
        await casterContext.initCaster(),
        INST_INIT_CASTER,
      );
    },
    async testGiveChest() {
      const casterContext = createCasterContext();

      await handleState(
        await casterContext.giveItem({
          chest: {
            tier: 1,
          },
        }),
        GIVE_ITEM,
      );
    },
    async testGiveResources() {
      const casterContext = createCasterContext();

      await handleState(await casterContext.giveResources(), GIVE_RESOURCES);
    },
    async testGiveHat() {
      const casterContext = createCasterContext();

      await handleState(
        await casterContext.giveItem({
          equipment: {
            feature: { [ATTRIBUTE_RES2]: {} },
            rarity: { common: {} },
            equipmentType: { head: {} },
            value: 1, // 8
          },
        }),
        GIVE_ITEM,
      );
    },
    async testGiveRobe() {
      const casterContext = createCasterContext();

      await handleState(
        await casterContext.giveItem({
          equipment: {
            feature: { [ATTRIBUTE_RES2]: {} },
            rarity: { common: {} },
            equipmentType: { robe: {} },
            value: 1, // 8
          },
        }),
        GIVE_ITEM,
      );
    },
    async testGiveStaff() {
      const casterContext = createCasterContext();

      await handleState(
        await casterContext.giveItem({
          equipment: {
            feature: { [ATTRIBUTE_RES2]: {} },
            rarity: { common: {} },
            equipmentType: { staff: {} },
            value: 1, // 8
          },
        }),
        GIVE_ITEM,
      );
    },
    async testGiveSpell() {
      const casterContext = createCasterContext();

      await handleState(
        await casterContext.giveItem({
          spellBook: {
            spell: { [ATTRIBUTE_RES1]: {} },
            costFeature: { [ATTRIBUTE_RES1]: {} },
            rarity: { common: {} },
            /// 1-300
            cost: 1, // 16
            /// 0-3.6k
            value: 19, // 16
          },
        }),
        GIVE_ITEM,
      );
    },
    async testRefresh() {
      const playerContext = new PlayerContext();

      setPlayer(await playerContext.getPlayer());
      setResources(await playerContext.getResources());
      setItems(await playerContext.getInventory());
    },
  };
};
