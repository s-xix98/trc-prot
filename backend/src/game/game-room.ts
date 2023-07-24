import { GameLogic } from './logic/game-logic';
import { GameFactory } from './matching/types';
import { PlayerData } from './types';

type UserId = string;

// TODO ほんとはGameLogicじゃなくて任意のゲームインタフェースをマップ出来るようにしたいが、GameLogicを色々疎結合にするコストが高いので一旦放置。
// GameLogicと密結合なのでテスタビリティが終ってるけど、テストを書かないことで抵抗してる

export class GameRoom {
  private playingUsers = new Map<UserId, GameLogic>();

  add(
    { p1, p2 }: { p1: PlayerData; p2: PlayerData },
    gameFactory: GameFactory,
  ): { err: string | null } {
    if (this.isPlaying(p1.data.id)) {
      return { err: p1.data.username + ' already playing' };
    }
    if (this.isPlaying(p2.data.id)) {
      return { err: p2.data.username + ' already playing' };
    }
    if (p1.data.id === p2.data.id) {
      return { err: 'same user' };
    }
    const game = gameFactory(p1, p2);
    this.playingUsers.set(p1.data.id, game);
    this.playingUsers.set(p2.data.id, game);
    return { err: null };
  }

  delete({ p1, p2 }: { p1: UserId; p2: UserId }): boolean {
    if (p1 == p2) {
      return false;
    }
    const g1 = this.getGame(p1);
    const g2 = this.getGame(p2);
    if (!g1 || !g2 || g1 !== g2) {
      return false;
    }
    const isU1deleted = this.playingUsers.delete(p1);
    const isU2deleted = this.playingUsers.delete(p2);
    return isU1deleted && isU2deleted;
  }


  getGame(userId: UserId): GameLogic | undefined {
    return this.playingUsers.get(userId);
  }

  isPlaying(userId: UserId): boolean {
    return this.playingUsers.has(userId);
  }
}

