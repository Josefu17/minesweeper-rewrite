import {Difficulty} from './difficulty';

export interface NewGameRequest {
  rows: number;
  columns: number;
  difficulty: Difficulty;
}

export interface CoordinateRequest {
  x: number;
  y: number;
}
