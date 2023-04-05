import {
  Caster,
  Item,
  ItemFeature,
  ItemType,
  GameConstantsContextInterface,
} from '.';
import * as anchor from '@project-serum/anchor';
import {
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { TransactionBuilder } from '../hooks/useMutations';

//constants of cached data used throughout the app
const gameConstantsContext: GameConstantsContextInterface = require('../program/GameConstantsContext')
  .default;
export class CasterContext {
  constructor(private caster?: Caster) {}

  getCasterId() {
    return this.caster?.publicKey;
  }

  async refreshCaster() {
    return await gameConstantsContext.Client.program.account.caster.fetch(
      this.caster?.publicKey,
    );
  }

  //TODO: to test
  async initCaster(count: number = 1): Promise<TransactionBuilder> {
    var casterKP = anchor.web3.Keypair.generate();
    if (!count || count == 1) {
      const transaction = new Transaction().add(
        await gameConstantsContext.Client.program.methods
          .initCaster()
          .accounts({
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            authority: gameConstantsContext.Client.wallet.publicKey,
            season: gameConstantsContext.season,
            game: gameConstantsContext.gameAccount,
            player: gameConstantsContext.playerAccount,
            slots: SYSVAR_SLOT_HASHES_PUBKEY,
            instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
            ladaMint: gameConstantsContext.gameState.ladaMintAccount,
            caster: casterKP.publicKey,
            gameLadaTokenAccount:
              gameConstantsContext.gameState.ladaTokenAccount,
            ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
          })
          .instruction(),
      );

      return { transaction, signers: [casterKP] };
      // return await gameConstantsContext.Client.program.rpc.initCaster({
      //   accounts: {
      //     systemProgram: anchor.web3.SystemProgram.programId,
      //     tokenProgram: TOKEN_PROGRAM_ID,
      //     rent: SYSVAR_RENT_PUBKEY,
      //     authority: gameConstantsContext.Client.wallet.publicKey,
      //     season: gameConstantsContext.season,
      //     game: gameConstantsContext.gameAccount,
      //     player: gameConstantsContext.playerAccount,
      //     slots: SYSVAR_SLOT_HASHES_PUBKEY,
      //     instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      //     ladaMint: gameConstantsContext.gameState.ladaMintAccount,
      //     caster: casterKP.publicKey,
      //     gameLadaTokenAccount: gameConstantsContext.gameState.ladaTokenAccount,
      //     ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
      //   },
      //   signers: [gameConstantsContext.Client.wallet.payer, casterKP],
      // });
    } else {
      //TODO: implement multi-caster purchase
    }
  }

  //TODO: to test
  async casterCommitMove(
    lvl: number,
    col: number,
  ): Promise<TransactionBuilder> {
    const [mintAccounts, gameTurnData] = await Promise.all([
      this.getMintAccounts(),
      this.getGameTurnData(),
    ]).then((res) => res);

    const transaction = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .casterCommitMoveS1(lvl, col)
        .accounts({
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          season: gameConstantsContext.season,
          ...mintAccounts,
          gameTurnData,
          ladaMint: gameConstantsContext.gameState.ladaMintAccount,
          ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        })
        .instruction(),
    );

    return { transaction };
    // return await gameConstantsContext.Client.program.rpc.casterCommitMoveS1(
    //   lvl,
    //   col,
    //   {
    //     accounts: {
    //       tokenProgram: TOKEN_PROGRAM_ID,
    //       systemProgram: anchor.web3.SystemProgram.programId,
    //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //       rent: SYSVAR_RENT_PUBKEY,
    //       authority: gameConstantsContext.Client.wallet.publicKey,
    //       game: gameConstantsContext.gameAccount,
    //       player: gameConstantsContext.playerAccount,
    //       caster: this.caster?.publicKey,
    //       season: gameConstantsContext.season,
    //       ...mintAccounts,
    //       gameTurnData,
    //       ladaMint: gameConstantsContext.gameState.ladaMintAccount,
    //       ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
    //     },
    //     signers: [gameConstantsContext.Client.wallet.payer],
    //   },
    // );
  }

  //TODO: to test
  async casterCommitLoot(): Promise<TransactionBuilder> {
    const gameTurnData = await this.getGameTurnData(
      this.caster.turnCommit?.turn,
    );

    const transaction = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .casterCommitLoot()
        .accounts({
          systemProgram: anchor.web3.SystemProgram.programId,
          authority: gameConstantsContext.Client.wallet.publicKey,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          gameTurnData,
        })
        .instruction(),
    );

    return { transaction };
  }

  //TODO: to test
  async casterCommitCraft(
    item1: Item,
    item2: Item,
    item3: Item,
  ): Promise<TransactionBuilder> {
    const transaction = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .casterCommitCraftS1()
        .accounts({
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          item1: item1.publicKey,
          item2: item2.publicKey,
          item3: item3.publicKey,
          ladaMint: gameConstantsContext.gameState.ladaMintAccount,
          ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
          season: gameConstantsContext.season,
        })
        .instruction(),
    );

    return { transaction };
    // return await gameConstantsContext.Client.program.rpc.casterCommitCraftS1({
    //   accounts: {
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    //     rent: SYSVAR_RENT_PUBKEY,
    //     authority: gameConstantsContext.Client.wallet.publicKey,
    //     game: gameConstantsContext.gameAccount,
    //     player: gameConstantsContext.playerAccount,
    //     caster: this.caster?.publicKey,
    //     item1: item1.publicKey,
    //     item2: item2.publicKey,
    //     item3: item3.publicKey,
    //     ladaMint: gameConstantsContext.gameState.ladaMintAccount,
    //     ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
    //     season: gameConstantsContext.season,
    //   },
    //   signers: [gameConstantsContext.Client.wallet.payer],
    // });
  }

  //TODO: to test
  //TODO: test move
  //TODO: test spell
  //TODO: test craft
  //TODO: test loot
  async casterRedeemAction(
    casterAccount?: Caster,
  ): Promise<TransactionBuilder> {
    const transaction = new Transaction();
    const caster = casterAccount || this.caster;

    const order = caster?.turnCommit.actions.actionOrder
      .map((value, key) => {
        return { type: key, value };
      })
      .filter((action) => action.value !== 0)
      .sort((a, b) => {
        return a.value - b.value;
      });

    let signers = [];
    for (const action of order) {
      switch (action.type) {
        case 0: {
          const itemMove = Keypair.generate();
          transaction.add(await this.redeemLoot(itemMove, caster));
          signers.push(itemMove);
          break;
        }
        case 1: {
          const itemSpell = Keypair.generate();
          transaction.add(await this.redeemSpell(itemSpell, caster));
          signers.push(itemSpell);
          break;
        }
        case 2: {
          transaction.add(await this.redeemMove(caster));
          break;
        }
        case 3: {
          const itemCraft = Keypair.generate();
          transaction.add(await this.redeemCraft(itemCraft, caster));
          signers.push(itemCraft);
          break;
        }
      }
    }

    transaction.add(await this.redeemActions(caster));

    return { transaction, signers };
  }

  //TODO: to test
  async equipItem(equipmentItem: Item): Promise<TransactionBuilder> {
    const itemType = Object.keys(
      equipmentItem.itemType.equipment?.equipmentType ||
        equipmentItem?.itemType,
    )[0];
    const transaction = new Transaction();
    if (
      this.caster.modifiers[itemType] &&
      this.caster.modifiers[itemType].toString() !== equipmentItem.publicKey
    ) {
      transaction.add(
        await gameConstantsContext.Client.program.methods
          .unequipItem()
          .accounts({
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
            caster: this.caster?.publicKey,
            item: this.caster.modifiers[itemType],
          })
          .instruction(),
      );
    }
    transaction.add(
      await gameConstantsContext.Client.program.methods
        .equipItem()
        .accounts({
          game: gameConstantsContext.gameAccount,
          authority: gameConstantsContext.Client.wallet.publicKey,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          item: equipmentItem.publicKey,
        })
        .instruction(),
    );

    return { transaction };
  }

  //TODO: to test
  async unequipAllItems(items: Item[]): Promise<TransactionBuilder> {
    const transaction = new Transaction();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      transaction.add(
        await gameConstantsContext.Client.program.methods
          .unequipItem()
          .accounts({
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
            caster: this.caster?.publicKey,
            item: new PublicKey(item.publicKey),
          })
          .instruction(),
      );
    }

    return { transaction };
  }

  //TODO: to test
  async unequipItem(itemPK: PublicKey): Promise<TransactionBuilder> {
    const transaction = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .unequipItem()
        .accounts({
          game: gameConstantsContext.gameAccount,
          authority: gameConstantsContext.Client.wallet.publicKey,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          item: itemPK,
        })
        .instruction(),
    );

    return { transaction };
  }

  //TODO: to test
  async castSpell(equipmentItem: Item): Promise<TransactionBuilder> {
    const mintAccounts = await this.getMintAccounts();
    const gameTurnData = await this.getGameTurnData();
    const transaction = new Transaction();

    if (
      this.caster?.modifiers?.spellBook &&
      equipmentItem.publicKey.toString() !==
        this.caster?.modifiers?.spellBook.toString()
    ) {
      transaction.add(
        await gameConstantsContext.Client.program.methods
          .unequipItem()
          .accounts({
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
            caster: this.caster?.publicKey,
            item: this.caster?.modifiers?.spellBook,
          })
          .instruction(),
        await gameConstantsContext.Client.program.methods
          .equipItem()
          .accounts({
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
            caster: this.caster?.publicKey,
            item: equipmentItem.publicKey,
          })
          .instruction(),
      );
    } else {
      transaction.add(
        await gameConstantsContext.Client.program.methods
          .equipItem()
          .accounts({
            game: gameConstantsContext.gameAccount,
            authority: gameConstantsContext.Client.wallet.publicKey,
            player: gameConstantsContext.playerAccount,
            caster: this.caster?.publicKey,
            item: equipmentItem.publicKey,
          })
          .instruction(),
      );
    }

    transaction.add(
      await gameConstantsContext.Client.program.methods
        .casterCommitSpell()
        .accounts({
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          caster: this.caster?.publicKey,
          slots: SYSVAR_SLOT_HASHES_PUBKEY,
          ...mintAccounts,
          spellbook: equipmentItem.publicKey,
          gameTurnData,
        })
        .instruction(),
    );

    return { transaction };
  }

  //TODO: to test
  async bulkManualResourceBurn(resources): Promise<TransactionBuilder> {
    const transaction = new Transaction();

    for (let i = 0; i < resources.length; i++) {
      if (resources[i].amount) {
        transaction.add(
          await this.manualResourceBurn(
            resources[i].itemFeature,
            resources[i].amount,
          ),
        );
      }
    }

    return { transaction };
  }

  //TODO: to test
  async prestigeCaster(): Promise<TransactionBuilder> {
    const newCaster = Keypair.generate();

    const transaction = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .transferCaster()
        .accounts({
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          oldGame: gameConstantsContext.previousGameAccount,
          newGame: gameConstantsContext.gameAccount,
          oldPlayer: gameConstantsContext.previousPlayerAccount,
          newPlayer: gameConstantsContext.playerAccount,
          oldSeason: gameConstantsContext.previousSeason,
          newSeason: gameConstantsContext.season,
          oldCaster: this.caster?.publicKey,
          newCaster: newCaster.publicKey,
          slots: SYSVAR_SLOT_HASHES_PUBKEY,
          instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
          ladaMint: gameConstantsContext.gameState.ladaMintAccount,
          ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        })
        .instruction(),
    );

    return { transaction, signers: [newCaster] };
  }

  private async manualResourceBurn(itemFeature: ItemFeature, amount: number) {
    const mintAccounts = await this.getMintAccounts();
    const gameTurnData = await this.getGameTurnData();

    return await gameConstantsContext.Client.program.methods
      .manualResourceBurn(itemFeature, new anchor.BN(amount))
      .accounts({
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.wallet.publicKey,
        game: gameConstantsContext.gameAccount,
        player: gameConstantsContext.playerAccount,
        caster: this.caster?.publicKey,
        gameTurnData: gameTurnData,
        ...mintAccounts,
      })
      .instruction();
  }

  private async redeemMove(caster: Caster): Promise<TransactionInstruction> {
    return await gameConstantsContext.Client.program.methods
      .casterRedeemMove()
      .accounts({
        game: gameConstantsContext.gameAccount,
        authority: gameConstantsContext.Client.wallet.publicKey,
        player: gameConstantsContext.playerAccount,
        caster: caster?.publicKey,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .instruction();
  }

  private async redeemLoot(
    item: Keypair,
    caster: Caster,
  ): Promise<TransactionInstruction> {
    const empty = Keypair.generate();
    const mintAccounts = await this.getMintAccounts();
    const gameTurnData = await this.getGameTurnData(caster?.turnCommit?.turn);

    return await gameConstantsContext.Client.program.methods
      .casterRedeemLoot()
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.wallet.publicKey,
        game: gameConstantsContext.gameAccount,
        player: gameConstantsContext.playerAccount,
        caster: caster?.publicKey,
        season: gameConstantsContext.season,
        gameSigner: gameConstantsContext.gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ladaMintAccount: gameConstantsContext.gameState.ladaMintAccount,
        gameLadaTokenAccount: gameConstantsContext.gameState.ladaTokenAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        gameTurnData,
        item: item.publicKey,
        staff: caster?.modifiers?.staff
          ? caster?.modifiers?.staff
          : empty.publicKey,
        head: caster?.modifiers?.head
          ? caster?.modifiers?.head
          : empty.publicKey,
        robe: caster?.modifiers?.robe
          ? caster?.modifiers?.robe
          : empty.publicKey,
        ...mintAccounts,
      })
      .instruction();
  }

  private async redeemCraft(
    item: Keypair,
    caster: Caster,
  ): Promise<TransactionInstruction> {
    return await gameConstantsContext.Client.program.methods
      .casterRedeemCraftS1()
      .accounts({
        game: gameConstantsContext.gameAccount,
        authority: gameConstantsContext.Client.wallet.publicKey,
        player: gameConstantsContext.playerAccount,
        caster: caster?.publicKey,
        season: gameConstantsContext.season,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        item: item.publicKey,
      })
      .instruction();
    // return gameConstantsContext.Client.program.instruction.casterRedeemCraftS1({
    //   accounts: {
    //     game: gameConstantsContext.gameAccount,
    //     authority: gameConstantsContext.Client.wallet.publicKey,
    //     player: gameConstantsContext.playerAccount,
    //     caster: caster?.publicKey,
    //     season: gameConstantsContext.season,
    //     slots: SYSVAR_SLOT_HASHES_PUBKEY,
    //     instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    //     rent: SYSVAR_RENT_PUBKEY,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     item: item.publicKey,
    //   },
    //   signers: [item, gameConstantsContext.Client.wallet.payer],
    // });
  }

  private async redeemSpell(
    item: Keypair,
    caster: Caster,
  ): Promise<TransactionInstruction> {
    const mintAccounts = await this.getMintAccounts();
    const empty = Keypair.generate();

    return await gameConstantsContext.Client.program.methods
      .casterRedeemSpell()
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
        authority: gameConstantsContext.Client.wallet.publicKey,
        game: gameConstantsContext.gameAccount,
        season: gameConstantsContext.season,
        player: gameConstantsContext.playerAccount,
        caster: caster?.publicKey,
        gameSigner: gameConstantsContext.gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        item: item.publicKey,
        ...mintAccounts,
      })
      .remainingAccounts([
        {
          pubkey: caster?.modifiers?.spellBook
            ? caster?.modifiers?.spellBook
            : empty.publicKey,
          isSigner: false,
          isWritable: true,
        },
      ])
      .instruction();
  }

  //DEBUG - Devnet only
  async giveLada(): Promise<TransactionBuilder> {
    const transaction = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .giveLada(new anchor.BN(1000 * 1e9))
        .accounts({
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          gameSigner: gameConstantsContext.gameSigner,
          game: gameConstantsContext.gameAccount,
          ladaMintAccount: gameConstantsContext.gameState.ladaMintAccount,
          gameLadaTokenAccount: gameConstantsContext.gameState.ladaTokenAccount,
          ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        })
        .instruction(),
    );

    return { transaction };
  }

  async giveResources(): Promise<TransactionBuilder> {
    const mintAccounts = await this.getMintAccounts();

    const transaction = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .giveResources(new anchor.BN(500))
        .accounts({
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          authority: gameConstantsContext.Client.wallet.publicKey,
          gameSigner: gameConstantsContext.gameSigner,
          game: gameConstantsContext.gameAccount,
          player: gameConstantsContext.playerAccount,
          ...mintAccounts,
        })
        .instruction(),
    );

    return { transaction };
  }

  async giveItem(itemType: ItemType): Promise<TransactionBuilder> {
    const item = Keypair.generate();

    const transaction = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .giveItem(itemType, new anchor.BN(1))
        .accounts({
          systemProgram: anchor.web3.SystemProgram.programId,
          game: gameConstantsContext.gameAccount,
          season: gameConstantsContext.season,
          authority: gameConstantsContext.Client.wallet.publicKey,
          player: gameConstantsContext.playerAccount,
          slots: SYSVAR_SLOT_HASHES_PUBKEY,
          item: item.publicKey,
        })
        .instruction(),
    );

    return { transaction, signers: [item] };
  }

  async changeTile() {
    const transaction = new Transaction().add(
      await gameConstantsContext.Client.program.methods
        .changeTile(
          { crafting: {} },
          this.caster?.modifiers.tileLevel,
          this.caster?.modifiers.tileColumn,
        )
        .accounts({
          systemProgram: anchor.web3.SystemProgram.programId,
          game: gameConstantsContext.gameAccount,
        })
        .instruction(),
    );

    return { transaction };
  }

  async casterRedeemAllActions(
    casters: Caster[],
  ): Promise<TransactionBuilder[]> {
    const transactions = [];

    for (let caster of casters) {
      transactions.push(await this.casterRedeemAction(caster));
    }

    return transactions;
  }

  async fallbackRedeem(casterAccount?: Caster): Promise<TransactionBuilder[]> {
    const caster = casterAccount || this.caster;
    const order = caster?.turnCommit.actions.actionOrder
      .map((value, key) => {
        return { type: key, value };
      })
      .filter((action) => action.value !== 0)
      .sort((a, b) => {
        return a.value - b.value;
      });

    const transactionBuilder: TransactionBuilder[] = [];

    for (const action of order) {
      switch (action.type) {
        case 0: {
          const itemLoot = Keypair.generate();
          transactionBuilder.push({
            transaction: new Transaction().add(
              await this.redeemLoot(itemLoot, caster),
            ),
            signers: [itemLoot],
            meta: 'loot' + itemLoot.publicKey.toString(),
          });
          break;
        }
        case 1: {
          const itemSpell = Keypair.generate();
          transactionBuilder.push({
            transaction: new Transaction().add(
              await this.redeemSpell(itemSpell, caster),
            ),
            signers: [itemSpell],
            meta: 'spell' + itemSpell.publicKey.toString(),
          });
          break;
        }
        case 2: {
          transactionBuilder.push({
            transaction: new Transaction().add(await this.redeemMove(caster)),
            meta: 'move',
          });
          break;
        }
        case 3: {
          const itemCraft = Keypair.generate();
          transactionBuilder.push({
            transaction: new Transaction().add(
              await this.redeemCraft(itemCraft, caster),
            ),
            signers: [itemCraft],
            meta: 'craft' + itemCraft.publicKey.toString(),
          });
          break;
        }
      }
    }

    transactionBuilder.push({
      transaction: new Transaction().add(await this.redeemActions(caster)),
      meta: 'actions',
    });

    return transactionBuilder;
  }

  private async redeemActions(caster: Caster) {
    const gameTurnData = await this.getGameTurnData(caster?.turnCommit?.turn);
    const remainingAccounts =
      caster?.turnCommit?.actions.spell && caster?.modifiers?.spellBook
        ? {
            remainingAccounts: [
              {
                pubkey: caster?.modifiers?.spellBook,
                isSigner: false,
                isWritable: true,
              },
            ],
          }
        : {};

    return await gameConstantsContext.Client.program.methods
      .casterRedeemReward()
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
        authority: gameConstantsContext.Client.wallet.publicKey,
        game: gameConstantsContext.gameAccount,
        season: gameConstantsContext.season,
        player: gameConstantsContext.playerAccount,
        caster: caster?.publicKey,
        gameSigner: gameConstantsContext.gameSigner,
        slots: SYSVAR_SLOT_HASHES_PUBKEY,
        ladaMintAccount: gameConstantsContext.gameState.ladaMintAccount,
        gameLadaTokenAccount: gameConstantsContext.gameState.ladaTokenAccount,
        ladaTokenAccount: gameConstantsContext.ladaTokenAccount,
        gameTurnData,
      })
      .remainingAccounts(remainingAccounts.remainingAccounts || [])
      .instruction();
  }

  //HELPERS
  private async getGameTurnData(turn = -1) {
    const turnNumber =
      turn !== -1 ? turn : gameConstantsContext.gameState?.turnInfo?.turn;
    if (turn != -1 && turn != gameConstantsContext.gameState?.turnInfo?.turn) {
      const [turnData] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from('turn_data'),
          gameConstantsContext.gameAccount.toBuffer(),
          Buffer.from(anchor.utils.bytes.utf8.encode(String(turnNumber))),
        ],
        gameConstantsContext.Client.program.programId,
      );
      return turnData;
    }
    return gameConstantsContext.turnData;
  }

  private async getMintAccounts() {
    return {
      resource1MintAccount: gameConstantsContext.gameState.resource1MintAccount,
      resource2MintAccount: gameConstantsContext.gameState.resource2MintAccount,
      resource3MintAccount: gameConstantsContext.gameState.resource3MintAccount,
      resource1TokenAccount: gameConstantsContext.resource1TokenAccount,
      resource2TokenAccount: gameConstantsContext.resource2TokenAccount,
      resource3TokenAccount: gameConstantsContext.resource3TokenAccount,
    };
  }
}
