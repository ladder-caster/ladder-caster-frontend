import React, { useMemo, useState, useCallback } from 'react';
import { _tab, _button, _disconnect, _link } from './KeysTab.styles';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { useTranslation } from 'react-i18next';
import ManageKey from '../ManageKey';
import { useWallet } from '@solana/wallet-adapter-react';
import { WALLET_TYPE, WEB3AUTH_PLUGIN_STORE } from 'core/remix/state';
import { useActions } from '../../../../../../../../actions';
import { AnimateDots } from '../../../../../animations/AnimateSettings';
import { IconHyperlink } from 'design/icons/hyperlink.icon';
import gameConstantsContext from 'sdk/src/program/GameConstantsContext';

const MENU_EXPORT_PUBLIC_KEY = 'MENU_EXPORT_PUBLIC_KEY';
const network = process.env.REACT_APP_ENV === 'devnet' ? '?cluster=devnet' : '';

const KeysTab = () => {
  const { t } = useTranslation();
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [activeMenu, setActiveMenu] = useState(null);
  const [walletType, setWalletType] = useRemix(WALLET_TYPE);
  const adapterWallet = useWallet();
  const [pluginStore] = useRemix(WEB3AUTH_PLUGIN_STORE);
  const { closeDrawer, clearStates, disconnect, fixAccount } = useActions();

  const handleLogout = useCallback(async () => {
    setWalletType(null);
    closeDrawer();
    clearStates();
    disconnect();
    gameConstantsContext.disconnect();
  }, [adapterWallet, client, walletType]);

  const { publicKey } = useMemo(() => {
    return {
      publicKey: client?.wallet?.publicKey.toString(),
    };
  }, [client]);

  if (activeMenu === MENU_EXPORT_PUBLIC_KEY && publicKey)
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
            pluginStore.torusWalletInstance.showWallet('home');
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
    renderItems.push(
      <_button key="fixaccount" onClick={() => fixAccount()}>
        {t('drawer.settings.key.fix_account')}
      </_button>,
    );
    return renderItems;
  }, [publicKey]);

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
