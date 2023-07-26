import { PlayerData } from '../types';

type UserId = string;

export class MatchingTable {
  private waitingUser: PlayerData | undefined = undefined;

  matchmake(
    enqueuedUser: PlayerData,
  ): { p1: PlayerData; p2: PlayerData } | null {
    if (!this.waitingUser) {
      console.log('add waiting', enqueuedUser.data.username);
      this.waitingUser = enqueuedUser;
      return null;
    } else if (this.waitingUser?.data.id === enqueuedUser.data.id) {
      return null;
    }
    const players = { p1: this.waitingUser, p2: enqueuedUser };
    this.clearWaitingUser(this.waitingUser.data.id);
    return players;
  }

  clearWaitingUser(userId: UserId) {
    if (this.waitingUser?.data.id !== userId) {
      return;
    }
    this.waitingUser = undefined;
  }
}
