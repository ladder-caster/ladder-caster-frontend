import React, { useState, useEffect } from 'react';
import { _nft } from './NFT.styled';
import {
  ITEM_BOOK,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  ITEM_CHEST,
  TIER_I,
  TIER_II,
  TIER_III,
  TIER_IV,
} from 'core/mesh/state';

const NFT = ({ height, type, tier, zindex, all, small }) => {
  const src = {
    [ITEM_HAT]: {
      [TIER_I]: require('../../../../libs/design/assets/T1_HAT.png'),
      [TIER_II]: require('../../../../libs/design/assets/T2_HAT.png'),
      [TIER_III]: require('../../../../libs/design/assets/T3_HAT.png'),
      [TIER_IV]: require('../../../../libs/design/assets/T4_HAT.png'),
    },
    [ITEM_ROBE]: {
      [TIER_I]: require('../../../../libs/design/assets/T1_ROBE.png'),
      [TIER_II]: require('../../../../libs/design/assets/T2_ROBE.png'),
      [TIER_III]: require('../../../../libs/design/assets/T3_ROBE.png'),
      [TIER_IV]: require('../../../../libs/design/assets/T4_ROBE.png'),
    },
    [ITEM_BOOK]: {
      [TIER_I]: require('../../../../libs/design/assets/T1_BOOK.png'),
      [TIER_II]: require('../../../../libs/design/assets/T2_BOOK.png'),
      [TIER_III]: require('../../../../libs/design/assets/T3_BOOK.png'),
      [TIER_IV]: require('../../../../libs/design/assets/T4_BOOK.png'),
    },
    [ITEM_STAFF]: {
      [TIER_I]: require('../../../../libs/design/assets/T1_STAFF.png'),
      [TIER_II]: require('../../../../libs/design/assets/T2_STAFF.png'),
      [TIER_III]: require('../../../../libs/design/assets/T3_STAFF.png'),
      [TIER_IV]: require('../../../../libs/design/assets/T4_STAFF.png'),
    },
    [ITEM_CHEST]: {
      [TIER_I]: require('../../../../libs/design/assets/T1_CHEST.png'),
      [TIER_II]: require('../../../../libs/design/assets/T2_CHEST.png'),
      [TIER_III]: require('../../../../libs/design/assets/T3_CHEST.png'),
      [TIER_IV]: require('../../../../libs/design/assets/T4_CHEST.png'),
    },
  }[type]?.[tier];

  let img;
  if (src) img = src;

  return (
    <_nft
      $small={small}
      $all={all}
      src={img}
      alt={'NFT item'}
      $height={height}
      $zindex={zindex}
    />
  );
};

export default NFT;
