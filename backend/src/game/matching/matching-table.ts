import { PlayerData } from '../types';
import { GameLogic } from '../logic/game-logic';


export class MatchingTable {
  private userGameMap = new Map<string, GameLogic>();
  private waitingUser: PlayerData | undefined = undefined;

  getGame(userId: string): GameLogic | undefined {
    return this.userGameMap.get(userId);
  }

}
