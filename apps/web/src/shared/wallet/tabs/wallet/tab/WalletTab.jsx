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
} from './WalletTab.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { useMesh } from 'core/state/mesh/useMesh';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { useTranslation } from 'react-i18next';
import { GAME_RESOURCES } from 'core/remix/state';
import { IconResourcee1IMG } from 'design/icons/resourcee1.icon';
import { IconResource2IMG } from 'design/icons/resource2.icon';
import { IconResource3IMG } from 'design/icons/resource3.icon';
import { IconMoneyIMG } from 'design/icons/money.icon';
import { IconSolana } from 'design/icons/solana.icon';
import { truncateDecimals } from 'core/utils/numbers';

const TRUNCATE_DECIMAL = 5;

const WalletTab = () => {
  const { t } = useTranslation();
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [resources, setResources] = useRemix(GAME_RESOURCES);

  const publicKey = useMemo(() => {
    const key = client?.wallet?.payer?._keypair?.publicKey;

    if (!key) return client?.wallet?.publicKey.toString();

    return key ? bs58.encode(key) : '';
  }, [client]);

  return (
    <_tab>
      <_coin>
        <_icon>
          <IconSolana />
        </_icon>
        <_right>
          <_text>
            <_label>{t('wallet.solana')}</_label>
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
            <_label>{t('wallet.lada')}</_label>
            <_amount>
              <span>
                {truncateDecimals(resources?.lada, TRUNCATE_DECIMAL)} LADA
              </span>
            </_amount>
          </_text>
          <_link href={'https://jup.ag/swap/USDC-LADA'} target="_blank">
            <span>{t('lada.getMore')}</span>
          </_link>
        </_right>
      </_coin>
      <_coin>
        <_icon>
          <IconResourcee1IMG />
        </_icon>
        <_right>
          <_text>
            <_label>{t('attribute.name.resource1')}</_label>
            <_amount>
              {truncateDecimals(resources?.resource1, TRUNCATE_DECIMAL)}{' '}
              {t('resources.resource1.symbol')}
            </_amount>
          </_text>
        </_right>
      </_coin>
      <_coin>
        <_icon>
          <IconResource2IMG />
        </_icon>
        <_right>
          <_text>
            <_label>{t('attribute.name.resource2')}</_label>
            <_amount>
              {truncateDecimals(resources?.resource2, TRUNCATE_DECIMAL)}{' '}
              {t('resources.resource2.symbol')}
            </_amount>
          </_text>
        </_right>
      </_coin>
      <_coin>
        <_icon>
          <IconResource3IMG />
        </_icon>
        <_right>
          <_text>
            <_label>{t('attribute.name.resource3')}</_label>
            <_amount>
              {truncateDecimals(resources?.resource3, TRUNCATE_DECIMAL)}{' '}
              {t('resources.resource3.symbol')}
            </_amount>
          </_text>
        </_right>
      </_coin>
    </_tab>
  );
};

export default WalletTab;
