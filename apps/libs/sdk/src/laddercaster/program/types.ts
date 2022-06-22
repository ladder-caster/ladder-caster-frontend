import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { Client } from './Client';
//Accounts
export interface Game {
  version: number; // 8
  authority: PublicKey;
  map: Tile[][];
  turnInfo: GameTurnInfo;
  lastTurnAdded: number; // 32
  signerBump: number; // 8
  /// Authority is game signer
  resource1MintAccount: PublicKey;
  /// Authority is game signer
  resource2MintAccount: PublicKey;
  /// Authority is game signer
  resource3MintAccount: PublicKey;

  /// Authority is auth
  ladaMintAccount: PublicKey;
  /// Authority is game
  ladaTokenAccount: PublicKey;
}

export interface TurnData {
  bump: anchor.BN; // 8
  resource1Burned: anchor.BN; // 64
  resource2Burned: anchor.BN; // 64
  resource3Burned: anchor.BN; // 64
}

export interface Metadata {
  selfBump: anchor.BN; // 8
  mintBump: anchor.BN; // 8
  mint: PublicKey;
  item: Item;
}

export interface Player {
  authority: PublicKey;
  game: PublicKey;
  bump: anchor.BN; // 8
}

// Derive Account interfaces
//TYPES CONFIRMED
export interface GameTurnInfo {
  //current turn
  turn: number; // 64
  //how many slots til next turn
  turnDelay: number; // 64
  //last slot the crank was pulled
  lastCrankSeconds: anchor.BN; // 64
  // last turn a tile was spawned
  lastTileSpawn: number; // 64
  // how many turns til next tile should spawn
  tileSpawnDelay: number; // 64
}

export interface TurnCommit {
  turn: number; // 32
  resourcesBurned: anchor.BN[];
  actions: CommittedActions;
  modifiersSnapshot: Modifiers;
}

export interface Tile {
  tileType: TileType;
  life: anchor.BN; // 8
  /// First time crafting tile is spawned, it will be legendary (only once, then goes to normal crafting)
  isFirstTimeSpawning: boolean;
}

export interface Caster {
  version: number; // 8
  level: number; // 8
  edition: number;
  experience: anchor.BN; // 64
  /// Player
  owner: PublicKey;
  modifiers: Modifiers;
  /// If filled cannot unequip/equip
  turnCommit?: TurnCommit;
  publicKey?: anchor.web3.PublicKey;
  seasonNumber: number;
}

export interface CommittedActions {
  loot: boolean;
  spell: boolean;
  mv?: [number, number];
  crafting?: CraftingSnapshot;
  actionOrder: number[]; // [loot, spell, mv, craft]
}

export interface CraftingSnapshot {
  minLevel: anchor.BN;
  minRarity: ItemRarity;
  maxRarity: ItemRarity;
  isExtraLevelBonus: boolean;
}

export interface Modifiers {
  tileLevel: number;
  //1-30
  tileColumn: number;
  //1,2,3
  head?: PublicKey;
  robe?: PublicKey;
  staff?: PublicKey;
  spellBook?: PublicKey;
}

export interface Item {
  /// Game
  game: PublicKey;
  /// Player
  owner: PublicKey;
  level: number; // 8
  itemType: ItemType;
  /// Caster
  equippedOwner: PublicKey;

  publicKey?: PublicKey;
  type: string;
  value: number;
  attribute: string;
}

// Converted from Rust enums
export interface TileType {
  resource3?: {};
  resource2?: {};
  resource1?: {};
  crafting?: {};
  legendary?: {};
}

export interface CasterAction {
  mv: [anchor.BN, anchor.BN];
  loot: boolean;
  spell: boolean;
  craft?: PublicKey[];
}

export interface ItemType {
  // For hackers, you could have been cool but nah
  zombie?: {};
  chest?: {
    /// Between 1 to 4 based on level of tile where found 1-10 tier 1, 11-15 tier 2, 16-20 tier 3, 21-30 tier 4
    tier: number; // 8
  };
  equipment?: {
    feature: ItemFeature;
    rarity: ItemRarity;
    equipmentType: EquipmentType;
    /// 0-1200 for resources and 0-1400 for percentage
    value: number; // 16
  };
  spellBook?: {
    spell: SpellType;
    costFeature: ItemFeature;
    rarity: ItemRarity;
    /// 1-300
    cost: number; // 16
    /// 0-3.6k
    value: number; // 16
  };
}

export interface ItemFeature {
  power?: {};
  magic?: {};
  resource3?: {};
  resource2?: {};
  resource1?: {};
}

export interface ItemRarity {
  common?: {};
  rare?: {};
  epic?: {};
  legendary?: {};
}

export interface EquipmentType {
  head?: {};
  robe?: {};
  staff?: {};
}

export interface SpellType {
  resource3?: {};
  resource2?: {};
  resource1?: {};
  experience?: {};
  craft?: {};
  item?: {};
}

export interface TokenAccounts {
  [key: string]: PublicKey;
  lada: PublicKey;
}
export interface Accounts {
  tokenAccounts: TokenAccounts;
  gameAccount: PublicKey;
  playerAccount: PublicKey;
  playerBump: number;
  previousGameAccount: PublicKey;
  previousPlayerAccount: PublicKey;
}
export interface GameState {
  game: Game;
  gameSigner: PublicKey;
  season: PublicKey;
  previousSeason: PublicKey;
  turnData: PublicKey;
  futureTurnData: PublicKey;
}

export interface GameBalances {
  [key: string]: number;
  lada: number;
}
export interface Balances {
  game: GameBalances;
  sol: number;
}
export interface GameConstantsContextInterface {
  /**
   * Client containing RPC, program and wallet info
   */
  Client: Client;
  /**
   * @returns [PublicKey, PublicKey,  Game, PublicKey,PublicKey ]
   */
  getCasterAccounts: [PublicKey, PublicKey, Game, PublicKey, PublicKey];
  hydrateGame: Function;
  hydrateAccountBalances: Function;
  getTokenBalances: Function;
  initClient: Function;
  playerAccount: PublicKey;
  previousPlayerAccount: PublicKey;
  playerBump: number;
  gameAccount: PublicKey;
  previousGameAccount: PublicKey;
  ladaTokenAccount: PublicKey;
  resource1TokenAccount: PublicKey;
  resource2TokenAccount: PublicKey;
  resource3TokenAccount: PublicKey;
  gameSigner: PublicKey;
  season: PublicKey;
  previousSeason: PublicKey;
  turnData: PublicKey;
  futureTurnData: PublicKey;
  ladaBalance: number;
  resource1Balance: number;
  resource2Balance: number;
  resource3Balance: number;
  solBalance: number;
  gameState: Game;
  clientInitialized: boolean;
}

export interface ArweaveUtilInterface {
  isMerkleInit: () => boolean;
  initMerkle: () => Promise<void>;
  buildLeafCaster: (caster: Caster, uri: string) => Buffer;
  buildLeafItem: (item: Item, uri: string) => Buffer;
  getCasterUri: (caster: Caster) => Promise<string>;
  getItemUri: (item: Item, itemType: string) => Promise<string>;
}

export interface NFTUtilInterface {
  getNFTS: () => Promise<string[]>;
}
