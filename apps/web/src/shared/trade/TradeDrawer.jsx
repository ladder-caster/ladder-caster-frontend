import React from 'react';
import {
  _trade,
  _close,
  _float,
  _header,
  _icon,
  _title,
  _body,
} from './TradeDrawer.styled';
import { IconClose } from 'design/icons/close.icon';
import { useTranslation } from 'react-i18next';
import { useActions } from '../../../actions';
import { TAB_PLACE_ORDER, TAB_SWAP, TABS_SWAP_ORDER } from 'core/mesh/tabs';
import Tabs from '../tabs/Tabs';
import SwapTab from './tabs/swap/SwapTab';
import OrderTab from './tabs/order/OrderTab';
import { useMesh } from 'core/state/mesh/useMesh';
import { VIEW_SIZE } from 'core/mesh/state';
import Breakpoint from '../breakpoint/Breakpoint';

const TradeDrawer = () => {
  const { t } = useTranslation();
  const { closeDrawer } = useActions();
  const [view_height] = useMesh(VIEW_SIZE);

  const tabs_swap_order = {
    [TAB_SWAP]: {
      name: t('drawer.trade.swap'),
      View: SwapTab,
    },
    [TAB_PLACE_ORDER]: {
      name: t('drawer.trade.order'),
      View: OrderTab,
    },
  };

  return (
    <_trade $height={view_height}>
      <_header>
        <_title>{t('drawer.trade.title')}</_title>
        <_float>
          <_close>
            <_icon onClick={() => closeDrawer()}>
              <IconClose />
            </_icon>
          </_close>
        </_float>
      </_header>
      <_body>
        <Breakpoint />
        <Tabs padding tab_id={TABS_SWAP_ORDER} views={tabs_swap_order} />
      </_body>
    </_trade>
  );
};

export default TradeDrawer;
