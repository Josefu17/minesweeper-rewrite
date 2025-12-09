import { Cell, Difficulty, GameStatus } from './game.types'

export interface NewGameRequest {
  difficulty: Difficulty

  // For custom diff
  customConfig?: CustomConfig
}

export interface CustomConfig {
  rows: number
  columns: number
  customMines: number
  customLives: number
}

export interface CoordinateRequest {
  x: number
  y: number
}

export interface GameState {
  id: string
  difficulty: Difficulty
  status: GameStatus
  livesLeft: number
  rows: number
  columns: number
  mineCount: number
  marksLeft: number
  grid: Cell[][]
}

export interface Score {
  playerName: string
  timeSeconds: number
  playedAt: string
  difficulty: Difficulty
}
