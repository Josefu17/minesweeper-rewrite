import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {Observable} from 'rxjs';
import {GameService} from '../services/game.service';
import {GameState} from '../models/api.types';
import {Cell, Difficulty} from '../models/game.types';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule
  ],
  templateUrl: './game-board.html',
  styleUrls: ['./game-board.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoard {
  private readonly fb = inject(FormBuilder);
  private readonly gameService = inject(GameService);

  gameState = signal<GameState | undefined>(undefined);
  loading = signal<boolean>(false);
  errorMessage = signal<string | undefined>(undefined);

  form = this.fb.nonNullable.group({
    rows: [10, [Validators.required, Validators.min(5), Validators.max(30)]],
    columns: [10, [Validators.required, Validators.min(5), Validators.max(30)]],
    difficulty: ['MEDIUM' as Difficulty, Validators.required]
  });

  isRunning = computed(() => this.gameState()?.status === 'RUNNING');

  createGame(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set(undefined);

    this.gameService.createGame(this.form.getRawValue()).subscribe({
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

  onLeftClick(cell: Cell): void {
    if (!this.isRunning()) return;
    const currentGame = this.gameState()!;

    if (this.isMine(cell) || this.isFlagged(cell)) return;

    else if (this.isRevealed(cell)) {
      this.handleAction(this.gameService.autoExpand(currentGame.id, {x: cell.x, y: cell.y}));
    } else if (this.isHidden(cell)) {
      this.handleAction(this.gameService.reveal(currentGame.id, {x: cell.x, y: cell.y}));
    }
  }

  onRightClick(event: MouseEvent, cell: Cell): void {
    event.preventDefault();
    if (!this.isRunning()) return;
    const currentGame = this.gameState()!;

    // Cannot flag something that is already revealed
    if (this.isRevealed(cell)) return;

    this.handleAction(this.gameService.toggleMark(currentGame.id, {x: cell.x, y: cell.y}));
  }

  // --- Helpers for HTML ---
  getCellClass(cell: Cell): string {
    if (this.isRevealed(cell)) return 'cell-revealed';
    if (this.isFlagged(cell)) return 'cell-flagged';
    if (this.isMine(cell)) return 'cell-mine';
    return 'cell-hidden'; // Default
  }

  isFlagged(cell: Cell): boolean {
    return cell.state === 'FLAGGED';
  }

  isMine(cell: Cell): boolean {
    return cell.state === 'MINE';
  }

  isRevealed(cell: Cell): boolean {
    return cell.state === 'REVEALED';
  }

  isHidden(cell: Cell): boolean {
    return cell.state === 'HIDDEN';
  }

  // A cell is "Numbered" if it's Revealed AND has adjacent mines > 0
  showNumber(cell: Cell): boolean {
    return this.isRevealed(cell) && (cell.adjacentMines || 0) > 0;
  }

  // Generic subscription helper
  private handleAction(obs: Observable<GameState>): void {
    obs.subscribe({
      next: (state) => this.gameState.set(state),
      error: () => this.errorMessage.set('Action failed')
    });
  }

  adjustValue(controlName: 'rows' | 'columns', delta: number): void {
    const control = this.form.get(controlName) as FormControl<number>;
    const current = control.value;
    const newValue = current + delta;
    if (newValue >= 5 && newValue <= 30) control.setValue(newValue);
  }
}
