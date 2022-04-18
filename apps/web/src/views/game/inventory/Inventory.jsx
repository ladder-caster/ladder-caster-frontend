import React from 'react';
import {
  _inventory,
  _header,
  _title,
  _chests,
  _subheader,
  _subtitle,
  _tiers,
  _container,
  _loot,
  _divider,
  _wallet,
} from './Inventory.styled';
import { _feed } from '../home/Dashboard.styled';
import { useTranslation } from 'react-i18next';
import Chest from './chest/Chest';
import { IconTreasure } from 'design/icons/treasure.icon';
import Thumbar from '../../../shared/thumbar/Thumbar';
import Craft from './craft/Craft';
import Category from './category/Category';
import {
  GAME_INIT,
  ITEM_BOOK,
  ITEM_HAT,
  ITEM_ROBE,
  ITEM_STAFF,
  TIER_I,
  TIER_II,
  TIER_III,
  TIER_IV,
} from 'core/remix/state';
import { _controls, _speed } from '../header/Header.styled';
import Heading from '../../../shared/heading/Heading';
import { Onboarding } from '../home/onboarding/Onboarding';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_CASTERS } from 'chain/hooks/state';

const Inventory = () => {
  const { t } = useTranslation();
  const [initialized] = useRemix(GAME_INIT);
  const [casters] = useRemix(CHAIN_CASTERS);

  return (
    <_inventory>
      <Heading title={t('title.bag')} />
      {(!initialized || casters?.length === 0) && (
        <_feed>
          <Onboarding />
        </_feed>
      )}
      {initialized && casters?.length !== 0 && (
        <>
          <_container>
            <Category type={ITEM_HAT} />
            <Category type={ITEM_ROBE} />
            <Category type={ITEM_STAFF} />
            <Category type={ITEM_BOOK} />
          </_container>
          <Thumbar>
            <_chests>
              <_subheader>
                <_subtitle>
                  <IconTreasure />
                  <span>{t('inventory.chests')}</span>
                </_subtitle>
              </_subheader>
              <_loot>
                <_tiers>
                  <Chest tier={TIER_I} />
                  <Chest tier={TIER_II} />
                  <Chest tier={TIER_III} />
                  <Chest tier={TIER_IV} />
                </_tiers>
                <Craft />
              </_loot>
            </_chests>
          </Thumbar>
        </>
      )}
    </_inventory>
  );
};

export default Inventory;
