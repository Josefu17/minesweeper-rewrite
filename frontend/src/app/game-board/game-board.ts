import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {GameService} from '../services/game.service';
import {BlockType, Difficulty, GameState} from '../models/difficulty';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

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
  styleUrls: ['./game-board.scss']
})
export class GameBoardComponent {
  private readonly fb = inject(FormBuilder);
  private readonly gameService = inject(GameService);

  game?: GameState;
  loading = false;
  error?: string;

  form = this.fb.nonNullable.group({
    // Added validators so the UI can react to bad input
    rows: [10, [Validators.required, Validators.min(5), Validators.max(30)]],
    columns: [10, [Validators.required, Validators.min(5), Validators.max(30)]],
    difficulty: ['MEDIUM' as Difficulty, Validators.required]
  });

  createGame(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = undefined;
    const {rows, columns, difficulty} = this.form.getRawValue();

    this.gameService.createGame({rows, columns, difficulty}).subscribe({
      next: (state) => {
        this.game = state;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to create game';
        this.loading = false;
      }
    });
  }

  onCellLeftClick(x: number, y: number): void {
    if (!this.game || this.game.status !== 'RUNNING') return;
    // Add logic: if cell is already discovered, do nothing to save API calls

    this.gameService.reveal(this.game.id, {x, y}).subscribe({
      next: (state) => (this.game = state),
      error: () => (this.error = 'Reveal failed')
    });
  }

  onCellRightClick(event: MouseEvent, x: number, y: number): void {
    event.preventDefault();
    if (!this.game || this.game.status !== 'RUNNING') return;

    this.gameService.toggleMark(this.game.id, {x, y}).subscribe({
      next: (state) => (this.game = state),
      error: () => (this.error = 'Toggle mark failed')
    });
  }

  // Helper for CSS classes based on cell state
  getCellClass(cell: any): string {
    if (cell.state === 'DISCOVERED') return 'cell-discovered';
    if (cell.state === 'MARKED') return 'cell-marked';
    if (cell.state === 'MINE') return 'cell-mine';
    return 'cell-hidden';
  }

  cellDisplay(state: BlockType, adjacentMines?: number): string {
    // You can keep your current logic or use MatIcons in the HTML
    if (state === 'MARKED') return '🚩';
    if (state === 'MINE') return '💣';
    if (state === 'DISCOVERED' && adjacentMines && adjacentMines > 0) return String(adjacentMines);
    return '';
  }
}
