import { Item } from 'sdk/src/laddercaster/program/types'
import {
  PublicKey,
} from '@solana/web3.js';
export interface CasterUpgradeAvailable {
  loaded:false,
  items:{
    /**
     * Category of the item e.g hat, robe, staff
     */
    [key:string]:{
      /**
       * Filtered array of items per type
       */
      items: Item[],
      /**
       * Precomputed array of Caster PublicKeys which could use an upgrade
       */
      casters: PublicKey[],
    }
  },
  /**
   * Boolean stating if any caster has an upgrade available - used to prevent going through the upgrade process if no upgrades are available
   */
  upgradesAvailable: boolean,
}