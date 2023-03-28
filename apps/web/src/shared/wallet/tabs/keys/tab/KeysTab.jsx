import React, { useMemo, useState, useCallback } from 'react';
import { _tab, _button, _disconnect, _link } from './KeysTab.styles';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT, INIT_CHAIN_LOAD } from 'chain/hooks/state';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { useTranslation } from 'react-i18next';
import ManageKey from '../ManageKey';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAutoSignIn } from 'core/hooks/useAutoSignIn';
import {
  BURNER_TYPE,
  STANDARD_TYPE,
  W3A_TYPE,
  WALLET_TYPE,
  WEB3AUTH_PLUGIN_STORE,
} from 'core/remix/state';
import { useActions } from '../../../../../../actions';
import { AnimateDots } from '../../../../../views/game/animations/AnimateSettings';
import { IconHyperlink } from 'design/icons/hyperlink.icon';
import config from '../../../../../../src/utils/config';

const MENU_EXPORT_SECRET_KEY = 'MENU_EXPORT_SECRET_KEY';
const MENU_EXPORT_PUBLIC_KEY = 'MENU_EXPORT_PUBLIC_KEY';
const network = config.environment === 'devnet' ? '?cluster=devnet' : '';

const KeysTab = () => {
  const { t } = useTranslation();
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [activeMenu, setActiveMenu] = useState(null);
  const [walletType, setWalletType] = useRemix(WALLET_TYPE);
  const { handleDisconnect } = useAutoSignIn();
  const adapterWallet = useWallet();
  const [pluginStore] = useRemix(WEB3AUTH_PLUGIN_STORE);
  const [, setInitLoading] = useRemix(INIT_CHAIN_LOAD);
  const {
    closeDrawer,
    clearStates,
    web3AuthDisconnect,
    fixAccount,
  } = useActions();

  const handleLogout = useCallback(async () => {
    setWalletType(null);
    closeDrawer();
    clearStates();
    if (walletType === STANDARD_TYPE) handleDisconnect();
    else if (walletType === W3A_TYPE) web3AuthDisconnect();
  }, [adapterWallet, client, walletType]);

  const { secretKey, publicKey } = useMemo(() => {
    let { secretKey = null, publicKey = null } =
      client?.wallet?.payer?._keypair || {};

    if (walletType !== BURNER_TYPE) {
      return {
        publicKey: client?.wallet?.publicKey.toString(),
      };
    }

    return {
      secretKey: secretKey ? bs58.encode(secretKey) : '',
      publicKey: publicKey ? bs58.encode(publicKey) : '',
    };
  }, [client]);

  if (activeMenu === MENU_EXPORT_SECRET_KEY && secretKey)
    return (
      <ManageKey
        hasWarning
        hasBlur
        title={t('drawer.settings.key.export.secret')}
        type={t('drawer.settings.key.type.secret').toLocaleLowerCase()}
        keyValue={secretKey}
        close={() => setActiveMenu(null)}
      />
    );
  else if (activeMenu === MENU_EXPORT_PUBLIC_KEY && publicKey)
    return (
      <ManageKey
        title={t('drawer.settings.key.share.public')}
        type={t('drawer.settings.key.type.public').toLocaleLowerCase()}
        keyValue={publicKey}
        close={() => setActiveMenu(null)}
      />
    );
  const renderMenu = useMemo(() => {
    let renderItems = [];
    if (publicKey) {
      renderItems.push(
        <_button
          key="torusOpen"
          onClick={() => {
            pluginStore.plugins['torusWallet'].torusWalletInstance.showWallet(
              'home',
            );
          }}
        >
          {t('drawer.settings.key.web3auth')}
        </_button>,
      );
      renderItems.push(
        <_button
          key="share"
          onClick={() => setActiveMenu(MENU_EXPORT_PUBLIC_KEY)}
        >
          {t('drawer.settings.key.share.public')}
        </_button>,
      );
      renderItems.push(
        <_link
          key="explorer"
          href={`https://solscan.io/account/${publicKey}${network}`}
          target="_blank"
          rel="noreferrer"
        >
          {t('drawer.settings.key.block.explorer')} <IconHyperlink />
        </_link>,
      );
    }
    if (secretKey) {
      renderItems = [
        ...renderItems.splice(0, 1),
        <_link
          key="explorer"
          href={`https://solscan.io/account/${publicKey}${network}`}
          target="_blank"
          rel="noreferrer"
        >
          {t('drawer.settings.key.block.explorer')} <IconHyperlink />
        </_link>,
        renderItems.slice(2),
      ];
    }
    renderItems.push(
      <_button key="fixaccount" onClick={() => fixAccount()}>
        {t('drawer.settings.key.fix_account')}
      </_button>,
    );
    return renderItems;
  }, [publicKey, secretKey]);
  return (
    <_tab>
      {renderMenu}

      <AnimateDots>
        <_disconnect onClick={() => handleLogout()}>
          {t('drawer.settings.disconnect')}
        </_disconnect>
      </AnimateDots>
    </_tab>
  );
};

export default KeysTab;
