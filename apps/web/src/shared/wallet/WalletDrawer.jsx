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
import { useRemix } from 'core/hooks/remix/useRemix';
import { DRAWER_ACTIVE, VIEW_SIZE } from 'core/remix/state';
import { useActions } from '../../../actions';
import {
  TAB_MINT,
  TAB_REDEEM,
  TAB_WALLET,
  TABS_MINT_REDEEM,
  TAB_KEYS,
  TAB_STAKING,
} from 'core/remix/tabs';
import RedeemTab from './tabs/redeem/tab/RedeemTab';
import { IconClose } from 'design/icons/close.icon';
import { _breakpoint } from '../../views/game/spellcasters/drawer/Player.styled';
import Tabs from '../tabs/Tabs';
import MintTab from './tabs/mint/tab/MintTab';
import WalletTab from './tabs/wallet/tab/WalletTab';
import KeysTab from './tabs/keys/tab/KeysTab';
import { CHAIN_LOCAL_CLIENT, CHAIN_NFTS } from 'chain/hooks/state';
import StakingTab from './tabs/staking/StakingTab';

const WalletDrawer = () => {
  const { t } = useTranslation();
  const [view_height] = useRemix(VIEW_SIZE);
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const { closeDrawer, refreshResources } = useActions();

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
    [TAB_STAKING]: {
      name: t('wallet.staking'),
      View: StakingTab,
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
