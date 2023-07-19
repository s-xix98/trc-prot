import { GameLogic } from '../logic/game-logic';
import { PlayerData } from '../types';

export type GameFactory = (
  readonly player1: PlayerData,
  readonly player2: PlayerData,
) => GameLogic;

