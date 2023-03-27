import { PublicKey, Transaction } from '@solana/web3.js';
import { Client } from '.';
import { Market, OpenOrders } from '@project-serum/serum';
import {
  createAssociatedTokenAccountIx,
  findAssociatedTokenAddress,
} from '../utils/SerumUtils';
import gameConstantsContext from './GameConstantsContext';

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

  async placeOrder({ side, price, size, orderType }) {
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

    const blockhash = (
      await gameConstantsContext.Client.connection.getRecentBlockhash()
    ).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    return await gameConstantsContext.Client.program.provider.send(tx, signers);
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

  async cancelOrder(order) {
    const tx = new Transaction();

    tx.add(this.market.makeMatchOrdersTransaction(5));
    tx.add(
      await this.market.makeCancelOrderTransaction(
        gameConstantsContext.Client.connection,
        gameConstantsContext.Client.wallet.publicKey,
        order,
      ),
    );
    tx.add(this.market.makeMatchOrdersTransaction(5));

    const blockhash = (
      await gameConstantsContext.Client.connection.getRecentBlockhash()
    ).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = gameConstantsContext.Client.wallet.publicKey!;

    return await gameConstantsContext.Client.program.provider.send(tx);
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

  async settleFunds(openOrders: OpenOrders[]) {
    const tx = new Transaction();

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
        tx.add(
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
      tx.add(transaction);
      finalSigners.concat(signers);
    }
    return await gameConstantsContext.Client.program.provider.send(
      tx,
      finalSigners,
    );
  }
}
