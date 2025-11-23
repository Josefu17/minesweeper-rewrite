import {Cell, Difficulty, GameStatus} from './game.types';

export interface NewGameRequest {
  rows: number;
  columns: number;
  difficulty: Difficulty;

  // For custom diff
  mines?: number;
  lives?: number;
}
export interface CoordinateRequest {
  x: number;
  y: number;
}

export interface GameState {
  id: string;
  status: GameStatus;
  livesLeft: number;
  rows: number;
  columns: number;
  mineCount: number;
  marksLeft: number;
  grid: Cell[][];
}
