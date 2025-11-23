export type Difficulty = 'MEDIUM' | 'HARD';

export type GameStatus = 'RUNNING' | 'WON' | 'LOST';

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

export interface Cell {
  x: number;
  y: number;
  state: BlockType;
  adjacentMines?: number; // undefined if not DISCOVERED
}

export type BlockType =
  | 'UNKNOWN'
  | 'MINE'
  | 'MARKED'
  | 'BLANK'
  | 'DISCOVERED'
  | 'IN_PROGRESS';


