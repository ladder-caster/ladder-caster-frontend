import React, { useState } from 'react';
import {
  _inventory,
  _chests,
  _subheader,
  _subtitle,
  _tiers,
  _container,
  _loot,
  _divider,
  _wallet,
  _open_inventory,
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
import {
  _header,
  _title,
  _float,
  _close,
  _icon_close,
} from '../trade/TradeDrawer.styled';
import { AnimateButton } from '../../../shared/button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';

const Inventory = () => {
  const { t } = useTranslation();
  const [initialized] = useRemix(GAME_INIT);
  const [casters] = useRemix(CHAIN_CASTERS);
  const [inventoryPanel, setInventoryPanel] = useState(false);
  const render = () => {
    if (!initialized || casters.length === 0) {
      return (
        <_feed>
          <Onboarding />
        </_feed>
      );
    } else if (inventoryPanel) {
      return (
        <>
          <_header>
            <_title>{t('tease.title')}</_title>
          </_header>
          <_open_inventory onClick={() => setInventoryPanel(false)}>
            {t('drawer.close')}
          </_open_inventory>
        </>
      );
    } else {
      return (
        <>
          <_open_inventory onClick={() => setInventoryPanel(true)}>
            {t('inventory.items')}
          </_open_inventory>
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
      );
    }
  };
  return (
    <_inventory>
      <Heading title={t('title.bag')} />
      {render()}
    </_inventory>
  );
};

export default Inventory;
