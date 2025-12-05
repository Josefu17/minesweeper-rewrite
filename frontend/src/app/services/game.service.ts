import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { CoordinateRequest, GameState, NewGameRequest, Score } from '../models/api.types'
import { BaseApiService } from './base-api.service'
import { Difficulty } from '../models/game.types'

@Injectable({ providedIn: 'root' })
export class GameService extends BaseApiService {
  createGame(req: NewGameRequest): Observable<GameState> {
    return this.post('', req)
  }

  reveal(gameId: string, coord: CoordinateRequest): Observable<GameState> {
    return this.post(`/${gameId}/reveal`, coord)
  }

  toggleMark(gameId: string, coord: CoordinateRequest): Observable<GameState> {
    return this.post(`/${gameId}/toggle-mark`, coord)
  }

  autoExpand(gameId: string, coord: CoordinateRequest): Observable<GameState> {
    return this.post(`/${gameId}/auto-expand`, coord)
  }

  submitScore(gameId: string, playerName: string): Observable<GameState> {
    return this.post(`/${gameId}/score`, { playerName: playerName })
  }

  getHighScores(difficulty: Difficulty): Observable<Score[]> {
    return this.get(`/scores`, {
      params: { difficulty },
    })
  }
}
