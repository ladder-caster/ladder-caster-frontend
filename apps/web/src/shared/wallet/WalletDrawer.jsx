import React, { useEffect } from 'react';
import {
  _wallet,
  _body,
  _close,
  _float,
  _header,
  _icon,
  _title,
} from './WalletDrawer.styled';
import { useTranslation } from 'react-i18next';
import { useMesh } from 'core/state/mesh/useMesh';
import { DRAWER_ACTIVE, VIEW_SIZE } from 'core/mesh/state';
import { useActions } from '../../../actions';
import {
  TAB_MINT,
  TAB_REDEEM,
  TAB_WALLET,
  TABS_MINT_REDEEM,
  TAB_KEYS,
} from 'core/mesh/tabs';
import RedeemTab from './tabs/redeem/tab/RedeemTab';
import { IconClose } from 'design/icons/close.icon';
import { _breakpoint } from '../../views/game/spellcasters/drawer/Player.styled';
import Tabs from '../tabs/Tabs';
import MintTab from './tabs/mint/tab/MintTab';
import WalletTab from './tabs/wallet/tab/WalletTab';
import KeysTab from './tabs/keys/tab/KeysTab';
import { CHAIN_LOCAL_CLIENT, CHAIN_NFTS } from 'chain/hooks/state';

const WalletDrawer = () => {
  const { t } = useTranslation();
  const [view_height] = useMesh(VIEW_SIZE);
  const [client] = useMesh(CHAIN_LOCAL_CLIENT);
  const { closeDrawer, refreshResources } = useActions();

  const [nfts, setNfts] = useMesh(CHAIN_NFTS);

  const tabs_mint_redeem = {
    [TAB_WALLET]: {
      name: t('wallet.assets'),
      View: WalletTab,
    },
    [TAB_KEYS]: {
      name: t('wallet.keys'),
      View: KeysTab,
    },
    [TAB_REDEEM]: {
      name: t('wallet.redeem'),
      View: RedeemTab,
    },
    [TAB_MINT]: {
      name: t('wallet.mint'),
      View: MintTab,
    },
  };

  useEffect(() => {
    if (refreshResources && client) refreshResources();
  }, [client]);

  return (
    <_wallet $height={view_height}>
      <_header>
        <_title>{t('drawer.wallet.title')}</_title>
        <_float>
          <_close>
            <_icon onClick={() => closeDrawer()}>
              <IconClose />
            </_icon>
          </_close>
        </_float>
      </_header>
      <_body>
        <_breakpoint />
        <Tabs tab_id={TABS_MINT_REDEEM} views={tabs_mint_redeem} />
      </_body>
    </_wallet>
  );
};

export default WalletDrawer;
