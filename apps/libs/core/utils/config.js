const Env = process.env.REACT_APP_ENV || 'devnet'; // ['mainnet', 'devnet']
export const isProd = Env === 'mainnet';

const config = {
  ['devnet']: {
    WEB3AUTH:
      'BPQKJdLG2ghikI4O3GH-7yr0Y9-q8rGP-s0q2UMw0HvzUlIYEBYngIPGMOV6Lzkocdae_WE5UlFcjbqYn_iHNzA',
    W3A_ENV: 'mainnet',
  },
  ['localprod']: {
    WEB3AUTH:
      'BPQKJdLG2ghikI4O3GH-7yr0Y9-q8rGP-s0q2UMw0HvzUlIYEBYngIPGMOV6Lzkocdae_WE5UlFcjbqYn_iHNzA',
    W3A_ENV: 'mainnet',
  },
  ['mainnet']: {
    WEB3AUTH:
      'BPQKJdLG2ghikI4O3GH-7yr0Y9-q8rGP-s0q2UMw0HvzUlIYEBYngIPGMOV6Lzkocdae_WE5UlFcjbqYn_iHNzA',
    W3A_ENV: 'mainnet',
  },
};

export default config[Env];
