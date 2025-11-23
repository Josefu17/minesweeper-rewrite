// The Clean Standard
export type Difficulty = 'MEDIUM' | 'HARD';
export type GameStatus = 'RUNNING' | 'WON' | 'LOST';

export type BlockType =
  | 'HIDDEN'
  | 'FLAGGED'
  | 'REVEALED'
  | 'MINE';

export interface Cell {
  x: number;
  y: number;
  state: BlockType;
  adjacentMines?: number; // 0 if "Blank", 1-8 if Numbered
}
