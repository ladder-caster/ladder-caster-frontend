import React, { useMemo } from 'react';
import {
  _tab,
  _button,
  _coin,
  _label,
  _amount,
  _icon,
  _right,
  _link,
  _text,
  _more,
} from './WalletTab.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { useTranslation } from 'react-i18next';
import {
  DRAWER_CONTEXT,
  GAME_RESOURCES,
  TOKEN_ERRA,
  TOKEN_FIYA,
  TOKEN_LADA,
  TOKEN_WADA,
} from 'core/remix/state';
import { IconFireeIMG } from 'design/icons/firee.icon';
import { IconWaterIMG } from 'design/icons/water.icon';
import { IconEarthIMG } from 'design/icons/earth.icon';
import { IconMoneyIMG } from 'design/icons/money.icon';
import { IconSolana } from 'design/icons/solana.icon';
import { truncateDecimals } from 'core/utils/numbers';
import { useActions } from '../../../../../../actions';

const TRUNCATE_DECIMAL = 5;

const WalletTab = () => {
  const { t } = useTranslation();
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [context] = useRemix(DRAWER_CONTEXT);
  const [resources, setResources] = useRemix(GAME_RESOURCES);
  const { getMoreTokens } = useActions();

  const publicKey = useMemo(() => {
    const key = client?.wallet?.payer?._keypair?.publicKey;

    if (!key) return client?.wallet?.publicKey.toString();

    return key ? bs58.encode(key) : '';
  }, [client]);

  return context?.token ? (
    <_tab></_tab>
  ) : (
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
            <_label>Lada Token</_label>
            <_amount>
              <span>
                {truncateDecimals(resources?.lada, TRUNCATE_DECIMAL)} LADA
              </span>
            </_amount>
          </_text>
          <_more onClick={() => getMoreTokens(TOKEN_LADA)}>
            <span>{t('wallet.more.lada')}</span>
          </_more>
          {/*<_link href={'https://jup.ag/swap/USDC-LADA'} target="_blank">*/}
          {/*  <span>{t('lada.getMore')}</span>*/}
          {/*</_link>*/}
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
          <_more onClick={() => getMoreTokens(TOKEN_WADA)}>
            <span>{t('wallet.more.wada')}</span>
          </_more>
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
          <_more onClick={() => getMoreTokens(TOKEN_FIYA)}>
            <span>{t('wallet.more.fiya')}</span>
          </_more>
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
          <_more onClick={() => getMoreTokens(TOKEN_ERRA)}>
            <span>{t('wallet.more.erra')}</span>
          </_more>
        </_right>
      </_coin>
    </_tab>
  );
};

export default WalletTab;
