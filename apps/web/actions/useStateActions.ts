import {
  CHAIN_CASTERS,
  CHAIN_GAME,
  CHAIN_ITEMS,
  CHAIN_LOCAL_CLIENT,
  CHAIN_PLAYER,
} from 'chain/hooks/state';
import { useTranslation } from 'react-i18next';
import { useRemix } from 'core/hooks/remix/useRemix';
import { INIT_STATE_REDEEM, INIT_STATE_TRADE } from 'core/remix/init';
import {
  CRAFT_CHARACTER,
  CRAFT_MATERIALS,
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
  DRAWER_CRAFT,
  DRAWER_CRANK,
  DRAWER_INVENTORY,
  DRAWER_SETTINGS,
  DRAWER_SPELLCASTER,
  DRAWER_TOKENS,
  DRAWER_TRADE,
  DRAWER_WALLET,
  EQUIP_ITEM,
  GAME_CONFIRM,
  GAME_INVENTORY,
  GAME_RESOURCES,
  GAME_SPELLCASTERS,
  MODAL_ACTIVE,
  MODAL_CHEST,
  MODAL_LOOT,
  MODAL_MINT,
  MODAL_MOVE,
  MODAL_REDEEM,
  MODAL_SPELL,
  PHASE_ACTIONS,
  PLAYER_CHARACTER,
  SIDE_BUY,
  SIDE_SELL,
  TABS_CHARACTER_ACTIONS,
  TOKENS_ACTIVE,
  TRADE_ORDERBOOK,
  TYPE_RES1,
  TYPE_RES2,
  TYPE_RES3,
  UNEQUIP_ITEM,
  USER_PHASE,
  VIEW_NAVIGATION,
} from 'core/remix/state';
import {
  TABS_MINT_REDEEM,
  TAB_MINT,
  TAB_REDEEM,
  TAB_WALLET,
} from 'core/remix/tabs';
import {
  VIEW_INVENTORY,
  VIEW_MAP,
  VIEW_SPELLCASTERS,
} from 'core/routes/routes';

export const useStateActions = () => {
  const { t } = useTranslation();
  const [orderbook] = useRemix(TRADE_ORDERBOOK);
  const [drawer, setDrawer] = useRemix(DRAWER_ACTIVE);
  const [context, setContext] = useRemix(DRAWER_CONTEXT);
  const [resources, setResources] = useRemix(GAME_RESOURCES);
  const [inventory, setInventory] = useRemix(GAME_INVENTORY);
  const [tokens, setTokens] = useRemix(TOKENS_ACTIVE);
  const [, setCasterTab] = useRemix(TABS_CHARACTER_ACTIONS);
  const [, setWalletTab] = useRemix(TABS_MINT_REDEEM);
  const [, setModal] = useRemix(MODAL_ACTIVE);
  const [, setEquip] = useRemix(EQUIP_ITEM);
  const [, setUnequip] = useRemix(UNEQUIP_ITEM);
  const [, setConfirm] = useRemix(GAME_CONFIRM);
  const [, setPhase] = useRemix(USER_PHASE);
  const [, setClient] = useRemix(CHAIN_LOCAL_CLIENT);
  const [, setPlayer] = useRemix(CHAIN_PLAYER);
  const [, setItems] = useRemix(CHAIN_ITEMS);
  const [, setCasters] = useRemix(CHAIN_CASTERS);
  const [, setSpellcasters] = useRemix(GAME_SPELLCASTERS);
  const [, setGame] = useRemix(CHAIN_GAME);
  const [, setView] = useRemix(VIEW_NAVIGATION);

  return {
    closeDrawer() {
      setDrawer('');
      setEquip('');
      setUnequip('');
      setContext('');
      setWalletTab('');
    },
    closeModal() {
      setModal({});
      setDrawer('');
      setContext('');
      setConfirm({});
    },
    clearStates() {
      //TODO: clear game constants
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
    visitCasters() {
      setView(VIEW_SPELLCASTERS);
    },
    visitMap() {
      setView(VIEW_MAP);
    },
    visitInventory() {
      setView(VIEW_INVENTORY);
    },
    modalLoot(caster) {
      setModal({
        active: true,
        type: MODAL_LOOT,
        options: { caster },
      });
    },
    modalSpell(caster) {
      setModal({
        active: true,
        type: MODAL_SPELL,
        options: { caster },
      });
    },
    modalMove(caster) {
      setModal({
        active: true,
        type: MODAL_MOVE,
        options: { caster },
      });
    },
    modalRedeem(caster) {
      setModal({
        active: true,
        type: MODAL_REDEEM,
        options: { caster },
      });
    },
    modalChest(tier) {
      setModal({
        active: true,
        type: MODAL_CHEST,
        tier,
      });
    },
    modalBuyLADA() {
      setModal({
        active: true,
        type: MODAL_MINT,
        description: t('modal.buy.description'),
      });
    },
    drawerCaster(id) {
      setCasterTab(PLAYER_CHARACTER);
      setDrawer({ type: DRAWER_SPELLCASTER, id });
    },
    drawerCraft(caster = null) {
      setDrawer({ type: DRAWER_CRAFT });
      if (caster) setContext({ type: CRAFT_MATERIALS, caster });
      else setContext({ type: CRAFT_CHARACTER });
    },
    drawerTrade() {
      setDrawer({ type: DRAWER_TRADE });
      setContext({ ...INIT_STATE_TRADE });
    },
    drawerTokens() {
      setDrawer({ type: DRAWER_TOKENS });
    },
    drawerInventory(item) {
      setDrawer({ type: DRAWER_INVENTORY });
      setContext({ ...inventory, item });
    },
    drawerSettings() {
      setDrawer({ type: DRAWER_SETTINGS });
    },
    drawerWallet() {
      setDrawer({ type: DRAWER_WALLET });
      setWalletTab(TAB_WALLET);
      setContext(INIT_STATE_REDEEM);
    },
    drawerRedeem() {
      setDrawer({ type: DRAWER_WALLET });
      setWalletTab(TAB_REDEEM);
      setContext(INIT_STATE_REDEEM);
    },
    drawerMint() {
      setDrawer({ type: DRAWER_WALLET });
      setWalletTab(TAB_MINT);
      setContext(INIT_STATE_REDEEM);
    },
    drawerCrank() {
      setDrawer({
        type: DRAWER_CRANK,
      });
    },
    confirmMove(action) {
      setConfirm(action);
    },
    cancelMove() {
      setConfirm({});
    },
    chooseMintItem(item) {
      setContext({ ...context, item });
    },
    chooseMintCaster(caster) {
      setContext({ ...context, caster });
    },
    chooseRedeem(nft) {
      setContext({ ...context, nft });
    },
    continueEquipActions() {
      setPhase(PHASE_ACTIONS);
    },
    craftChooseCharacter(caster) {
      setContext({ ...context, type: CRAFT_MATERIALS, caster });
    },
    craftChooseItem(item) {
      setContext({ ...context, type: CRAFT_MATERIALS, item });
    },
    craftChooseMaterials(item) {
      let materials = context?.materials || [];
      for (let i = 0; i < 3; i++) {
        if (!materials[i]) {
          materials[i] = item;
          break;
        }
      }
      setContext({ ...context, materials });
    },
    removeMaterials(index) {
      let materials = context?.materials || [];
      let type = context?.type;
      materials[index] = null;

      if (!materials[0] || !materials[1] || !materials[2]) {
        type = CRAFT_MATERIALS;
      }
      setContext({ ...context, type, materials });
    },
    chooseEquip(item) {
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
    unequipConfirm(item, caster) {
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
    decrementXP(element, custom) {
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
    incrementXP(element, custom) {
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
    decrementResource() {
      const amount = tokens?.amount;
      if (amount >= 1) setTokens({ ...tokens, amount: amount - 1 });
    },
    incrementResource() {
      const amount = tokens?.amount;
      const flip = tokens?.flip;
      const input = tokens?.pair?.split('/')?.[!flip ? 0 : 1];
      const input_amount = resources?.[input];
      if (amount < input_amount) setTokens({ ...tokens, amount: amount + 1 });
    },
    boostXP(caster) {
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
        [TYPE_RES1]: 0,
        [TYPE_RES2]: 0,
        [TYPE_RES3]: 0,
      });
    },
  };
};
