import { Component, EventEmitter, inject, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { MatRippleModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog'
import { NewGameRequest } from '../../models/api.types'
import { CustomGameDialog } from '../custom-game-dialog/custom-game-dialog'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-difficulty-selector',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatRippleModule, MatIconModule, TranslateModule],
  templateUrl: './difficulty-selector.html',
  styleUrls: ['./difficulty-selector.scss'],
})
export class DifficultySelector {
  private dialog = inject(MatDialog)

  @Output() gameRequest = new EventEmitter<NewGameRequest>()

  selectStandard(diff: 'EASY' | 'MEDIUM' | 'HARD') {
    this.gameRequest.emit({
      difficulty: diff,
    })
  }

  openCustom() {
    const ref = this.dialog.open(CustomGameDialog, {
      height: '550px',
      width: '550px',
      autoFocus: false,
    })

    ref.afterClosed().subscribe((result: NewGameRequest | undefined) => {
      if (result) {
        this.gameRequest.emit(result)
      }
    })
  }
}
