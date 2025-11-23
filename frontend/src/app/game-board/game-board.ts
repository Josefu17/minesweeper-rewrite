import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs'; // New Import
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {GameService} from '../services/game.service';
import {GameState, NewGameRequest} from '../models/api.types';
import {Cell, Difficulty} from '../models/game.types'; // For "Lives" check

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule
  ],
  templateUrl: './game-board.html',
  styleUrls: ['./game-board.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoard {
  private readonly fb = inject(FormBuilder);
  private readonly gameService = inject(GameService);

  // State Signals
  gameState = signal<GameState | undefined>(undefined);
  loading = signal<boolean>(false);
  errorMessage = signal<string | undefined>(undefined);

  // Computed State
  isRunning = computed(() => this.gameState()?.status === 'RUNNING');

  // Tracks which tab is active (0=Easy, 1=Medium, 2=Hard, 3=Custom)
  selectedDiff = signal<Difficulty>('MEDIUM');

  // Form for CUSTOM inputs only
  customForm = this.fb.nonNullable.group({
    rows: [20, [Validators.required, Validators.min(5), Validators.max(30)]],
    columns: [20, [Validators.required, Validators.min(5), Validators.max(30)]],
    mines: [50, [Validators.required, Validators.min(1)]],
    enableLives: [false] // Checkbox for "Second Chance"
  });

  // --- Actions ---

  // Triggered when clicking a Tab
  onTabChange(index: number): void {
    const modes: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'CUSTOM'];
    this.selectedDiff.set(modes[index]);
  }

  createGame(): void {
    if (this.selectedDiff() === 'CUSTOM' && this.customForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(undefined);

    const diff = this.selectedDiff();

    const req: NewGameRequest = {
      difficulty: diff,
      rows: diff === 'CUSTOM' ? this.customForm.controls.rows.value : 0,
      columns: diff === 'CUSTOM' ? this.customForm.controls.columns.value : 0,
      customMines: diff === 'CUSTOM' ? this.customForm.controls.mines.value : 0,
      customLives: diff === 'CUSTOM' && this.customForm.controls.enableLives.value ? 1 : 0
    };

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

  // --- Custom Input Adjuster ---
  adjustCustom(controlName: 'rows' | 'columns' | 'mines', delta: number): void {
    const control = this.customForm.get(controlName) as FormControl<number>;
    if (!control) return;
    const val = control.value + delta;
    if (val > 0) control.setValue(val);
  }

  // --- Gameplay Interactions (Same as before) ---
  onLeftClick(cell: Cell): void {
    if (!this.isRunning()) return;
    if (this.isFlagged(cell) || this.isMine(cell)) return;

    const gameState = this.gameState()!

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
