import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {GameService} from '../services/game.service';
import {Cell, Difficulty, GameState} from '../models/types';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule
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
    rows: [10, [Validators.required, Validators.min(3), Validators.max(30)]],
    columns: [10, [Validators.required, Validators.min(3), Validators.max(30)]],
    difficulty: ['MEDIUM' as Difficulty, Validators.required]
  });

  onLeftClick(cell: Cell): void {
    if (!this.isRunning()) return;

    const currentGame = this.gameState()!


    if (cell.state === 'MARKED') return; // Do not explode if clicking a flag
    if (cell.state === 'BLANK') return; // do nothing

    if (cell.state === 'DISCOVERED') {
      // Auto-Expand (Chord) if clicking a revealed number
      this.handleAction(this.gameService.autoExpand(currentGame.id, {x: cell.x, y: cell.y}));
    } else {
      // Normal Reveal
      this.handleAction(this.gameService.reveal(currentGame.id, {x: cell.x, y: cell.y}));
    }
  }

  isRunning = computed(() => this.gameState()?.status === 'RUNNING');

  createGame(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(undefined);


    const req = this.form.getRawValue();
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

  onRightClick(event: MouseEvent, cell: Cell): void {
    event.preventDefault();

    if (!this.isRunning()) return;
    const currentGame = this.gameState()!;

    // Prevent marking revealed cells
    if (cell.state === 'DISCOVERED' || cell.state === 'BLANK') return;

    this.handleAction(this.gameService.toggleMark(currentGame.id, {x: cell.x, y: cell.y}));
  }

  // Generic subscription helper
  private handleAction(obs: Observable<GameState>): void {
    obs.subscribe({
      next: (state) => this.gameState.set(state),
      error: () => this.errorMessage.set('Action failed')
    });
  }

  getCellClass(cell: Cell): string {
    if (cell.state === 'BLANK') return 'cell-blank';
    if (cell.state === 'DISCOVERED') return 'cell-discovered';
    if (cell.state === 'MARKED') return 'cell-marked';
    if (cell.state === 'MINE') return 'cell-mine';
    return 'cell-unknown';
  }

  adjustValue(controlName: 'rows' | 'columns', delta: number): void {
    const control = this.form.get(controlName) as FormControl<number>;
    const current = control.value;
    const newValue = current + delta;

    // Respect validators manually for UX
    if (newValue >= 5 && newValue <= 30) {
      control.setValue(newValue);
    }
  }
}
