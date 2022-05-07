import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DEMO_MODE,
  DRAWER_ACTIVE,
  GAME_CONFIRM,
  GAME_INVENTORY,
  GAME_MAP,
  GAME_POSITIONS,
  GAME_SPELLCASTERS,
  MODAL_ACTIVE,
  MODAL_CHEST,
  MODAL_MINT,
  MODAL_CRAFT,
  MODAL_LOOT,
  MODAL_MOVE,
  MODAL_SPELL,
  PLAYER_ACTIONS,
  PLAYER_CHARACTER,
  TABS_CHARACTER_ACTIONS,
  EQUIP_ITEM,
  UNEQUIP_ITEM,
  MODAL_REDEEM,
  TIER_IV,
  TIER_I,
  TYPE_LEGENDARY,
  RARITY_LEGENDARY,
  RARITY_EPIC,
  RARITY_COMMON,
  RARITY_RARE,
  TIER_II,
  TIER_III,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  ITEM_BOOK,
  GAME_RESOURCES,
  TOKENS_ACTIVE,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
  GAME_BOOST,
  DRAWER_CONTEXT,
  DRAWER_SETTINGS,
  DRAWER_TOKENS,
  DRAWER_INVENTORY,
  DRAWER_CRAFT,
  DRAWER_WALLET,
  DRAWER_SPELLCASTER,
  CRAFT_ITEM,
  CRAFT_MATERIALS,
  CRAFT_CONFIRM,
  CRAFT_CHARACTER,
  USER_PHASE,
  PHASE_ACTIONS,
  PHASE_EQUIP,
  PHASE_REWARDS,
} from 'core/remix/state';
import { VIEW_SPELLCASTERS, VIEW_MAP } from 'core/routes/routes';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import { randomIntBetween } from 'core';
import { find } from 'lodash';
import { useLoot } from './useLoot';
import { useChest } from './useChest';
import { COLUMNS_ALPHA, EQUIP_MAP } from 'core/utils/switch';
import { hat } from '../src/shared/items/hat';
import { robe } from '../src/shared/items/robe';
import { staff } from '../src/shared/items/staff';
import { spell } from '../src/shared/items/book';
import { findTilebyPosition } from 'core/utils/tiles';
import {
  INIT_STATE_BOOST,
  INIT_STATE_REDEEM,
  INIT_STATE_WALLET,
} from 'core/remix/init';
import { TAB_REDEEM, TAB_WALLET, TABS_MINT_REDEEM } from 'core/remix/tabs';
import { PlayerContext } from 'sdk/src';

export const useDemoActions = () => {
  const { t } = useTranslation();
  const [, setCasterTab] = useRemix(TABS_CHARACTER_ACTIONS);
  const [, setWalletTab] = useRemix(TABS_MINT_REDEEM);
  const [phase, setPhase] = useRemix(USER_PHASE);
  const [modal, setModal] = useRemix(MODAL_ACTIVE);
  const [demo, setDemo] = useRemix(DEMO_MODE);
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const [context, setContext] = useRemix(DRAWER_CONTEXT);
  const [, setEquip] = useRemix(EQUIP_ITEM);
  const [, setUnequip] = useRemix(UNEQUIP_ITEM);
  const [positions, setPositions] = useRemix(GAME_POSITIONS);
  const [confirm, setConfirm] = useRemix(GAME_CONFIRM);
  const [resources, setResources] = useRemix(GAME_RESOURCES);
  const [tokens, setTokens] = useRemix(TOKENS_ACTIVE);
  const [spellcasters, setSpellcasters] = useRemix(GAME_SPELLCASTERS);
  const [inventory, setInventory] = useRemix(GAME_INVENTORY);
  const [map] = useRemix(GAME_MAP);

  const updateCaster = (next_caster) => {
    let next_spellcasters = [...spellcasters];
    for (let i = 0; i < next_spellcasters?.length; i++) {
      const current_caster = next_spellcasters[i];
      if (current_caster?.id === next_caster?.id) {
        next_spellcasters[i] = next_caster;
        break;
      }
    }
    setSpellcasters(next_spellcasters);
  };

  const openChest = (mint) => {
    let next_chests = [...inventory?.chests];
    for (let i = 0; i < next_chests?.length; i++) {
      const current_chest = next_chests[i];
      if (current_chest?.mint === mint) {
        // open chest
        const items = useChest(current_chest);

        // remove chest
        next_chests.splice(i, 1);
        setInventory({
          ...inventory,
          chests: next_chests,
          items: [...inventory.items, ...items],
        });
        break;
      }
    }
  };

  return {
    startDemo() {
      setDemo({ ...demo, active: true });
      // setResources({ ...resources, lada: 100 });
    },
    closeDrawer() {
      setDrawer('');
      setContext('');
      setTokens('');
      setEquip('');
      setUnequip('');
    },
    visitCasters() {
      setView(VIEW_SPELLCASTERS);
    },
    visitMap() {
      setView(VIEW_MAP);
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
      setConfirm({});
    },
    modalBuyLADA() {
      setModal({
        active: true,
        type: MODAL_MINT,
        description: t('modal.demo.description'),
        accept: async () => {
          const position = `${COLUMNS_ALPHA[randomIntBetween(0, 2)]}1`;
          setDemo({ ...demo, active: true });
          const random_wizard = () => {
            return {
              type: 'Wizard',
              level: 1,
              position,
              id: nanoid(),
              xp: 0,
              hat: null,
              robe: null,
              staff: null,
              gem: null,
              spells: {
                a: null,
                b: null,
                c: null,
              },
              last_loot: 0,
              last_craft: 0,
              last_move: 0,
              last_spell: 0,
            };
          };
          setSpellcasters([...spellcasters, random_wizard()]);
          const next_positions = {
            ...positions,
            [position]: positions?.[position] + 1 || 1,
          };
          setPositions(next_positions);
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
          setDemo({ ...demo, active: true });
          setModal({});
        },
      });
    },
    async nextTurn() {
      setDemo({ ...demo, num_ticks: demo?.num_ticks + 1 });
      setPhase(PHASE_REWARDS);
    },
    modalLoot(caster) {
      setModal({
        active: true,
        type: MODAL_LOOT,
        options: { caster },
        success: caster?.last_loot === demo?.num_ticks,
      });
    },
    modalSpell(caster) {
      setModal({
        active: true,
        type: MODAL_SPELL,
        options: { caster },
        success: caster?.last_spell === demo?.num_ticks,
      });
    },
    modalMove(caster) {
      setModal({
        active: true,
        type: MODAL_MOVE,
        options: { caster },
        success: caster?.last_move === demo?.num_ticks,
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
      setModal({
        active: true,
        type: MODAL_CRAFT,
        options: { caster },
        success: caster?.last_craft === demo?.num_ticks,
      });
    },
    actionMove(action) {
      setConfirm(action);
    },
    cancelMove() {
      setConfirm({});
    },
    confirmChest(mint) {
      openChest(mint);
      setModal('');
      setDrawer('');
      setContext('');
      setConfirm({});
    },
    actionCraft() {},
    actionSpell() {},
    chooseEquip(item) {
      setEquip(item);
    },
    chooseUnequip(item, caster) {
      setContext({
        item,
        caster,
      });
    },
    async modalChest() {
      setModal({
        active: true,
        type: MODAL_CHEST,
      });
    },
    async actionLoot(caster) {
      if (caster?.last_loot < demo?.num_ticks) {
        const position = caster?.position;
        const col = position?.[0];
        const level = +position?.slice(1);
        const tile = find(map, (row) => row?.level === +level)?.[col];
        const last_rewards = { chests: [...inventory?.chests] };
        const rewards = useLoot(
          tile,
          caster,
          last_rewards,
          inventory,
          setInventory,
        );

        // Add chests to resources
        if (rewards?.chests?.length) {
          setInventory({
            ...inventory,
            chests: [...inventory.chests, ...rewards.chests],
          });
        }

        const fire = (resources?.resource1 || 0) + (rewards?.resource1 || 0);
        const water = (resources?.resource2 || 0) + (rewards?.resource2 || 0);
        const earth = (resources?.resource3 || 0) + (rewards?.resource3 || 0);

        // Add resources
        setResources({ ...resources, fire, water, earth });

        // Save latest success animation data in spellcaster
        const next_caster = { ...caster };

        // Limit to once per turn per action in spellcaster
        next_caster.last_loot = demo.num_ticks;

        updateCaster(next_caster);
        setModal('');
        setDrawer('');
        setContext('');
      }
    },
    async confirmMove(caster) {
      const next_caster = { ...caster };
      const tile = findTilebyPosition(map, confirm?.position);
      const level = +confirm?.position?.slice(1);
      const cost = level * 10;
      const budget = resources?.[tile?.type];

      if (cost <= budget) {
        setResources({ ...resources, [tile?.type]: budget - cost });
        next_caster.position = confirm.position;
        next_caster.last_move = demo.num_ticks;
        next_caster.xp = next_caster.xp + cost;
        updateCaster(next_caster);
        setModal('');
        setDrawer('');
        setContext('');
        setConfirm({});
        setResources({ ...resources, [tile?.type]: budget - cost });
      }
    },
    async actionRedeem() {},
    async equipItem(item, caster) {
      const item_type = EQUIP_MAP[item?.type];

      const next_caster = { ...caster, [item_type]: item };
      updateCaster(next_caster);
      setDrawer('');
    },
    async unequipItem(item, caster) {
      const item_type = EQUIP_MAP[item?.type];

      const next_caster = { ...caster, [item_type]: null };
      updateCaster(next_caster);
      setDrawer('');
      setContext('');
      setEquip('');
      setUnequip('');
    },
    castSpell(spell) {},
    async craftChooseCharacter(caster) {
      setContext({ ...context, type: CRAFT_ITEM, caster });
    },
    async craftChooseItem(item) {
      setContext({ ...context, type, item });
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
      const item_type = context?.item;
      const materials = context?.materials || [];

      const rank_rarities = {
        [RARITY_COMMON]: 1,
        [RARITY_RARE]: 2,
        [RARITY_EPIC]: 3,
        [RARITY_LEGENDARY]: 4,
      };

      const rarity_rank = [
        '',
        RARITY_COMMON,
        RARITY_RARE,
        RARITY_EPIC,
        RARITY_LEGENDARY,
      ];

      const tier_range = [
        [TIER_I, TIER_II, TIER_III, TIER_IV],
        [10, 15, 20, 30],
      ];

      const craft_item = (caster) => {
        const position = caster?.position;
        let position_type = '';

        for (let i = 0; i < map?.length; i++) {
          let col = position?.[0];
          let level = +position?.slice(1);
          let row = map?.[i];

          if (row?.level === level) {
            const tile = map?.[i]?.[col];
            position_type = tile?.type;
          }
        }

        let min_rarity = 4;
        let min_level = 30;
        let min_tier = TIER_IV;
        let max_tier = TIER_I;
        for (let i = 0; i < materials?.length; i++) {
          const item = materials?.[i];
          const rank = rank_rarities?.[item?.rarity];
          min_rarity = rank < min_rarity ? rank : min_rarity;
          min_level = item?.level < min_level ? item?.level : min_level;
        }
        for (let i = 0; i < materials?.length; i++) {
          const item_level = materials?.[i]?.level;
          for (let t = 0; t < tier_range[0]; t++) {
            if (item_level <= tier_range[1][t]) {
              min_tier = tier_range[0][t];
              break;
            }
          }
        }

        const isLegendary = position_type === TYPE_LEGENDARY;
        let max_rarity = min_rarity;
        let max_level = min_level;

        if (isLegendary) {
          if (rarity_rank[min_rarity] === RARITY_LEGENDARY) {
            max_level++;
          } else max_rarity++;
        } else {
          if (rarity_rank[min_rarity] === RARITY_EPIC) {
            max_level++;
          } else max_rarity++;
        }

        return {
          type: item_type,
          min_rarity: rarity_rank[min_rarity],
          min_level,
          min_tier,
          max_rarity: rarity_rank[max_rarity],
          max_level,
          max_tier,
        };
      };

      const next_item = craft_item();

      const lowest_item = {
        type: next_item?.type,
        level: next_item?.min_level,
        rarity: next_item?.min_rarity,
        tier: next_item?.min_tier,
      };

      const highest_item = {
        type: next_item?.type,
        level: next_item?.max_level,
        rarity: next_item?.max_rarity,
        tier: next_item?.max_tier,
      };

      const isHigher = Math.random() > 0.75;

      let new_item = isHigher ? highest_item : lowest_item;

      const item_value = {
        [ITEM_HAT]: (level, rarity, tier) => hat(level, rarity, tier),
        [ITEM_ROBE]: (level, rarity, tier) => robe(level, rarity, tier),
        [ITEM_STAFF]: (level, rarity, tier) => staff(level, rarity, tier),
        [ITEM_BOOK]: (level, rarity, tier) => spell(level, rarity, tier),
      };

      const level = new_item?.level;
      const rarity = new_item?.rarity;
      const tier = new_item?.tier;
      const reward = item_value[new_item?.type]?.(level, rarity, tier);

      let next_items = [...inventory.items];

      //  remove items from inventory
      for (let i = 0; i < next_items?.length; i++) {
        for (let m = 0; m < materials?.length; m++) {
          if (next_items?.[i]?.id === materials?.[m]?.id) {
            next_items.splice(i, 1);
          }
        }
      }

      // add new item to inventory
      next_items.push(reward);

      setInventory({
        ...inventory,
        items: next_items,
      });

      // close drawer

      setDrawer('');
      setContext('');
    },
    async openTokens() {
      setTokens(true);
      setDrawer({
        tokens: true,
      });
    },
    async chooseTokenPair(pair) {
      setTokens({ ...tokens, pair, flip: false, amount: 1 });
    },
    async flipSide() {
      const flip = tokens?.flip;
      setTokens({ ...tokens, flip: !flip });
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
    async swapResources() {
      const amount = tokens?.amount;
      const flip = tokens?.flip;
      const input = tokens?.pair?.split('/')?.[!flip ? 0 : 1];
      const output = tokens?.pair?.split('/')?.[!flip ? 1 : 0];
      const input_amount = resources?.[input];
      const output_amount = resources?.[output];

      setResources({
        ...resources,
        [input]: input_amount - amount,
        [output]: output_amount + amount,
      });
      setTokens(null);
      setDrawer('');
    },
    async boostXP() {
      if (!drawer?.boost) {
        setDrawer({
          ...drawer,
          boost: true,
        });
      }
      setContext(INIT_STATE_BOOST);
    },
    async decrementXP(element) {
      let amount = context?.[element];
      if (amount >= 1) amount--;
      setContext({
        ...context,
        [element]: amount,
      });
    },
    async incrementXP(element) {
      let amount = context?.[element];
      let max_amount = resources?.[element];
      if (amount < max_amount)
        setContext({
          ...context,
          [element]: amount + 1,
        });
    },
    async burnResourcesForXP() {
      const total_xp =
        context?.[TYPE_RES1] + context?.[TYPE_RES2] + context?.[TYPE_RES3];
      const next_caster = find(
        spellcasters,
        (caster) => caster.id === drawer?.id,
      );

      if (next_caster && total_xp) {
        next_caster.xp = next_caster.xp + total_xp * 100;
        updateCaster(next_caster);
        setResources({
          ...resources,
          [TYPE_RES1]: resources?.[TYPE_RES1] - context?.[TYPE_RES1],
          [TYPE_RES2]: resources?.[TYPE_RES2] - context?.[TYPE_RES2],
          [TYPE_RES3]: resources?.[TYPE_RES3] - context?.[TYPE_RES3],
        });
        setContext(INIT_STATE_BOOST);
      }
    },
    async updateCasterLevel(caster) {},
    async openDrawerWallet() {
      setDrawer({ type: DRAWER_WALLET });
      setWalletTab(TAB_WALLET);
      setContext(INIT_STATE_WALLET);
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
      setDrawer('');
      setContext({});
    },
    async chooseMint(item) {
      setContext({ ...context, item });
    },
    async confirmMint() {
      setDrawer('');
      setContext({});
    },
    async initPlayer() {
      setDemo({ ...demo, player: true });
    },
    async initLadaAccount() {
      setDemo({ ...demo, ladaAccount: true });
      setResources({ ...resources, lada: 100 });
    },
    async continueRewardsEquip() {
      setPhase(PHASE_EQUIP);
    },
    async continueEquipActions() {
      setPhase(PHASE_ACTIONS);
    },
  };
};
