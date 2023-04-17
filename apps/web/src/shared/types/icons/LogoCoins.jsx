import React from 'react';
import {
  COIN_EMBA,
  COIN_FRO,
  COIN_LADA,
  COIN_LAVA,
  COIN_POSO,
  COIN_ROOT,
  COIN_TORM,
  COIN_USDC,
} from 'core/mesh/coins';
import { IconMoneyIMG } from 'design/icons/money.icon';
import { IconEmberIMG } from 'design/icons/ember.icon';
import { IconFrostIMG } from 'design/icons/frost.icon';
import { IconRootIMG } from 'design/icons/root.icon';
import { IconUSDC } from 'design/icons/usdc.icon';
import { IconResource2IMG } from 'design/icons/resource2.icon';
import { IconResourcee1IMG } from 'design/icons/resourcee1.icon';
import { IconResource3IMG } from 'design/icons/resource3.icon';

const LogoCoins = ({ ticker }) => {
  const Logo = {
    [COIN_USDC]: IconUSDC,
    [COIN_LADA]: IconMoneyIMG,
    [COIN_LAVA]: IconResourcee1IMG,
    [COIN_TORM]: IconResource2IMG,
    [COIN_POSO]: IconResource3IMG,
  }[ticker];

  return (!!Logo && <Logo />) || null;
};

export default LogoCoins;
