export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'CUSTOM'
export type GameStatus = 'RUNNING' | 'WON' | 'LOST'

export type BlockType = 'HIDDEN' | 'FLAGGED' | 'REVEALED' | 'MINE'

export interface Cell {
  x: number
  y: number
  state: BlockType

  adjacentMines?: number // set for REVEALED
}
