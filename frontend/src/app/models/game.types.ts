export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'CUSTOM'
export type GameStatus = 'READY' | 'RUNNING' | 'WON' | 'LOST'

export type BlockType = 'HIDDEN' | 'FLAGGED' | 'REVEALED' | 'MINE' | 'REVEALED_MINE'

export interface Cell {
  x: number
  y: number
  state: BlockType

  adjacentMines?: number // set for REVEALED
}
