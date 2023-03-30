import {
  MetadataData,
  MetadataProgram,
} from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { deserializeUnchecked } from 'borsh';
import { NFTUtilInterface } from '../program/types';
import gameConstantsContext from '../program/GameConstantsContext';

//TODO: Revisit to make it more efficient
class NFTUtil implements NFTUtilInterface {
  // https://github.com/NftEyez/sol-rayz/blob/main/packages/sol-rayz/src/getParsedNftAccountsByOwner.ts
  async getNFTS() {
    const {
      value: splAccounts,
    } = await gameConstantsContext.Client.connection.getParsedTokenAccountsByOwner(
      new PublicKey(gameConstantsContext.Client.wallet.publicKey),
      {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
      },
    );
    let accountsFiltered = [];
    // for loops with index incrementing iterates faster than forof/maps
    // iterates once over all NFT's instead of multiple passes to reduce overhead
    for (let i = 0; i < splAccounts.length; i++) {
      let splAccount = splAccounts[i];
      const amount =
        splAccount.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
      const decimals =
        splAccount.account?.data?.parsed?.info?.tokenAmount?.decimals;
      if (!(decimals === 0 && amount >= 1)) continue;
      const nft = MetadataProgram.findMetadataAccount(
        new PublicKey(splAccount.account?.data?.parsed?.info?.mint),
      )
        .then((metaDataAddress) => {
          //console.log('metaDataAddress',metaDataAddress)
          return gameConstantsContext.Client.connection
            .getAccountInfo(metaDataAddress[0])
            .then((rawMetaData) => {
              const account = rawMetaData as AccountInfo<Buffer>;
              if (!account) return;

              return deserializeUnchecked(
                MetadataData.SCHEMA,
                MetadataData,
                account.data,
              );
            })
            .then((res) => {
              if (!res) return;

              const uri = res.data?.uri?.replace?.(/\0/g, '');
              const symbol = res.data?.symbol;
              if (uri !== '' && uri !== undefined && symbol === 'LC') {
                return res;
              }
            });
        })
        .catch((err) => {
          console.log('ERROR:', err);
          return;
        });
      accountsFiltered.push(nft);
    }
    accountsFiltered = await Promise.all(accountsFiltered).then((res) =>
      res.filter((x) => x !== undefined),
    );

    return this.getNFTUris(accountsFiltered);
  }

  private async getNFTUris(nfts: MetadataData[]) {
    let arr = [];
    let keys = Object.keys(nfts);
    for (let i = 0; i < keys.length; i++) {
      const nft = nfts[keys[i]];
      arr.push(
        axios.get(nft.data.uri).then((res) => ({ ...res, mint: nft.mint })),
      );
    }

    arr = await Promise.all(arr).then((res) => res);
    return arr;
  }
}

const nftUtil = new NFTUtil();
export default nftUtil;
