import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions';
import BN from 'bn.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { Connection, PublicKey, Signer, Transaction } from '@solana/web3.js';

export const SOL_TLD_AUTHORITY = new PublicKey(
  '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx',
);

export const isValidSolanaAddress = (address: string) => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

export const createAssociatedTokenAccountIx = (
  mint: PublicKey,
  associatedAccount: PublicKey,
  owner: PublicKey,
) =>
  Token.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    associatedAccount,
    owner,
    owner,
  );

export const findAssociatedTokenAddress = async (
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey,
): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )
  )[0];
};

export const signAndSendRawTransaction = async (
  connection: Connection,
  transaction: Transaction,
  wallet: any,
  ...signers: Array<Signer>
) => {
  try {
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getRecentBlockhash('max')
    ).blockhash;

    signers.forEach((signer) => transaction.partialSign(signer));

    transaction = await wallet.signTransaction(transaction);
    const tx = await connection.sendRawTransaction(transaction!.serialize()); //, { skipPreflight: true }
    return tx;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const simulateTransaction = async (
  connection: Connection,
  transaction: Transaction,
  wallet: any,
  ...signers: Array<Signer>
) => {
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash('max')
  ).blockhash;

  signers.forEach((signer) => transaction.partialSign(signer));

  let sim = await connection.simulateTransaction(transaction);

  return sim;
};

interface ISolDomainToWalletAddress {
  domainName: string;
  connection: Connection;
}

// TODO: reconcile this function with other similar definition in the codebase
export const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey,
) => {
  const result = await PublicKey.findProgramAddress(seeds, programId);

  return [result[0].toBase58(), result[1]] as [string, number];
};

export const int64to8 = (n: number): Uint8Array => {
  const arr = BigUint64Array.of(BigInt(n));
  return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
};

export const bnTo8 = (bn: BN): Uint8Array => {
  return Buffer.from([...bn.toArray('le', 8)]);
};
