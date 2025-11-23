import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CoordinateRequest, GameState, NewGameRequest} from '../models/api.types';
import {BaseApiService} from './base-api.service';

@Injectable({providedIn: 'root'})
export class GameService extends BaseApiService {

  createGame(req: NewGameRequest): Observable<GameState> {
    return this.post('', req);
  }

  getGame(gameId: string): Observable<GameState> {
    return this.get(`/${gameId}`);
  }

  reveal(gameId: string, coord: CoordinateRequest): Observable<GameState> {
    return this.post(`/${gameId}/reveal`, coord);
  }

  toggleMark(gameId: string, coord: CoordinateRequest): Observable<GameState> {
    return this.post(`/${gameId}/toggle-mark`, coord);
  }

  autoExpand(gameId: string, coord: CoordinateRequest): Observable<GameState> {
    return this.post(`/${gameId}/auto-expand`, coord);
  }
}
