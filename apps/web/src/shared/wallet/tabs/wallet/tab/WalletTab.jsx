import React, { useMemo } from 'react';
import {
  _tab,
  _button,
  _coin,
  _label,
  _amount,
  _icon,
  _right,
  _swap,
  _text,
} from './WalletTab.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { useTranslation } from 'react-i18next';
import { GAME_RESOURCES, TYPE_EARTH, TYPE_FIRE, TYPE_GOLD, TYPE_WATER } from 'core/remix/state';
import { IconFireeIMG } from 'design/icons/firee.icon';
import { IconWaterIMG } from 'design/icons/water.icon';
import { IconEarthIMG } from 'design/icons/earth.icon';
import { IconMoneyIMG } from 'design/icons/money.icon';
import { IconSolana } from 'design/icons/solana.icon';
import { truncateDecimals } from 'core/utils/numbers';
import { useActions } from '../../../../../../actions';

const TRUNCATE_DECIMAL = 4;

const WalletTab = () => {
  const { t } = useTranslation();
  const { openDrawerTrade } = useActions();
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [resources, setResources] = useRemix(GAME_RESOURCES);

  return (
    <_tab>
      <_coin>
        <_icon>
          <IconSolana />
        </_icon>
        <_right>
          <_text>
            <_label>Solana</_label>
            <_amount>
              {truncateDecimals(resources?.sol, TRUNCATE_DECIMAL)} SOL
            </_amount>
          </_text>
        </_right>
      </_coin>
      <_coin>
        <_icon>
          <IconMoneyIMG />
        </_icon>
        <_right>
          <_text>
            <_label>Lada</_label>
            <_amount>
              {truncateDecimals(resources?.lada, TRUNCATE_DECIMAL)} LADA
            </_amount>
          </_text>
          <_swap $element={TYPE_GOLD} onClick={() => openDrawerTrade(TYPE_GOLD)}>
            {t('wallet.buy.lada')}
          </_swap>
        </_right>
      </_coin>
      <_coin>
        <_icon>
          <IconWaterIMG />
        </_icon>
        <_right>
          <_text>
            <_label>Water</_label>
            <_amount>
              {truncateDecimals(resources?.water, TRUNCATE_DECIMAL)} WADA
            </_amount>
          </_text>
          <_swap $element={TYPE_WATER} onClick={() => openDrawerTrade(TYPE_WATER)}>
            {t('wallet.buy.wada')}
          </_swap>
        </_right>
      </_coin>
      <_coin>
        <_icon>
          <IconFireeIMG />
        </_icon>
        <_right>
          <_text>
            <_label>Fire</_label>
            <_amount>
              {truncateDecimals(resources?.fire, TRUNCATE_DECIMAL)} FIYA
            </_amount>
          </_text>
          <_swap $element={TYPE_FIRE} onClick={() => openDrawerTrade(TYPE_FIRE)}>
            {t('wallet.buy.fiya')}
          </_swap>
        </_right>
      </_coin>
      <_coin>
        <_icon>
          <IconEarthIMG />
        </_icon>
        <_right>
          <_text>
            <_label>Earth</_label>
            <_amount>
              {truncateDecimals(resources?.earth, TRUNCATE_DECIMAL)} ERRA
            </_amount>
          </_text>
          <_swap $element={TYPE_EARTH} onClick={() => openDrawerTrade(TYPE_EARTH)}>
            {t('wallet.buy.erra')}
          </_swap>
        </_right>
      </_coin>
    </_tab>
  );
};

export default WalletTab;
