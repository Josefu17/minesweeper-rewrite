import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatTabsModule } from '@angular/material/tabs'
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { GameService } from '../services/game.service'
import { Difficulty } from '../models/game.types'
import { Score } from '../models/api.types'
import { TranslateModule } from '@ngx-translate/core'

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
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ 'HIGH_SCORE.TITLE' | translate }}</h2>

    <mat-dialog-content>
      <mat-tab-group
        [selectedIndex]="selectedTabIndex()"
        (selectedIndexChange)="onTabChange($event)"
      >
        <mat-tab [label]="'DIFFICULTY.EASY' | translate"></mat-tab>
        <mat-tab [label]="'DIFFICULTY.MEDIUM' | translate"></mat-tab>
        <mat-tab [label]="'DIFFICULTY.HARD' | translate"></mat-tab>
      </mat-tab-group>

      <div class="table-container">
        @if (loading()) {
          <div class="spinner-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else if (currentScores().length === 0) {
          <div class="empty-state">{{ 'HIGH_SCORE.EMPTY' | translate }}</div>
        } @else {
          <table mat-table [dataSource]="currentScores()" class="score-table">
            <ng-container matColumnDef="rank">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let i = index">
                <span
                  class="rank-badge"
                  [class.rank-1]="i === 0"
                  [class.rank-2]="i === 1"
                  [class.rank-3]="i === 2"
                >
                  {{ i + 1 }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>{{ 'HIGH_SCORE.COLS.PLAYER' | translate }}</th>
              <td mat-cell *matCellDef="let element">{{ element.playerName }}</td>
            </ng-container>

            <ng-container matColumnDef="time">
              <th mat-header-cell *matHeaderCellDef>{{ 'HIGH_SCORE.COLS.TIME' | translate }}</th>
              <td mat-cell *matCellDef="let element">{{ formatTime(element.timeSeconds) }}</td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>{{ 'HIGH_SCORE.COLS.DATE' | translate }}</th>
              <td mat-cell *matCellDef="let element" class="date-cell">
                {{ element.playedAt | date: 'shortDate' }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let _row; columns: displayedColumns"></tr>
          </table>
        }
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'HIGH_SCORE.CLOSE' | translate }}</button>
    </mat-dialog-actions>
  `,

  styles: [
    `
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
        color: #666;
      }

      .rank-badge.rank-1 {
        background: linear-gradient(135deg, #ffd700, #ffb900);
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transform: scale(1.15);
      }

      .rank-badge.rank-2 {
        background: linear-gradient(135deg, #e0e0e0, #bdbdbd);
        color: #424242;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .rank-badge.rank-3 {
        background: linear-gradient(135deg, #cd7f32, #a0522d);
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .date-cell {
        color: #888;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class HighScoreDialog implements OnInit {
  private gameService = inject(GameService)
  private data = inject(MAT_DIALOG_DATA)

  // Data Stores
  easyScores = signal<Score[]>([])
  mediumScores = signal<Score[]>([])
  hardScores = signal<Score[]>([])

  loading = signal(false)

  // UI State
  selectedTabIndex = signal(0)

  displayedColumns = ['rank', 'name', 'time', 'date']

  currentScores = computed(() => {
    switch (this.selectedTabIndex()) {
      case 0:
        return this.easyScores()
      case 1:
        return this.mediumScores()
      case 2:
        return this.hardScores()
      default:
        return []
    }
  })

  ngOnInit() {
    // Determine start tab
    const passedDiff = this.data?.difficulty || 'EASY'
    let startIndex = 0
    if (passedDiff === 'MEDIUM') startIndex = 1
    if (passedDiff === 'HARD') startIndex = 2

    // Set tab (triggers computed)
    this.selectedTabIndex.set(startIndex)

    // Load initial data
    this.loadScores(passedDiff === 'CUSTOM' ? 'EASY' : passedDiff)
  }

  onTabChange(index: number) {
    this.selectedTabIndex.set(index)
    const diff = ['EASY', 'MEDIUM', 'HARD'][index] as Difficulty

    // Only load if empty
    if (this.currentScores().length === 0) {
      this.loadScores(diff)
    }
  }

  loadScores(difficulty: Difficulty) {
    this.loading.set(true)
    this.gameService.getHighScores(difficulty).subscribe({
      next: (data) => {
        // Update the specific signal
        if (difficulty === 'EASY') this.easyScores.set(data)
        else if (difficulty === 'MEDIUM') this.mediumScores.set(data)
        else if (difficulty === 'HARD') this.hardScores.set(data)

        this.loading.set(false)
      },
      error: () => this.loading.set(false),
    })
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }
}
