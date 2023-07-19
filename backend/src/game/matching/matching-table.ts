import { PlayerData } from '../types';
import { GameLogic } from '../logic/game-logic';

import { GameFactory, OnMatched } from './types';

// TODO ほんとはGameLogicじゃなくて任意のゲームインタフェースをマップ出来るようにしたいが、GameLogicを色々疎結合にするコストが高いので一旦放置。
// GameLogciと密結合なのでテスタビリティが終ってるけど、テストを書かないことで抵抗してる

export class MatchingTable {
  private userGameMap = new Map<string, GameLogic>();
  private waitingUser: PlayerData | undefined = undefined;

  matchmake(
    enqueuedUser: PlayerData,
    gameFactory: GameFactory,
    onMatched: OnMatched,
  ) {
    if (this.isPlaying(enqueuedUser.data.id)) {
      console.log('already playing', enqueuedUser.data.username);
      return;
    } else if (!this.waitingUser) {
      console.log('add waiting', enqueuedUser.data.username);
      this.waitingUser = enqueuedUser;
      return;
    } else if (this.waitingUser.data.id === enqueuedUser.data.id) {
      return;
    }
    const game = gameFactory(this.waitingUser, enqueuedUser);
    this.userGameMap.set(this.waitingUser.data.id, game);
    this.userGameMap.set(enqueuedUser.data.id, game);
    this.clearWaitingUser(this.waitingUser.data.id);
    onMatched(this.waitingUser, enqueuedUser);
  }

  getGame(userId: string): GameLogic | undefined {
    return this.userGameMap.get(userId);
  }

  isPlaying(userId: string): boolean {
    return this.userGameMap.has(userId);
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
