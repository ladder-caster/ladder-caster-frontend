import React, { useMemo, useState, useCallback } from 'react';
import { _tab, _button, _disconnect, _link } from './KeysTab.styles';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { useTranslation } from 'react-i18next';
import ManageKey from '../ManageKey';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAutoSignIn } from 'core/hooks/useAutoSignIn';
import { WALLET_TYPE } from 'core/remix/state';
import { useActions } from '../../../../../../actions';
import { AnimateDots } from '../../../../../views/game/animations/AnimateSettings';
import { IconHyperlink } from 'design/icons/hyperlink.icon';

const MENU_EXPORT_SECRET_KEY = 'MENU_EXPORT_SECRET_KEY';
const MENU_EXPORT_PUBLIC_KEY = 'MENU_EXPORT_PUBLIC_KEY';
const network = process.env.REACT_APP_ENV === 'devnet' ? '?cluster=devnet' : '';

const KeysTab = () => {
  const { t } = useTranslation();
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const [activeMenu, setActiveMenu] = useState(null);
  const [, setWalletType] = useRemix(WALLET_TYPE);
  const { handleDisconnect } = useAutoSignIn();
  const adapterWallet = useWallet();
  const { closeDrawer, clearStates } = useActions();

  const handleLogout = useCallback(() => {
    setWalletType(null);
    closeDrawer();
    clearStates();
    if (adapterWallet.publicKey) handleDisconnect();
  }, [adapterWallet, client]);

  const { secretKey, publicKey } = useMemo(() => {
    let { secretKey = null, publicKey = null } =
      client?.wallet?.payer?._keypair || {};

    if (!publicKey) {
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

  return (
    <_tab>
      {publicKey && (
        <_button onClick={() => setActiveMenu(MENU_EXPORT_PUBLIC_KEY)}>
          {t('drawer.settings.key.share.public')}
        </_button>
      )}
      {secretKey && (
        <_button onClick={() => setActiveMenu(MENU_EXPORT_SECRET_KEY)}>
          {t('drawer.settings.key.export.secret')}
        </_button>
      )}
      {publicKey && (
        <_link
          href={`https://solscan.io/account/${publicKey}${network}`}
          target="_blank"
          rel="noreferrer"
        >
          {t('drawer.settings.key.block.explorer')} <IconHyperlink />
        </_link>
      )}
      <AnimateDots>
        <_disconnect onClick={() => handleLogout()}>
          {t('drawer.settings.disconnect')}
        </_disconnect>
      </AnimateDots>
    </_tab>
  );
};

export default KeysTab;
