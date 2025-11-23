import {Difficulty} from './types';

export interface NewGameRequest {
  rows: number;
  columns: number;
  difficulty: Difficulty;
}

export interface CoordinateRequest {
  x: number;
  y: number;
}
