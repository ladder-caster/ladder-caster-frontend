import { Account, Transaction } from '@solana/web3.js';
import { Client } from '.';
import { Market, Order } from '@project-serum/serum';
import * as anchor from '@project-serum/anchor';

export class SerumContext {
  constructor(private client: Client, private market: Market) {}

  async getBidsAsks() {
    let bids = await this.market.loadBids(this.client.connection);
    let asks = await this.market.loadAsks(this.client.connection);

    return {
      bids,
      asks,
    };
  }

  async placeOrder(payer, { side, price, size, orderType }) {
    const tx = new Transaction();

    tx.add(
      this.market.makePlaceOrderInstruction(this.client.connection, {
        owner: this.client.program.provider.wallet.publicKey,
        payer,
        side, // 'buy' or 'sell'
        price,
        size,
        orderType, // 'limit', 'ioc', 'postOnly'
      }),
    );
    const blockhash = (await this.client.connection.getRecentBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.client.wallet.publicKey!;

    return await this.client.program.provider.send(tx);
  }

  async openOrders() {
    return await this.market.loadOrdersForOwner(
      this.client.connection,
      this.client.program.provider.wallet.publicKey,
    );
  }

  async cancelOrder(order) {
    const tx = new Transaction();

    tx.add(
      this.market.makeCancelOrderInstruction(
        this.client.connection,
        this.client.program.provider.wallet.publicKey,
        order,
      ),
    );
    const blockhash = (await this.client.connection.getRecentBlockhash())
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = this.client.wallet.publicKey!;

    return await this.client.program.provider.send(tx);
  }

  async getFilledOrders() {
    return await this.market.loadFills(this.client.connection);
  }

  async settleFunds(baseTokenAccount, quoteTokenAccount) {
    for (let openOrders of await this.market.findOpenOrdersAccountsForOwner(
      this.client.connection,
      this.client.program.provider.wallet.publicKey,
    )) {
      if (
        openOrders.baseTokenFree.toNumber() > 0 ||
        openOrders.quoteTokenFree.toNumber() > 0
      ) {
        // spl-token accounts to which to send the proceeds from trades

        const {
          transaction,
          signers,
        } = await this.market.makeSettleFundsTransaction(
          this.client.connection,
          openOrders,
          baseTokenAccount,
          quoteTokenAccount,
        );

        this.client.program.provider.send(transaction, signers);
      }
    }
  }
}
