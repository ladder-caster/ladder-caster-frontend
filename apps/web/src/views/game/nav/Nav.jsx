import React from 'react';
import { _nav, _item, _button } from './Nav.styled';
import {
  VIEW_SPELLCASTERS,
  VIEW_MAP,
  VIEW_HOME,
  VIEW_INVENTORY,
  VIEW_MARKET,
} from 'core/routes/routes';
import { useMesh } from 'core/state/mesh/useMesh';
import { DRAWER_ACTIVE, VIEW_NAVIGATION } from 'core/mesh/state';
import { IconMarketplace } from 'design/icons/marketplace.icon';
import { useLocation } from 'react-router-dom';
import { IconBag } from 'design/icons/bag.icon';
import { IconHat } from 'design/icons/hat.icon';
import { IconMap } from 'design/icons/map.icon';
import { IconHome } from 'design/icons/home.icon';
import { useTranslation } from 'react-i18next';

const Nav = () => {
  const { t } = useTranslation();
  const [, setDrawer] = useMesh(DRAWER_ACTIVE);
  const [view, setView] = useMesh(VIEW_NAVIGATION);

  return (
    <_nav>
      <_item
        onClick={() => {
          setView(VIEW_MARKET);
          setDrawer('');
          localStorage.setItem('lc-tab', VIEW_MARKET);
        }}
      >
        <_button $first $active={view === VIEW_MARKET}>
          <IconMarketplace />
          <span>{t('nav.market')}</span>
        </_button>
      </_item>
      <_item
        onClick={() => {
          setView(VIEW_INVENTORY);
          setDrawer('');
          localStorage.setItem('lc-tab', VIEW_INVENTORY);
        }}
      >
        <_button $active={view === VIEW_INVENTORY}>
          <IconBag />
          <span>{t('nav.bag')}</span>
        </_button>
      </_item>
      <_item
        onClick={() => {
          setView(VIEW_HOME);
          setDrawer('');
          localStorage.setItem('lc-tab', VIEW_HOME);
        }}
      >
        <_button $active={!view || view === VIEW_HOME}>
          <IconHome />
          <span>{t('nav.home')}</span>
        </_button>
      </_item>
      <_item
        onClick={() => {
          setView(VIEW_SPELLCASTERS);
          setDrawer('');
          localStorage.setItem('lc-tab', VIEW_SPELLCASTERS);
        }}
      >
        <_button $active={view === VIEW_SPELLCASTERS}>
          <IconHat />
          <span>{t('nav.casters')}</span>
        </_button>
      </_item>
      <_item
        onClick={() => {
          setView(VIEW_MAP);
          setDrawer('');
          localStorage.setItem('lc-tab', VIEW_MAP);
        }}
      >
        <_button $last $active={view === VIEW_MAP}>
          <IconMap />
          <span>{t('nav.map')}</span>
        </_button>
      </_item>
    </_nav>
  );
};

export default Nav;
