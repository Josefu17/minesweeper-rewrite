import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {GameService} from '../services/game.service';
import {Difficulty} from '../models/game.types';
import {Score} from '../models/api.types';

@Component({
  selector: 'app-high-score-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Hall of Fame</h2>
    <mat-dialog-content>
      <mat-tab-group (selectedTabChange)="onTabChange($event)">
        <mat-tab label="Easy">
          <ng-template matTabContent>
            <ng-container *ngTemplateOutlet="scoreTable; context: { $implicit: easyScores() }"></ng-container>
          </ng-template>
        </mat-tab>
        <mat-tab label="Medium">
          <ng-template matTabContent>
            <ng-container *ngTemplateOutlet="scoreTable; context: { $implicit: mediumScores() }"></ng-container>
          </ng-template>
        </mat-tab>
        <mat-tab label="Hard">
          <ng-template matTabContent>
            <ng-container *ngTemplateOutlet="scoreTable; context: { $implicit: hardScores() }"></ng-container>
          </ng-template>
        </mat-tab>
      </mat-tab-group>

      <ng-template #scoreTable let-scores>
        <div class="table-container">
          @if (loading()) {
            <div class="spinner-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else if (scores.length === 0) {
            <div class="empty-state">No scores yet. Be the first!</div>
          } @else {
            <table mat-table [dataSource]="scores" class="score-table">
              <ng-container matColumnDef="rank">
                <th mat-header-cell *matHeaderCellDef> #</th>
                <td mat-cell *matCellDef="let element; let i = index">
                  <span class="rank-badge" [class.top-3]="i < 3">{{ i + 1 }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef> Player</th>
                <td mat-cell *matCellDef="let element"> {{ element.playerName }}</td>
              </ng-container>

              <ng-container matColumnDef="time">
                <th mat-header-cell *matHeaderCellDef> Time</th>
                <td mat-cell *matCellDef="let element"> {{ formatTime(element.timeSeconds) }}</td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef> Date</th>
                <td mat-cell *matCellDef="let element" class="date-cell">
                  {{ element.playedAt | date:'shortDate' }}
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          }
        </div>
      </ng-template>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      width: 500px;
      max-width: 90vw;
    }

    .table-container {
      min-height: 300px;
      padding-top: 1rem;
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }

    .empty-state {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 2rem;
    }

    .score-table {
      width: 100%;
    }

    .rank-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #eee;
      font-size: 0.8rem;
      font-weight: bold;

      &.top-3 {
        background: #ffd700; /* Gold */
        color: #333;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }

    /* Make 2nd and 3rd place slightly different if you want,
       or keep gold for all top 3 */
    tr:nth-child(2) .rank-badge.top-3 { background: #c0c0c0; }

    /* Silver */
    tr:nth-child(3) .rank-badge.top-3 { background: #cd7f32; color: white; }

    /* Bronze */

    .date-cell {
      color: #888;
      font-size: 0.85rem;
    }
  `]
})
export class HighScoreDialog implements OnInit {
  private gameService = inject(GameService);

  easyScores = signal<Score[]>([]);
  mediumScores = signal<Score[]>([]);
  hardScores = signal<Score[]>([]);
  loading = signal(false);

  displayedColumns = ['rank', 'name', 'time', 'date'];

  ngOnInit() {
    this.loadScores('EASY');
  }

  onTabChange(event: any) {
    const diff = ['EASY', 'MEDIUM', 'HARD'][event.index] as Difficulty;
    if (this.getSignalFor(diff)().length === 0) {
      this.loadScores(diff);
    }
  }

  private getSignalFor(diff: Difficulty) {
    if (diff === 'MEDIUM') return this.mediumScores;
    if (diff === 'HARD') return this.hardScores;
    return this.easyScores;
  }

  loadScores(difficulty: Difficulty) {
    this.loading.set(true);
    this.gameService.getHighScores(difficulty).subscribe({
      next: (data) => {
        this.getSignalFor(difficulty).set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}
