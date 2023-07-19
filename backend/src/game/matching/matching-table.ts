import { PlayerData } from '../types';
import { GameLogic } from '../logic/game-logic';


export class MatchingTable {
  private userGameMap = new Map<string, GameLogic>();
  private waitingUser: PlayerData | undefined = undefined;

  getGame(userId: string): GameLogic | undefined {
    return this.userGameMap.get(userId);
  }


  deleteGame(userId1: string, userId2: string): boolean {
    const g1 = this.getGame(userId1);
    const g2 = this.getGame(userId2);
    if (!g1 || !g2 || g1 !== g2) {
      return false;
    }
    const isU1deleted = this.userGameMap.delete(userId1);
    const isU2deleted = this.userGameMap.delete(userId2);
    return isU1deleted && isU2deleted;
  }


  clearWaitingUser(userId: string) {
    if (this.waitingUser?.data.id !== userId) {
      return;
    }
    this.waitingUser = undefined;
  }
}
