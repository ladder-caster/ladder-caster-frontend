import { TokenInstructions } from '@project-serum/serum';
import { SystemProgram } from '@solana/web3.js';
import { LADA_PROGRAM_ID } from '..';

export const PROGRAMS_NAMES = {
  [TokenInstructions.TOKEN_PROGRAM_ID.toString()]: 'Token program',
  [SystemProgram.programId.toString()]: 'System program',
  [LADA_PROGRAM_ID.toString()]: 'Legacy program',
};

export const PROGRAMS_ERRORS = {
  [LADA_PROGRAM_ID.toString()]: [
    {
      code: 0,
      msg: "Turn isn't over yet!",
      name: 'PrematureCrankPull',
    },
    {
      code: 1,
      msg: 'Invalid Move.',
      name: 'InvalidMove',
    },
    {
      code: 2,
      msg: 'Pending turn needs to be redeemed first.',
      name: 'PendingTurn',
    },
    {
      code: 3,
      msg: 'No turn to redeem.',
      name: 'EmptyTurnCommit',
    },
    {
      code: 4,
      msg: 'Turn needs to advance before you can redeem!',
      name: 'SameTurnRedeem',
    },
    {
      code: 5,
      msg: 'Not enough resources for action.',
      name: 'PlayerIsPoor',
    },
    {
      code: 6,
      msg: 'You already did this action, wait for next turn.',
      name: 'ActionAlreadyDone',
    },
    {
      code: 7,
      msg: 'Item does not exist.',
      name: 'ItemNotExists',
    },
    {
      code: 8,
      msg: 'Already have an item of that type equipped.',
      name: 'ItemTypeAlreadyEquipped',
    },
    {
      code: 9,
      msg: "Item level is higher than your caster's level.",
      name: 'ItemLevelTooHigh',
    },
    {
      code: 10,
      msg: "Item can't be used for crafting.",
      name: 'InvalidItemType',
    },
    {
      code: 11,
      msg: 'This is not a crafting tile.',
      name: 'NotCraftingTile',
    },
    {
      code: 12,
      msg: 'Item is not a chest.',
      name: 'ItemIsNotAChest',
    },
    {
      code: 13,
      msg: 'Invalid resource for manual burn.',
      name: 'InvalidResourceTypeForBurn',
    },
    {
      code: 14,
      msg: 'Spell was already used for this turn.',
      name: 'SpellAlreadyUsedForTurn',
    },
  ],
};

export const KNOWN_GENERIC_ERRORS = [
  {
    msg:
      'Insufficient balance or debt celling reach. Check your SOL and collateral token balance and try again',
    name: 'InsufficientBalance',
    code: 0,
  },
];
