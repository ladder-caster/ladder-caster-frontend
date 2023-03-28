import * as anchor from '@project-serum/anchor';
import NodeWallet from 'sdk/src/laddercaster/utils/NodeWallet';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import laddercasterIDL from './laddercast.json';
import { Client, Environment } from 'sdk/src/laddercaster/program';

export const LOCAL_SECRET = 'LOCAL_SECRET';

export const createLocalWallet = async () => {
  // connect anchor
  const conn = await Client.getConnection();

  // generate a local wallet
  let secret;
  let wallet;
  let local_secret = localStorage.getItem(LOCAL_SECRET);

  // use same wallet from localstorage
  if (local_secret) {
    secret = local_secret;
    wallet = anchor.web3.Keypair.fromSecretKey(bs58.decode(secret));
  } else {
    // request airdrop
    wallet = anchor.web3.Keypair.generate();
    localStorage.setItem(
      LOCAL_SECRET,
      bs58.encode(wallet?._keypair?.secretKey),
    );
    await conn.requestAirdrop(wallet.publicKey, 1e9 * 10);
  }

  const program = getProgram(conn, wallet);

  return { conn, wallet, program };
};

export const getProgram = (conn, wallet) => {
  const _provider = new anchor.AnchorProvider(conn, new NodeWallet(wallet), {});
  return new anchor.Program(
    laddercasterIDL as anchor.Idl,
    laddercasterIDL.metadata.address,
    _provider,
  );
};
