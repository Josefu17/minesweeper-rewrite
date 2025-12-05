import {ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal} from '@angular/core'
import {CommonModule} from '@angular/common'
import {Observable} from 'rxjs'

import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatDialog} from '@angular/material/dialog'

import {GameService} from '../services/game.service'
import {GameState, NewGameRequest} from '../models/api.types'
import {Cell} from '../models/game.types'
import {DifficultySelector} from '../difficulty-selector/difficulty-selector'
import {WinDialog} from '../win-dialog/win-dialog'
import {HighScoreDialog} from '../high-score-display/high-score-display';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoard implements OnDestroy {
  private readonly gameService = inject(GameService)
  private readonly dialog = inject(MatDialog)

  // State Signals
  gameState = signal<GameState | undefined>(undefined)
  loading = signal<boolean>(false)
  errorMessage = signal<string | undefined>(undefined)

  // Timer State
  timer = signal<number>(0)
  private timerInterval: any = null

  // Computed: Formats timer (seconds) into mm:ss
  formattedTime = computed(() => {
    const totalSeconds = this.timer()
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const minutesDisplay = minutes.toString().padStart(2, '0');
    const secondsDisplay = seconds.toString().padStart(2, '0');

    return `${minutesDisplay}:${secondsDisplay}`
  })

  ngOnDestroy() {
    this.stopTimer()
  }

  createGame(req: NewGameRequest): void {
    this.loading.set(true)
    this.errorMessage.set(undefined)
    this.resetTimer()

    this.gameService.createGame(req).subscribe({
      next: (state) => {
        this.gameState.set(state)
        this.loading.set(false)
      },
      error: (err) => {
        console.error(err)
        this.errorMessage.set('Failed to create game')
        this.loading.set(false)
      },
    })
  }

  resetGame(): void {
    this.gameState.set(undefined)
    this.resetTimer()
  }

  // --- Timer Logic ---
  private startTimer() {
    if (this.timerInterval) return
    this.timerInterval = setInterval(() => {
      this.timer.update(t => t + 1)
    }, 1000)
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }

  private resetTimer() {
    this.stopTimer()
    this.timer.set(0)
  }

  // --- Gameplay Interactions ---
  onLeftClick(cell: Cell): void {
    const currentState = this.gameState()
    if (!currentState || currentState.status !== 'RUNNING') return
    if (this.isFlagged(cell) || this.isMine(cell)) return

    // Start timer on first interaction if valid
    this.startTimer()

    if (this.isRevealed(cell)) {
      this.handleAction(this.gameService.autoExpand(currentState.id, {x: cell.x, y: cell.y}))
    } else {
      this.handleAction(this.gameService.reveal(currentState.id, {x: cell.x, y: cell.y}))
    }
  }

  onRightClick(event: MouseEvent, cell: Cell): void {
    event.preventDefault()
    const currentState = this.gameState()
    if (!currentState || currentState.status !== 'RUNNING') return
    if (this.isRevealed(cell)) return

    this.startTimer()
    this.handleAction(this.gameService.toggleMark(currentState.id, {x: cell.x, y: cell.y}))
  }

  private handleAction(obs: Observable<GameState>): void {
    obs.subscribe({
      next: (state) => {
        this.gameState.set(state)

        if (state.status === 'WON') {
          this.stopTimer()
          this.handleWin(state)
        } else if (state.status === 'LOST') {
          this.stopTimer()
        }
      },
      error: () => this.errorMessage.set('Action failed'),
    })
  }

  private handleWin(state: GameState) {
    const ref = this.dialog.open(WinDialog, {
      data: {
        timeSeconds: this.timer(),
        difficulty: state.difficulty
      },
      disableClose: true
    })

    ref.afterClosed().subscribe((playerName) => {
      if (playerName) {
        this.gameService.submitScore(state.id, playerName).subscribe({
          next: () => {
            console.log('Score saved!')
            this.openHighScores()
          },
          error: (e) => console.error('Failed to save score', e)
        })
      }
    })
  }

  openHighScores() {
    const currentDiff = this.gameState()?.difficulty || 'EASY'

    this.dialog.open(HighScoreDialog, {
      width: '500px',
      autoFocus: false,
      data: {
        difficulty: currentDiff
      }
    });
  }

  // --- Helpers ---
  getCellClass(cell: Cell): string {
    if (this.isRevealed(cell)) return 'cell-revealed'
    if (this.isFlagged(cell)) return 'cell-flagged'
    if (this.isMine(cell)) return 'cell-mine'
    if (this.isRevealedMine(cell)) return 'cell-mine-revealed'

    return 'cell-hidden'
  }

  showNumber(cell: Cell): boolean {
    return this.isRevealed(cell) && (cell.adjacentMines ?? 0) > 0
  }

  showMineIcon(cell: Cell): boolean {
    return cell.state === 'MINE' || cell.state === 'REVEALED_MINE'
  }

  isRevealed(c: Cell) {
    return c.state === 'REVEALED'
  }

  isFlagged(c: Cell) {
    return c.state === 'FLAGGED'
  }

  isMine(c: Cell) {
    return c.state === 'MINE'
  }

  isRevealedMine(c: Cell) {
    return c.state === 'REVEALED_MINE'
  }
}
