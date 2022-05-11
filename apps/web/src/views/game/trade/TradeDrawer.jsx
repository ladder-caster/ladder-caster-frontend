import React from 'react';
import {
  _trade,
  _header,
  _title,
  _float,
  _button,
  _stack,
  _close,
  _icon,
  _icon_close,
  _breakpoint,
  _link,
  _container,
} from './TradeDrawer.styled';
import { AnimateButton } from '../../../shared/button/animations/AnimateButton';
import { IconClose } from 'design/icons/close.icon';

import { useRemix } from 'core/hooks/remix/useRemix';
import { VIEW_SIZE } from 'core/remix/state';
import { useActions } from '../../../../actions';
import { useTranslation } from 'react-i18next';
import { IconMoneyIMG } from 'design/icons/money.icon';
function TradeDrawer() {
  const { t } = useTranslation();
  const { closeDrawer } = useActions();
  const [view_height] = useRemix(VIEW_SIZE);
  return (
    <_trade $height={view_height}>
      <_header>
        <_title>{t('drawer.trade.title')}</_title>
        <_float>
          <_close>
            <AnimateButton high>
              <_icon_close onClick={() => closeDrawer()}>
                <IconClose />
              </_icon_close>
            </AnimateButton>
          </_close>
        </_float>
      </_header>
      <_breakpoint />
      <_stack>
        <_title>{t('tease.title')}</_title>
      </_stack>
    </_trade>
  );
}

export default TradeDrawer;
