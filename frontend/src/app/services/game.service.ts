// src/app/services/game.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {CoordinateRequest, NewGameRequest,} from '../models/interface';
import {GameState} from '../models/difficulty';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  createGame(req: NewGameRequest): Observable<GameState> {
    return this.http.post<GameState>(this.baseUrl, req);
  }

  getGame(id: string): Observable<GameState> {
    return this.http.get<GameState>(`${this.baseUrl}/${id}`);
  }

  reveal(id: string, coord: CoordinateRequest): Observable<GameState> {
    return this.http.post<GameState>(`${this.baseUrl}/${id}/reveal`, coord);
  }

  toggleMark(id: string, coord: CoordinateRequest): Observable<GameState> {
    return this.http.post<GameState>(`${this.baseUrl}/${id}/toggle-mark`, coord);
  }

  autoExpand(id: string, coord: CoordinateRequest): Observable<GameState> {
    return this.http.post<GameState>(`${this.baseUrl}/${id}/auto-expand`, coord);
  }
}
