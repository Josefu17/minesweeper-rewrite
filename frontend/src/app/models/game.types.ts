export type Difficulty = 'MEDIUM' | 'HARD';

export type GameStatus = 'RUNNING' | 'WON' | 'LOST';

export type BlockType =
  | 'UNKNOWN'
  | 'MINE'
  | 'MARKED'
  | 'BLANK'
  | 'REVEALED'
  | 'IN_PROGRESS';

export interface Cell {
  x: number;
  y: number;
  state: BlockType;

  adjacentMines?: number; // only set for REVEALED
}
