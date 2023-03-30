import * as anchor from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import laddercasterIDL from '../config/laddercast.json';
import NodeWallet from '../utils/NodeWallet';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import config from 'web/src/utils/config';

export type Environment =
  | 'mainnet'
  | 'mainnet-priv'
  | 'localnet'
  | 'devnet'
  | 'localprod';
const LOCAL_SECRET = 'LOCAL_SECRET';

export class Client {
  constructor(
    public program: anchor.Program,
    public connection: Connection,
    public wallet: NodeWallet,
  ) {}

  static async connect(wallet: NodeWallet): Promise<Client> {
    const conn = await Client.getConnection();

    const program = Client.getProgram(conn, wallet);

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

  static async getConnection(): Promise<anchor.web3.Connection> {
    return new anchor.web3.Connection(config.rpc);
  }

  static getIDL() {
    return laddercasterIDL;
  }

  async getSOLBalance() {
    try {
      return await this.connection.getBalance(this.wallet.publicKey);
    } catch (e) {
      return 0;
    }
  }

  private static getProgram(conn: anchor.web3.Connection, wallet: NodeWallet) {
    const _provider = new anchor.AnchorProvider(conn, wallet, {});
    const idl = Client.getIDL();
    return new anchor.Program(idl as anchor.Idl, config.programId, _provider);
  }
}
