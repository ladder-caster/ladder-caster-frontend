import laddercasterIDLMain from './apps/libs/sdk/src/config/laddercast-mainnet.json';
import laddercasterIDLMainPriv from './apps/libs/sdk/src/config/laddercast-mainnet-priv.json';
import laddercasterIDLDev from './apps/libs/sdk/src/config/laddercast-dev.json';
import laddercasterIDLLocal from './apps/libs/sdk/src/config/laddercast-local.json';

export const environment = process.env.REACT_APP_ENV || 'mainnet';
export const isProd = environment === 'mainnet';

const config = {
  ['mainnet']: {
    idl: laddercasterIDLMain,
    rpc:
      'https://autumn-quiet-grass.solana-mainnet.quiknode.pro/e740cf15bc2f5d51519cdda04ccd585ddcab4f68/',
    WEB3AUTH:
      'BPQKJdLG2ghikI4O3GH-7yr0Y9-q8rGP-s0q2UMw0HvzUlIYEBYngIPGMOV6Lzkocdae_WE5UlFcjbqYn_iHNzA',
    W3A_ENV: 'mainnet',
    pkString: 'gameAccountProd',
    pollInterval: 10000,
  },
  ['mainnet-priv']: {
    idl: laddercasterIDLMainPriv,
    rpc:
      'https://autumn-quiet-grass.solana-mainnet.quiknode.pro/e740cf15bc2f5d51519cdda04ccd585ddcab4f68/',
    WEB3AUTH:
      'BPQKJdLG2ghikI4O3GH-7yr0Y9-q8rGP-s0q2UMw0HvzUlIYEBYngIPGMOV6Lzkocdae_WE5UlFcjbqYn_iHNzA',
    W3A_ENV: 'mainnet',
    pkString: 'gameAccountProdPriv',
    pollInterval: 10000,
  },
  ['localprod']: {
    idl: laddercasterIDLMain,
    rpc:
      'https://wandering-divine-dream.solana-mainnet.quiknode.pro/51a28202db85ffa02345f9ba72ad73394732af13/',
    WEB3AUTH:
      'BPQKJdLG2ghikI4O3GH-7yr0Y9-q8rGP-s0q2UMw0HvzUlIYEBYngIPGMOV6Lzkocdae_WE5UlFcjbqYn_iHNzA',
    W3A_ENV: 'mainnet',
    pkString: 'gameAccountProd',
    pollInterval: 1000000,
  },
  ['devnet']: {
    idl: laddercasterIDLDev,
    rpc:
      'https://lively-still-wildflower.solana-devnet.quiknode.pro/7fd1afc95f8690531aa30719251004144802df33/',
    WEB3AUTH:
      'BPQKJdLG2ghikI4O3GH-7yr0Y9-q8rGP-s0q2UMw0HvzUlIYEBYngIPGMOV6Lzkocdae_WE5UlFcjbqYn_iHNzA',
    W3A_ENV: 'mainnet',
    pkString: 'gameAccount',
    pollInterval: 1000000,
  },
  ['localnet']: {
    idl: laddercasterIDLLocal,
    rpc: 'http://localhost:8899',
    WEB3AUTH:
      'BPQKJdLG2ghikI4O3GH-7yr0Y9-q8rGP-s0q2UMw0HvzUlIYEBYngIPGMOV6Lzkocdae_WE5UlFcjbqYn_iHNzA',
    W3A_ENV: 'mainnet',
    pkString: 'gameAccount',
    pollInterval: 1000000,
  },
};

export default config[environment];
