import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {GameService} from '../services/game.service';
import {GameState, NewGameRequest} from '../models/api.types';
import {Cell} from '../models/game.types';
import {DifficultySelector} from '../difficulty-selector/difficulty-selector'

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    DifficultySelector,
  ],
  templateUrl: './game-board.html',
  styleUrls: ['./game-board.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoard {
  private readonly gameService = inject(GameService);

  // State Signals
  gameState = signal<GameState | undefined>(undefined);
  loading = signal<boolean>(false);
  errorMessage = signal<string | undefined>(undefined);

  isRunning = computed(() => this.gameState()?.status === 'RUNNING');

  createGame(req: NewGameRequest): void {
    this.loading.set(true);
    this.errorMessage.set(undefined);

    this.gameService.createGame(req).subscribe({
      next: (state) => {
        this.gameState.set(state);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to create game');
        this.loading.set(false);
      }
    });
  }

  resetGame(): void {
    this.gameState.set(undefined);
  }

  // --- Gameplay Interactions ---
  onLeftClick(cell: Cell): void {
    if (!this.isRunning()) return;
    if (this.isFlagged(cell) || this.isMine(cell)) return;

    const gameState = this.gameState()!;

    if (this.isRevealed(cell)) {
      this.handleAction(this.gameService.autoExpand(gameState.id, {x: cell.x, y: cell.y}));
    } else {
      this.handleAction(this.gameService.reveal(gameState.id, {x: cell.x, y: cell.y}));
    }
  }

  onRightClick(event: MouseEvent, cell: Cell): void {
    event.preventDefault();
    if (!this.isRunning()) return;
    if (this.isRevealed(cell)) return;

    this.handleAction(this.gameService.toggleMark(this.gameState()!.id, {x: cell.x, y: cell.y}));
  }

  private handleAction(obs: Observable<GameState>): void {
    obs.subscribe({
      next: (state) => this.gameState.set(state),
      error: () => this.errorMessage.set('Action failed')
    });
  }

  // --- Helpers ---
  getCellClass(cell: Cell): string {
    if (this.isRevealed(cell)) return 'cell-revealed';
    if (this.isFlagged(cell)) return 'cell-flagged';
    if (this.isMine(cell)) return 'cell-mine';
    return 'cell-hidden';
  }

  showNumber(cell: Cell): boolean {
    return this.isRevealed(cell) && (cell.adjacentMines ?? 0) > 0;
  }

  isRevealed(c: Cell) {
    return c.state === 'REVEALED';
  }

  isFlagged(c: Cell) {
    return c.state === 'FLAGGED';
  }

  isMine(c: Cell) {
    return c.state === 'MINE';
  }
}
