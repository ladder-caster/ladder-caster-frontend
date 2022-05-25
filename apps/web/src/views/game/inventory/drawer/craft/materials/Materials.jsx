import React, { useMemo, useRef } from 'react';
import {
  _materials,
  _breakpoint,
  _grid,
  _confirm,
  _button,
  _text,
  _selected,
  _material,
  _container,
  _title,
  _odds,
  _lowest,
  _highest,
  _percent,
  _chance,
  _amount,
  _icon,
  _cost,
  _cost_text,
  _warning,
} from './Materials.styled';
import Rank from '../../../../spellcasters/drawer/rank/Rank';
import { useRemix } from 'core/hooks/remix/useRemix';
import {
  DRAWER_ACTIVE,
  DRAWER_CONTEXT,
  GAME_INVENTORY,
  GAME_MAP,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
  TIER_I,
  TIER_II,
  TIER_III,
  TIER_IV,
  TYPE_LEGENDARY,
  VIEW_SIZE,
  TYPE_RES3,
  TYPE_RES1,
  TYPE_RES2,
  USER_PHASE,
  PHASE_REWARDS,
  PHASE_EQUIP,
} from 'core/remix/state';
import { gridList } from 'core/utils/lists';
import { map } from 'lodash';
import { _row } from '../character/Character.styled';
import { filter, find, indexOf } from 'lodash';
import Item from '../../../../../../shared/item/Item';
import { useSize } from 'core/hooks/useSize';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../../../actions';
import { IconResourcee1IMG } from 'design/icons/resourcee1.icon';
import { IconResource2IMG } from 'design/icons/resource2.icon';
import { IconResource3IMG } from 'design/icons/resource3.icon';
import Boost from '../../../../spellcasters/drawer/boost/Boost';
import { findIndex, clamp } from 'lodash';
import { IconMoneyIMG } from 'design/icons/money.icon';

const COST_MULTIPLIER = 5;

const Materials = () => {
  const { t } = useTranslation();
  const [drawer] = useRemix(DRAWER_ACTIVE);
  const [context] = useRemix(DRAWER_CONTEXT);
  const [board] = useRemix(GAME_MAP);
  const [inventory] = useRemix(GAME_INVENTORY);
  const [view_height] = useRemix(VIEW_SIZE);
  const [phase] = useRemix(USER_PHASE);
  const material_ref = useRef();
  const material_size = useSize(material_ref);
  const caster = context?.caster;
  const col = caster?.position?.slice(0, 1);
  const row = +caster?.position?.slice(1, caster?.position?.length);
  const tile_level = board?.[row]?.[col]?.level;

  const isBoost = drawer?.boost;

  const position = context?.caster?.position;
  const item_type = context?.item;
  const materials = context?.materials ?? [];
  const { craftChooseMaterials, removeMaterials, craftItem } = useActions();

  const different_types = useMemo(() => {
    if (materials?.length === 3) {
      // transitive ... x = y, y = z then x = z
      return (
        materials[0].type !== materials[1].type &&
        materials[1].type !== materials[2].type &&
        materials[0].type !== materials[2].type
      );
    }
  }, [materials, JSON.stringify(materials)]);

  const position_type = useMemo(() => {
    for (let i = 0; i < board?.length; i++) {
      let col = position?.[0];
      let level = +position?.slice(1);
      let row = board?.[i];

      if (row?.level === level) {
        const tile = board?.[i]?.[col];
        return tile?.type;
      }
    }
  }, [position]);

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
    [5, 10, 15, 30],
  ];

  const craft_item = useMemo(() => {
    const rarities = [];
    const levels = [];
    materials.map((mat) => {
      rarities.push(rank_rarities[mat.rarity]);
      levels.push(mat.tier);
    });
    let min_rarity = Math.min(4, ...rarities);
    let min_level = Math.min(30, ...levels);
    // clamps to lvl/5 (-1 for bounds e.g 10/15)... due to clamping to 3 even 20,25,30 produces similar results
    const isCategoryBounds = min_level % 5 === 0;
    let index =
      min_level > 5
        ? clamp(Math.floor(min_level / 5) - (isCategoryBounds ? 1 : 0), 1, 3)
        : 0;
    let min_tier = tier_range[1][index];
    let max_tier = TIER_I;

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
      lada_cost: index + 1,
    };
  }, [item_type, materials?.length]);

  const lowest_item = {
    type: craft_item?.type,
    level: craft_item?.min_level,
    rarity: craft_item?.min_rarity,
    tier: craft_item?.min_tier,
  };

  const highest_item = {
    type: craft_item?.type,
    level: craft_item?.max_level,
    rarity: craft_item?.max_rarity,
    tier: craft_item?.max_tier,
  };

  const confirm = materials?.[0] && materials?.[1] && materials?.[2];

  const filter_items = filter(
    inventory?.items,
    (item) => item.level <= caster.level,
  );

  const removeMaterial = async (item) => {
    const index = findIndex(materials, (material) => material.id === item.id);
    if (index !== -1) await removeMaterials(index);
  };

  const list_items = useMemo(() => {
    if (filter_items?.length) {
      const list = gridList(filter_items);

      return map(list, (row) => {
        return (
          <_row>
            {map(row, (item) => {
              const selected = find(
                materials,
                (material) => material?.id === item?.id,
              );
              return (
                <Item
                  grid
                  item={item}
                  selected={selected}
                  callback={() =>
                    !selected
                      ? craftChooseMaterials(item)
                      : removeMaterial(item)
                  }
                />
              );
            })}
          </_row>
        );
      });
    }
  }, [filter_items]);

  return (
    <_materials $height={view_height}>
      {caster && <Rank caster={caster} />}
      <_breakpoint />
      {isBoost && <Boost />}
      {!isBoost && (
        <>
          <_selected>
            <_material $height={material_size?.height} ref={material_ref}>
              {materials?.[0] && (
                <Item
                  small
                  item={materials?.[0]}
                  callback={() => removeMaterials(0)}
                />
              )}
            </_material>
            <_material>
              {materials?.[1] && (
                <Item
                  small
                  item={materials?.[1]}
                  callback={() => removeMaterials(1)}
                />
              )}
            </_material>
            <_material>
              {materials?.[2] && (
                <Item
                  small
                  item={materials?.[2]}
                  callback={() => removeMaterials(2)}
                />
              )}
            </_material>
          </_selected>
          <_breakpoint />
          <_title>{!confirm && t('drawer.inventory.materials.title')}</_title>
          <_container>
            {confirm ? (
              <_confirm>
                <_text>
                  {t('drawer.inventory.confirm.text', {
                    chance: different_types ? 25 : 40,
                  })}
                </_text>
                <_odds>
                  <_lowest>
                    <_percent>
                      <_chance>{different_types ? '75%' : '60%'}</_chance>
                    </_percent>
                    <Item all craft item={lowest_item} />
                  </_lowest>
                  <_highest>
                    <_percent>
                      <_chance>{different_types ? '25%' : '40%'}</_chance>
                    </_percent>
                    <Item all craft item={highest_item} />
                  </_highest>
                </_odds>
                <_cost>
                  <_cost_text>{t('modal.move.cost')}:</_cost_text>
                  <_icon $element={confirm?.tileType}>
                    <IconMoneyIMG />
                  </_icon>
                  <_amount>{craft_item?.lada_cost}</_amount>
                </_cost>
                {(phase === PHASE_REWARDS || phase === PHASE_EQUIP) && (
                  <_warning>{t('drawer.craft.warning')}</_warning>
                )}
                <_button onClick={() => craftItem()}>
                  {t('drawer.inventory.confirm.button')}
                </_button>
              </_confirm>
            ) : (
              <_grid>{list_items}</_grid>
            )}
          </_container>
        </>
      )}
    </_materials>
  );
};

export default Materials;
