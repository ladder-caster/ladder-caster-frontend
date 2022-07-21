import {PublicKey} from '@solana/web3.js';

import {Client,Game,GameState,Tile,GameTurnInfo} from '../'
import { utils } from '@project-serum/anchor';
import resources from '../../config/resources.json';
import {OLD_SEASON} from 'core/remix/state'
import config from '../../../../../../config';
export default class GameConstantsGameContext implements GameState{
  game: Game;
  gameSigner: PublicKey;
  season: PublicKey;
  turnData: PublicKey;
  futureTurnData: PublicKey;
  previousSeason: PublicKey;
  constructor(){
    //TODO: setup wss listeners to listen for turn changes
  }
  public async init(client: Client){
    const gameAccount = new PublicKey(
      localStorage.getItem('gamePK') as string,
    )
    const previousGameAccount = new PublicKey(
      resources.seasons[OLD_SEASON][config.pkString],
    );
    const game = (await client.program.account.game.fetch(
      gameAccount,
    )) as Game
    const programId = client.program.programId;
    
    const asyncDispatch = [
      PublicKey.findProgramAddress([Buffer.from('game_signer')], programId),
      PublicKey.findProgramAddress(
        [Buffer.from('season'), new PublicKey(gameAccount).toBuffer()],
        programId,
      ),
      PublicKey.findProgramAddress(
        [
          gameAccount.toBuffer(),
          client?.program?.provider?.wallet?.publicKey?.toBuffer() as Buffer,
        ],
        client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [Buffer.from('season'), new PublicKey(gameAccount).toBuffer()],
        client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [
          Buffer.from('turn_data'),
          gameAccount.toBuffer(),
          Buffer.from(utils.bytes.utf8.encode(String(game.turnInfo.turn))),
        ],
        client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [
          Buffer.from('turn_data'),
          gameAccount.toBuffer(),
          Buffer.from(utils.bytes.utf8.encode(String(game.turnInfo.turn + 1))),
        ],
        client.program.programId,
      ),
      PublicKey.findProgramAddress(
        [Buffer.from('season'), new PublicKey(previousGameAccount).toBuffer()],
        client.program.programId,
      )
    ]
    const [gameSigner,season,turnData,futureTurnData] =  await Promise.all(asyncDispatch)
    this.game = game;
    this.gameSigner = gameSigner[0];
    this.season = season[0];
    this.turnData = turnData[0];
    this.futureTurnData = futureTurnData[0];
  }
  
  public getTile(row: number, col: number): Tile{
    return this.game?.map?.[row]?.[col];
  }

  public get gameVersion():number{
    return this.game?.version;
  }
  public get authority():PublicKey{
    return this.game?.authority;
  }
  public get map():Tile[][]{
    return this.game?.map;
  }
  public get turnInfo(): GameTurnInfo{
    return this.game?.turnInfo;
  }
  public get lastTurnAdded(): number{
    return this.game?.lastTurnAdded;
  }
  public get signerBump(): number{
    return this.game?.signerBump;
  }
  public get resource1MintAccount(): PublicKey{
    return this.game?.resource1MintAccount;
  }
  public get resource2MintAccount(): PublicKey{
    return this.game?.resource2MintAccount;
  }
  public get resource3MintAccount(): PublicKey{
    return this.game?.resource3MintAccount;
  }
  public get ladaMintAccount(): PublicKey{
    return this.game?.ladaMintAccount;
  }
  public get ladaTokenAccount(): PublicKey{
    return this.game?.ladaTokenAccount;
  }
  public get gameState():Game{
    return this.game;
  }
}
