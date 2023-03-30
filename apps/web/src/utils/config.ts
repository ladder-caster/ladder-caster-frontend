const Env = process.env.REACT_APP_ENV || 'devnet'; // ['mainnet', 'devnet']
export const isProd = Env === 'mainnet';

type Openlogin = 'mainnet' | 'cyan' | 'testnet' | 'development';

const config = {
  w3aKey: process.env.REACT_APP_WEB3AUTH_KEY as string,
  w3aEnv: process.env.REACT_APP_WEB3AUTH as Openlogin,
  rpc: process.env.REACT_APP_RPC_NODE as string,
  programId: process.env.REACT_APP_PROGRAM_ID as string,
  gameAccountString: process.env.REACT_APP_GAME_ACCOUNT_STRING as string,
  environment: process.env.REACT_APP_ENV as string,
};

export default config;
