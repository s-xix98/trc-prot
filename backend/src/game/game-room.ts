import { GameLogic } from './logic/game-logic';
import { GameFactory } from './matching/types';
import { PlayerData } from './types';

type UserId = string;

// TODO ほんとはGameLogicじゃなくて任意のゲームインタフェースをマップ出来るようにしたいが、GameLogicを色々疎結合にするコストが高いので一旦放置。
// GameLogicと密結合なのでテスタビリティが終ってるけど、テストを書かないことで抵抗してる

export class GameRoom {
  private playingUsers = new Map<UserId, GameLogic>();
  private invitations: Invitation = new Invitation();

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

  invite(
    { src, dest }: { src: UserId; dest: UserId },
    gameFactory: GameFactory,
  ): { err: string | null } {
    if (this.isPlaying(src)) {
      return { err: `ID: ${src} is playing` };
    }
    this.invitations.set({ src, dest }, gameFactory);
    return { err: null };
  }

  acceptInvitation({ src, dest }: { src: PlayerData; dest: PlayerData }): {
    err: string | null;
  } {
    const srcId = src.data.id;
    const destId = dest.data.id;
    const gameFactory = this.invitations.getGameFactory({
      src: srcId,
      dest: destId,
    });
    if (!gameFactory) {
      return {
        err: src.data.username + dest.data.username + 'has no invitaion',
      };
    }
    const res = this.add({ p1: src, p2: dest }, gameFactory);
    if (res.err != null) {
      return res;
    }
    this.invitations.delete({ src: srcId, dest: destId });
    return { err: null };
  }

  denyInvitation({ src, dest }: { src: UserId; dest: UserId }) {
    this.invitations.delete({ src, dest });
  }

  getInviters(destUserId: UserId): UserId[] {
    return this.invitations.getInviterIds(destUserId);
  }

  deleteInvitations(userid: UserId) {
    this.invitations.deleteMany(userid);
  }

  getGame(userId: UserId): GameLogic | undefined {
    return this.playingUsers.get(userId);
  }

  isPlaying(userId: UserId): boolean {
    return this.playingUsers.has(userId);
  }
}

class Invitation {
  private srcs = new Map<UserId, Set<UserId>>();
  private dests = new Map<UserId, Set<UserId>>();
  private factory = new Map<{ src: UserId; dest: UserId }, GameFactory>();

  getInviterIds(dest: UserId) {
    const inviterIds = this.dests.get(dest);
    return inviterIds ? Array.from(inviterIds) : [];
  }

  getGameFactory({ src, dest }: { src: UserId; dest: UserId }) {
    return this.factory.get({ src, dest });
  }

  set({ src, dest }: { src: UserId; dest: UserId }, gameFactory: GameFactory) {
    if (!this.srcs.has(src)) {
      this.srcs.set(src, new Set<UserId>());
    }
    if (!this.dests.has(dest)) {
      this.dests.set(dest, new Set<UserId>());
    }
    this.srcs.get(src)?.add(dest);
    this.dests.get(dest)?.add(src);
    this.factory.set({ src, dest }, gameFactory);
  }

  has({ src, dest }: { src: UserId; dest: UserId }) {
    return this.srcs.has(src) && this.dests.has(dest);
  }

  delete({ src, dest }: { src: UserId; dest: UserId }) {
    this.srcs.get(src)?.delete(dest);
    this.dests.get(dest)?.delete(src);
    this.factory.delete({ src, dest });
  }

  deleteMany(userid: UserId) {
    const dests = this.srcs.get(userid);
    dests?.forEach((dest) => this.delete({ src: userid, dest }));
    const srcs = this.dests.get(userid);
    srcs?.forEach((src) => this.delete({ src, dest: userid }));
  }
}
