import * as anchor from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import NodeWallet from '../utils/NodeWallet';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import jwt from 'jsonwebtoken';
import config, { environment } from '../../../../../config';

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
    if (config)
      return new anchor.web3.Connection(
        config.rpc,
        environment === 'localprod'
          ? {
              httpHeaders: {
                Authorization: `Bearer ${await this.getBearerToken()}`,
              },
            }
          : {},
      );
    return new anchor.web3.Connection(config.rpc);
  }

  static async getBearerToken() {
    // read private key
    const privateKey = require('../../../../../jwt/private_key.json');

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
    const idl = config.idl;
    return new anchor.Program(
      idl as anchor.Idl,
      idl.metadata.address,
      _provider,
    );
  }
}
