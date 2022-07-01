import coinsList from 'core/utils/coins.json';

export const MARKETS = {
  ['LADA/USDC']: {
    market_id: '8nfpBgajP1UxVsK12ZQtrSEzYAPmC51y9ctHC9y9T1FE',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'LADA',
    quote: 'USDC',
    decimals: 2,
    market: 'LADA/USDC',
  },
  ['FIYA/USDC']: {
    market_id: 'AtUeL7BJzzUpBRsRxMojVt8zdCWyrdFcPg2v3F7jyHt9',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'FIYA',
    quote: 'USDC',
    decimals: 6,
    market: 'FIYA/USDC',
  },
  ['ERRA/USDC']: {
    market_id: '9fViHtiJMmVn2nwRBPcPNrBkzmDYwGNa64J74GGm2ScZ',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'ERRA',
    quote: 'USDC',
    decimals: 6,
    market: 'ERRA/USDC',
  },
  ['WADA/USDC']: {
    market_id: 'HyDtN1n3Bcmmf95swdVHRZmfhR5E3FdstXqo2fBqjCPh',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'WADA',
    quote: 'USDC',
    decimals: 6,
    market: 'WADA/USDC',
  },
  ['EMBA/USDC']: {
    market_id: 'AtUeL7BJzzUpBRsRxMojVt8zdCWyrdFcPg2v3F7jyHt9',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'FIYA',
    quote: 'USDC',
    decimals: 6,
    market: 'FIYA/USDC',
  },
  ['FRO/USDC']: {
    market_id: 'HyDtN1n3Bcmmf95swdVHRZmfhR5E3FdstXqo2fBqjCPh',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'WADA',
    quote: 'USDC',
    decimals: 6,
    market: 'WADA/USDC',
  },
  ['ROOT/USDC']: {
    market_id: '9fViHtiJMmVn2nwRBPcPNrBkzmDYwGNa64J74GGm2ScZ',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'ERRA',
    quote: 'USDC',
    decimals: 6,
    market: 'ERRA/USDC',
  },
  ['SANN/USDC']: {
    market_id: 'DTL1gkCYDGspCbbxgRVaF4EjXHpciGhnBjmfzuyCETAQ',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'SANN',
    quote: 'USDC',
    decimals: 6,
    market: 'SANN/USDC',
  },
  ['RANN/USDC']: {
    market_id: 'taxcg3WnaRvxsSPMY8TDSbo4JrhArJKb7QDJFSChEnT',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'RANN',
    quote: 'USDC',
    decimals: 6,
    market: 'RANN/USDC',
  },
  ['WINN/USDC']: {
    market_id: 'AgK65KNMTGVyQtZFZ8UXY6CpD51LARZiRJ65Tc7ripra',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'WINN',
    quote: 'USDC',
    decimals: 6,
    market: 'WINN/USDC',
  },
  ['LAVA/USDC']: {
    market_id: 'C37YXzhwcDEGJMiJqAR2TAnaKn8frSVcZFqgi7niMsG9',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'LAVA',
    quote: 'USDC',
    decimals: 6,
    market: 'LAVA/USDC',
  },
  ['TORM/USDC']: {
    market_id: '7qHC2Vu24Hi2aEuW4zVeHqquE45BGjzWi1P1hBCtHyC1',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'TORM',
    quote: 'USDC',
    decimals: 6,
    market: 'TORM/USDC',
  },
  ['POSO/USDC']: {
    market_id: 'GneKvoYAEbJJWZ2eY5wF1FvwyckCYC5s4UnFQbbsW1cW',
    program_id: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    base: 'POSO',
    quote: 'USDC',
    decimals: 6,
    market: 'POSO/USDC',
  },
};

export const COINS = coinsList?.coins;

export const findMarket = (coin1, coin2) => {
  const match1 = MARKETS?.[`${coin1}/${coin2}`?.toUpperCase()];
  const match2 = MARKETS?.[`${coin2}/${coin1}`?.toUpperCase()];

  return match1 || match2;
};
