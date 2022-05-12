import React from 'react';
import {
  COIN_EMBA,
  COIN_FRO,
  COIN_LADA,
  COIN_ROOT,
  COIN_USDC,
} from 'core/remix/coins';
import { IconMoneyIMG } from 'design/icons/money.icon';
import { IconEmberIMG } from 'design/icons/ember.icon';
import { IconFrostIMG } from 'design/icons/frost.icon';
import { IconRootIMG } from 'design/icons/root.icon';
import { IconUSDC } from 'design/icons/usdc.icon';

const LogoCoins = ({ ticker }) => {
  const Logo = {
    [COIN_USDC]: IconUSDC,
    [COIN_LADA]: IconMoneyIMG,
    [COIN_EMBA]: IconEmberIMG,
    [COIN_FRO]: IconFrostIMG,
    [COIN_ROOT]: IconRootIMG,
  }[ticker];

  return (!!Logo && <Logo />) || null;
};

export default LogoCoins;
