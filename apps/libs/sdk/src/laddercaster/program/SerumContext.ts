import { Account } from '@solana/web3.js';
import { Client } from '.';
import { Market } from '@project-serum/serum';
import * as anchor from '@project-serum/anchor';


export class SerumContext {
  constructor(
    private client: Client,
    private playerPubkey: anchor.web3.PublicKey,
    private account: Account,
    private market: Market
  ) {}

  async getBidsAsks() {
    let bids = await this.market.loadBids(this.client.connection);
    let asks = await this.market.loadAsks(this.client.connection);

    return {
      bids,
      asks
    }
  }

  async placeOrder({side, price, size, orderType}) {

  }

  async openOrders() {

  }

  async cancelOrder() {

  }

  async getFilledOrders() {

  }

  async settleFunds() {

  }
}



