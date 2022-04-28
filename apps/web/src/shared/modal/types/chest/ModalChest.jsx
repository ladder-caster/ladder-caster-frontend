import React, { useRef } from 'react';
import { _grid, _gridItem, _gridItemSelectable, _gridContainer, _gridLabel,_gridCloseButton } from './ModalChest.styled';
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
  TIER_IV
} from 'core/remix/state';
import { useRemix } from 'core/hooks/remix/useRemix';
import { filter, clamp } from 'lodash';
import NFT from '../../../nft/NFT';
import { _level, _overlay } from '../../../item/Item.styled';
const ModalChest = () => {
  //const { t } = useTranslation();
  const { modalClear, confirmChest } = useActions();
  const [modal] = useRemix(MODAL_ACTIVE);
  const button_ref = useRef();
  const chest_ref = useRef();
  const [inventory] = useRemix(GAME_INVENTORY);
  const chests = filter(inventory?.chests,
    (chest) => chest.tier === modal?.tier).sort((a,b)=>a.level-b.level);
  //const [confirm] = useRemix(GAME_CONFIRM);

  const tierMap = {
    [TIER_I]: 1,
    [TIER_II]: 2,
    [TIER_III]: 3,
    [TIER_IV]: 4,
  }
  const chestTier = tierMap[modal?.tier];
  const columnCount = 4;
  const chestPlaceHolderCount = 20;
  var chestEmptyLimit = chests?.length>chestPlaceHolderCount? chests?.length % columnCount:clamp(chestPlaceHolderCount - chests?.length, 0, chestPlaceHolderCount);
  // fill remaining empty slots in the row
  if(chests?.length>0 && chestEmptyLimit!=0) chestEmptyLimit = columnCount-chestEmptyLimit;
  useClickOutside([button_ref, chest_ref], () => modalClear());
  return (
    <_gridContainer>
      <_gridLabel>{modal?.tier?.split("_")[0]} {chestTier}</_gridLabel>
      <_gridCloseButton><span>close</span></_gridCloseButton>
      <_grid ref={chest_ref}>
        {
          chests.map((chest, index) => {
            return (
              <_gridItemSelectable key={'chest_modal_' + index} onClick={() => { console.log(chest); confirmChest(chest?.mint || chest) }}>
                <_overlay>
                  <_level>
                    <span>{chest.level}</span>
                  </_level>
                </_overlay>

                <NFT
                  type={ITEM_CHEST}
                  tier={chest.tier}
                />

              </_gridItemSelectable>
            )
          })
        }
        {
          [...Array(chestEmptyLimit).keys()].map((x) =>
            <_gridItem key={'chest_non_selectable_' + x} />)
        }
      </_grid>
    </_gridContainer>
  );
};

export default ModalChest;
