import { Component, computed, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { Score } from '../models/api.types'

export interface WinDialogData {
  timeSeconds: number
  difficulty: string
  existingScores: Score[]
}

@Component({
  selector: 'app-win-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="win-title">
      <mat-icon class="trophy-icon" svgIcon="trophy"></mat-icon>
      Victory!
    </h2>

    <mat-dialog-content>
      <div class="summary">
        <p>
          You cleared the field in <strong>{{ formatTime(data.timeSeconds) }}</strong
          >!
        </p>
      </div>

      <div class="leaderboard-context">
        @for (item of rankedList(); track $index) {
          <div class="rank-row" [class.current-run]="item.isCurrent">
            <div class="rank-num">#{{ $index + 1 }}</div>

            <!-- Existing Scores -->
            @if (!item.isCurrent) {
              <div class="player-info">
                <span class="name">{{ item.score.playerName }}</span>
                <span class="time">{{ formatTime(item.score.timeSeconds || 0) }}</span>
              </div>
            } @else {
              <!-- Own Score -->
              <div class="current-input-container">
                <mat-form-field appearance="outline" class="name-input">
                  <mat-label>Enter Your Name</mat-label>
                  <input
                    matInput
                    [formControl]="nameControl"
                    placeholder="Anonymous"
                    maxlength="32"
                    (keydown.enter)="submit()"
                  />
                </mat-form-field>
                <div class="current-time">{{ formatTime(data.timeSeconds) }}</div>
              </div>
            }
          </div>
        }
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Skip</button>
      <button mat-flat-button color="primary" [disabled]="nameControl.invalid" (click)="submit()">
        Submit Score
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .win-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #ffb300;
      }

      .trophy-icon {
        transform: scale(1.5);
      }

      .summary {
        text-align: center;
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }

      .leaderboard-context {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 1rem;
        max-height: 300px;
        overflow-y: auto;
      }

      .rank-row {
        display: flex;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #e0e0e0;

        &:last-child {
          border-bottom: none;
        }

        &.current-run {
          background: #fff8e1;
          margin: 4px -8px;
          padding: 8px 8px;
          border-radius: 4px;
          border: 1px solid #ffb300;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      }

      .rank-num {
        width: 40px;
        font-weight: bold;
        color: #666;
      }

      .player-info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        font-size: 0.95rem;
      }

      .current-input-container {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .name-input {
        flex: 1;
        margin-bottom: -1.25em; /* Hack to fix MatFormField spacing in compact lists */
      }

      .current-time {
        font-weight: bold;
        color: #2e7d32;
      }
    `,
  ],
})
export class WinDialog {
  private dialogRef = inject(MatDialogRef<WinDialog>)
  data = inject<WinDialogData>(MAT_DIALOG_DATA)

  nameControl = new FormControl('', [Validators.required, Validators.maxLength(20)])

  rankedList = computed(() => {
    const current = {
      isCurrent: true,
      score: { timeSeconds: this.data.timeSeconds, playerName: '' },
    }

    const existing = (this.data.existingScores || []).map((s) => ({
      isCurrent: false,
      score: s,
    }))

    // Combine and Sort
    const combined = [...existing, current].sort((a, b) => {
      // Sort by time (asc), then prioritize existing scores if tie
      if (a.score.timeSeconds === b.score.timeSeconds) {
        return a.isCurrent ? 1 : -1
      }
      return (a.score?.timeSeconds || 0) - (b.score?.timeSeconds || 0)
    })

    return combined.slice(0, 10)
  })

  submit() {
    if (this.nameControl.valid) {
      this.dialogRef.close(this.nameControl.value)
    }
  }

  formatTime(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }
}
