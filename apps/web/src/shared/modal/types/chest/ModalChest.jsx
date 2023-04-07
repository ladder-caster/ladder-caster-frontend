import React, { useRef, useMemo } from 'react';
import {
  _grid,
  _grid_item,
  _grid_item_selectable,
  _grid_container,
  _grid_label,
  _grid_close_button,
  _double_height_clickable,
} from './ModalChest.styled';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../../../actions';
import { useClickOutside } from 'core/hooks/useClickOutside';

import {
  GAME_CONFIRM,
  GAME_INVENTORY,
  ITEM_CHEST,
  MODAL_ACTIVE,
  TIER_I,
  TIER_II,
  TIER_III,
  TIER_IV,
} from 'core/mesh/state';
import { useMesh } from 'core/state/mesh/useMesh';
import { filter, clamp } from 'lodash';
import NFT from '../../../nft/NFT';
import { _level, _overlay } from '../../../item/Item.styled';
const ModalChest = () => {
  const { t } = useTranslation();
  const { closeModal, openChest } = useActions();
  const [modal] = useMesh(MODAL_ACTIVE);
  const grid_ref = useRef();
  const [inventory] = useMesh(GAME_INVENTORY);
  const chests = useMemo(() => {
    if (!inventory?.chests) return [];
    return filter(
      inventory?.chests,
      (chest) => chest.tier === modal?.tier,
    ).sort((a, b) => b?.level - a?.level);
  }, [inventory]);
  //const [confirm] = useMesh(GAME_CONFIRM);

  const tierMap = {
    [TIER_I]: 1,
    [TIER_II]: 2,
    [TIER_III]: 3,
    [TIER_IV]: 4,
  };
  const columnCount = 4;
  const chestPlaceHolderCount = 20;
  let chestEmptyLimit =
    chests?.length && chests?.length > chestPlaceHolderCount
      ? chests?.length % columnCount
      : clamp(chestPlaceHolderCount - chests?.length, 0, chestPlaceHolderCount);
  // fill remaining empty slots in the row
  if (chests?.length > 0 && chestEmptyLimit !== 0)
    chestEmptyLimit =
      columnCount - chestEmptyLimit >= 0 ? columnCount - chestEmptyLimit : 0;
  useClickOutside([grid_ref], () => closeModal());
  const emptyGrid = chestEmptyLimit > 0 ? Array(chestEmptyLimit).keys() : [];
  const gridMap = [...chests, ...emptyGrid];

  return (
    <_grid_container>
      <_grid_label>
        {t('modal.chests.title').toUpperCase()} {tierMap[modal?.tier]}
      </_grid_label>
      <_grid ref={grid_ref} rows={Math.floor(gridMap.length / 4)}>
        {gridMap.map((chest, index) => {
          if (chest?.tier) {
            return (
              <_grid_item_selectable
                key={'chest_full_' + index}
                onClick={() => openChest(chest?.mint || chest)}
              >
                <_overlay>
                  <_level>
                    <span>{chest.level}</span>
                  </_level>
                </_overlay>

                <NFT type={ITEM_CHEST} tier={chest.tier} />
              </_grid_item_selectable>
            );
          }

          return <_grid_item key={'chest_empty_' + index}></_grid_item>;
        })}
      </_grid>
      <_grid_close_button>
        <span>{t('drawer.close')}</span>
        <_double_height_clickable />
      </_grid_close_button>
    </_grid_container>
  );
};

export default ModalChest;
