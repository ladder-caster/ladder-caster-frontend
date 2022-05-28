import { Item } from 'sdk/src/laddercaster/program/types'
import {PublicKey} from '@solana/web3.js';
export interface CasterUpgradeAvailable {
  loadedItems: false,
  casters: Map<String, CasterWrapper>,
  /**
  * Filtered array of items per type
  */
  items: Map<String,Item>,
  /**
  * Boolean stating if any caster has an upgrade available - used to prevent going through the upgrade process if no upgrades are available
  */
  canUpgrade: (publicKey: String,casters: Map<String, CasterWrapper>)=>boolean,
  getEquippedItems: (publicKey: String, casters: Map<String,CasterWrapper>)=>Item[]
}

export interface CasterWrapper{
  [key:string]:{
    items: string[],
    currentItem: Item
  }
}