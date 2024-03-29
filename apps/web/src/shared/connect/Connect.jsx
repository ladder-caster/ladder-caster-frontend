import React from 'react';
import { _connect, _wallet } from './Connect.styled';
import { useMesh } from 'core/state/mesh/useMesh';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { IconWallet } from '../../../../libs/design/icons/wallet.icon';
import { useActions } from '../../../actions';
import config from '../../../src/utils/config';

const isProd = config.environment === 'mainnet';

const Connect = () => {
  const [client] = useMesh(CHAIN_LOCAL_CLIENT);
  const { drawerWallet } = useActions();
  const publicKey = client?.wallet?.publicKey?.toBase58();
  const short_public = publicKey ? start_and_end(publicKey) : null;
  const active =
    client !== undefined ? client?.wallet?.publicKey?.toBase58() : false;

  return (
    <_connect>
      {active && short_public && (
        <_wallet $long={isProd} onClick={() => drawerWallet()}>
          <span>{short_public}</span>
          <IconWallet />
        </_wallet>
      )}
    </_connect>
  );
};

function start_and_end(str) {
  return (
    <>
      <span>{str.substr(0, 6)}</span>...
    </>
  );
}

export default Connect;
