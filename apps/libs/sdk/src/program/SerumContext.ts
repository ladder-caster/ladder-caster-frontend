import { PublicKey, Transaction } from '@solana/web3.js';
import { Client } from '.';
import { Market, OpenOrders } from '@project-serum/serum';
import {
  createAssociatedTokenAccountIx,
  findAssociatedTokenAddress,
} from '../utils/SerumUtils';
import gameConstantsContext from './GameConstantsContext';
import { TransactionBuilder } from '../hooks/useMutations';

export class SerumContext {
  constructor(private market: Market) {}

  async getBidsAsks() {
    try {
      const bids = await this.market.loadBids(
        gameConstantsContext.Client.connection,
      );
      const asks = await this.market.loadAsks(
        gameConstantsContext.Client.connection,
      );

      return {
        bids: bids?.getL2(20),
        asks: asks?.getL2(20),
      };
    } catch (error) {
      return {
        type: 'error',
        error,
      };
    }
  }

  async placeOrder({
    side,
    price,
    size,
    orderType,
  }): Promise<TransactionBuilder> {
    const tx = new Transaction();

    const mint =
      side === 'buy'
        ? this.market.quoteMintAddress
        : this.market.baseMintAddress;
    const payer = await findAssociatedTokenAddress(
      gameConstantsContext.Client.wallet.publicKey,
      mint,
    );

    const receiverMint =
      side === 'buy'
        ? this.market.baseMintAddress
        : this.market.quoteMintAddress;
    const receiverATA = await findAssociatedTokenAddress(
      gameConstantsContext.Client.wallet.publicKey,
      receiverMint,
    );

    const {
      value,
    } = await gameConstantsContext.Client.connection.getParsedAccountInfo(
      receiverATA,
    );
    if (!value) {
      tx.add(
        createAssociatedTokenAccountIx(
          receiverMint,
          receiverATA,
          gameConstantsContext.Client.wallet.publicKey,
        ),
      );
    }

    tx.add(this.market.makeMatchOrdersTransaction(5));

    const {
      transaction,
      signers,
    } = await this.market.makePlaceOrderTransaction(
      gameConstantsContext.Client.connection,
      {
        owner: gameConstantsContext.Client.wallet.publicKey,
        payer,
        side,
        price,
        size,
        orderType,
      },
    );
    tx.add(transaction);
    tx.add(this.market.makeMatchOrdersTransaction(5));

    return { transaction: tx, signers };
  }

  async openOrders(isPersonal: boolean) {
    try {
      if (isPersonal) {
        return await this.market.findOpenOrdersAccountsForOwner(
          gameConstantsContext.Client.connection,
          gameConstantsContext.Client.wallet.publicKey,
        );
      } else {
        return await this.market.loadOrdersForOwner(
          gameConstantsContext.Client.connection,
          gameConstantsContext.Client.wallet.publicKey,
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  async cancelOrder(order): Promise<TransactionBuilder> {
    const transaction = new Transaction();

    transaction.add(this.market.makeMatchOrdersTransaction(5));
    transaction.add(
      await this.market.makeCancelOrderTransaction(
        gameConstantsContext.Client.connection,
        gameConstantsContext.Client.wallet.publicKey,
        order,
      ),
    );
    transaction.add(this.market.makeMatchOrdersTransaction(5));

    return { transaction };
  }

  async getFilledOrders() {
    return await this.market.loadFills(gameConstantsContext.Client.connection);
  }

  async getUnsettledFunds(openOrders: OpenOrders[]) {
    return openOrders.filter((openOrder) => {
      const baseAvailable = this.market?.baseSplSizeToNumber(
        openOrder.baseTokenFree,
      );
      const quoteAvailable = this.market?.quoteSplSizeToNumber(
        openOrder.quoteTokenFree,
      );
      return (baseAvailable ?? 0) > 0 || (quoteAvailable ?? 0) > 0;
    });
  }

  async settleFunds(openOrders: OpenOrders[]): Promise<TransactionBuilder> {
    const transaction = new Transaction();

    const [[baseAccount], [quoteAccount]] = await Promise.all([
      this.market.findBaseTokenAccountsForOwner(
        gameConstantsContext.Client.connection,
        gameConstantsContext.Client.wallet.publicKey,
      ),
      this.market.findQuoteTokenAccountsForOwner(
        gameConstantsContext.Client.connection,
        gameConstantsContext.Client.wallet.publicKey,
      ),
    ]);

    const getOrCreateOpenOrdersWallet = async (
      account: { pubkey: PublicKey },
      mintAddress: PublicKey,
    ) => {
      let openOrdersWallet = account?.pubkey;
      if (!openOrdersWallet) {
        openOrdersWallet = await findAssociatedTokenAddress(
          gameConstantsContext.Client.wallet.publicKey,
          mintAddress,
        );
        transaction.add(
          createAssociatedTokenAccountIx(
            mintAddress,
            openOrdersWallet,
            gameConstantsContext.Client.wallet.publicKey,
          ),
        );
      }
      return openOrdersWallet;
    };

    const baseWallet = await getOrCreateOpenOrdersWallet(
      baseAccount,
      this.market.baseMintAddress,
    );
    const quoteWallet = await getOrCreateOpenOrdersWallet(
      quoteAccount,
      this.market.quoteMintAddress,
    );

    let finalSigners = [];
    for (const openOrder of openOrders) {
      const settleFundsTx = await this.market.makeSettleFundsTransaction(
        gameConstantsContext.Client.connection,
        openOrder,
        baseWallet,
        quoteWallet,
      );
      const { signers, transaction } = settleFundsTx;
      transaction.add(transaction);
      finalSigners.concat(signers);
    }

    return { transaction, signers: finalSigners };
  }
}
