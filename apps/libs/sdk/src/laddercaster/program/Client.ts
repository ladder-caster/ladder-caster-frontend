import * as anchor from '@project-serum/anchor';
import { Connection, ConnectionConfig, Keypair } from '@solana/web3.js';
import laddercasterIDLMain from '../config/laddercast-mainnet.json';
import laddercasterIDLMainPriv from '../config/laddercast-mainnet-priv.json';
import laddercasterIDLDev from '../config/laddercast-dev.json';
import laddercasterIDLLocal from '../config/laddercast-local.json';
import NodeWallet from '../utils/NodeWallet';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import jwt from 'jsonwebtoken';

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

  static async connect(wallet: NodeWallet, env: Environment): Promise<Client> {
    const conn = await Client.getConnection(env);

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

  static async getConnection(
    env: Environment,
  ): Promise<anchor.web3.Connection> {
    const [url, config] = await this.getRPC(env);
    if (config) return new anchor.web3.Connection(url, config);
    return new anchor.web3.Connection(url);
  }

  static getIDL(env: Environment) {
    switch (env) {
      case 'localprod':
      case 'mainnet': {
        return laddercasterIDLMain;
      }
      case 'mainnet-priv': {
        return laddercasterIDLMainPriv;
      }
      case 'localnet': {
        return laddercasterIDLLocal;
      }
      case 'devnet': {
        return laddercasterIDLDev;
      }
    }
  }

  static async getRPC(env: Environment): Promise<[string, ConnectionConfig]> {
    switch (env) {
      case 'mainnet-priv':
      case 'mainnet': {
        return [
          'https://autumn-quiet-grass.solana-mainnet.quiknode.pro/e740cf15bc2f5d51519cdda04ccd585ddcab4f68/',
          {},
        ];
      }
      case 'localnet': {
        return ['http://localhost:8899', {}];
      }
      case 'localprod': {
        console.log(`Bearer ${await this.getBearerToken()}`);
        return [
          'https://wandering-divine-dream.solana-mainnet.quiknode.pro/51a28202db85ffa02345f9ba72ad73394732af13/',
          {
            httpHeaders: {
              Authorization: `Bearer ${await this.getBearerToken()}`,
            },
          },
        ];
      }
      case 'devnet': {
        return [
          'https://lively-still-wildflower.solana-devnet.quiknode.pro/7fd1afc95f8690531aa30719251004144802df33/',
          {},
        ];
      }
    }
  }

  static async getBearerToken() {
    // read private key

    const privateKey = require('../../../../../../jwt/private_key.json');

    //Create payload and JWT
    var token = jwt.sign({}, privateKey, {
      algorithm: 'RS256', //algo used to create JWT
      expiresIn: '2d', // set a 2 day expiration
    });

    return token;
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
