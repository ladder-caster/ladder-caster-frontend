import * as anchor from '@project-serum/anchor';
import { Connection, Keypair } from '@solana/web3.js';
import laddercasterIDLMain from '../config/laddercast-mainnet.json';
import laddercasterIDLDev from '../config/laddercast-dev.json';
import laddercasterIDLLocal from '../config/laddercast-local.json';
import NodeWallet from '../utils/NodeWallet';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

export type Environment = 'mainnet' | 'localnet' | 'devnet';
export const SLOTS_PUBKEY = 'SysvarS1otHashes111111111111111111111111111';
const LOCAL_SECRET = 'LOCAL_SECRET';

export class Client {
  constructor(
    public program: anchor.Program,
    public connection: Connection,
    public wallet: NodeWallet,
  ) {}

  static async connect(wallet: NodeWallet, env: Environment): Promise<Client> {
    const conn = Client.getConnection(env);

    const program = Client.getProgram(conn, wallet, env);

    return new Client(program, conn, wallet);
  }

  static generateKeypair(): anchor.web3.Keypair {
    const wallet = anchor.web3.Keypair.generate();
    localStorage.setItem(LOCAL_SECRET, bs58.encode(wallet?.secretKey));

    return wallet;
  }

  static getLocalKeypair(): anchor.web3.Keypair {
    return localStorage.getItem(LOCAL_SECRET)
      ? anchor.web3.Keypair.fromSecretKey(
          bs58.decode(localStorage.getItem(LOCAL_SECRET)),
        )
      : null;
  }

  static getConnection(env: Environment): anchor.web3.Connection {
    switch (env) {
      case 'mainnet': {
        return new anchor.web3.Connection(
          'https://wispy-cool-tree.solana-mainnet.quiknode.pro/b9ee9eac7b2c5dce648a5c70bf4f9f7af9b6f957/',
        );
      }
      case 'localnet': {
        return new anchor.web3.Connection('http://localhost:8899');
      }
      case 'devnet': {
        return new anchor.web3.Connection(
          'https://lively-still-wildflower.solana-devnet.quiknode.pro/7fd1afc95f8690531aa30719251004144802df33/',
        );
      }
    }
  }

  static getIDL(env: Environment) {
    switch (env) {
      case 'mainnet': {
        return laddercasterIDLMain;
      }
      case 'localnet': {
        return laddercasterIDLLocal;
      }
      case 'devnet': {
        return laddercasterIDLDev;
      }
    }
  }

  async getSOLBalance() {
    try {
      return await this.connection.getBalance(this.wallet.publicKey);
    } catch (e) {
      return 0;
    }
  }

  private static getProgram(
    conn: anchor.web3.Connection,
    wallet: NodeWallet,
    env: Environment,
  ) {
    const _provider = new anchor.Provider(conn, wallet, {});
    const idl = Client.getIDL(env);
    return new anchor.Program(
      idl as anchor.Idl,
      idl.metadata.address,
      _provider,
    );
  }
}
