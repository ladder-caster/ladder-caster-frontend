import React from 'react';
import { _connect, _wallet } from './Connect.styled';
import { useRemix } from 'core/hooks/remix/useRemix';
import { CHAIN_LOCAL_CLIENT } from 'chain/hooks/state';
import { IconWallet } from '../../../../libs/design/icons/wallet.icon';
import { useActions } from '../../../actions';

const isProd = process.env.REACT_APP_ENV === 'mainnet';

const Connect = () => {
  const [client] = useRemix(CHAIN_LOCAL_CLIENT);
  const { openDrawerWallet } = useActions();
  const publicKey = client?.wallet?.publicKey?.toBase58();
  const short_public = publicKey ? start_and_end(publicKey) : null;
  const active =
    client !== undefined ? client?.wallet?.publicKey?.toBase58() : false;

  return (
    <_connect>
      {active && short_public && (
        <_wallet $long={isProd} onClick={() => openDrawerWallet()}>
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
      {/* {`...${str.substr(str.length - 4, str.length)}`} */}
    </>
  );
}

export default Connect;
