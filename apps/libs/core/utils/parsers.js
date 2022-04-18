import { Client, Environment } from 'sdk/src/laddercaster/program/Client';
// Error parsers

export const TRANSACTION_TOO_LARGE = 'Transaction too large';

export const handleCustomErrors = (message = '') => {
  const idl = Client.getIDL(process.env.REACT_APP_ENV);

  if (idl.errors) {
    const error = idl.errors.find((err) => {
      return message?.includes(`0x${(+err.code).toString(16)}`);
    });

    return error?.msg || message;
  } else if (message?.includes('0x1')) {
    return 'Not enough SOL for transaction signing';
  }

  return message;
};
