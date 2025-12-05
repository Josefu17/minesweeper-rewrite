import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { toSignal } from '@angular/core/rxjs-interop'
import { map, startWith } from 'rxjs/operators'
import { NewGameRequest } from '../models/api.types'
import { MatDivider } from '@angular/material/list'

@Component({
  selector: 'app-custom-game-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatDivider,
  ],
  templateUrl: './custom-game-dialog.html',
  styleUrls: ['./custom-game-dialog.scss'],
})
export class CustomGameDialog {
  private fb = inject(FormBuilder)
  private dialogRef = inject(MatDialogRef<CustomGameDialog>)

  // Limits constants for clamping
  readonly MIN_DIM = 5
  readonly MAX_DIM = 30
  readonly MIN_MINES = 1

  form = this.fb.nonNullable.group({
    rows: [20, [Validators.required, Validators.min(this.MIN_DIM), Validators.max(this.MAX_DIM)]],
    columns: [
      20,
      [Validators.required, Validators.min(this.MIN_DIM), Validators.max(this.MAX_DIM)],
    ],
    mines: [50, [Validators.required, Validators.min(this.MIN_MINES)]],
    enableLives: [false],
  })

  // Calculate Max Mines: (Rows * Cols) - 9
  maxMines = toSignal(
    this.form.valueChanges.pipe(
      startWith(this.form.value),
      map((val) => {
        const r = val.rows ?? 0
        const c = val.columns ?? 0
        return Math.max(0, r * c - 9)
      })
    ),
    { initialValue: 391 }
  )

  /**
   * Helper to increment/decrement values with clamping.
   * prevents the UI from entering an invalid state via buttons.
   */
  updateValue(controlName: 'rows' | 'columns' | 'mines', delta: number) {
    const control = this.form.controls[controlName]
    const currentVal = control.value
    let newVal = currentVal + delta

    // Clamp logic
    if (controlName === 'rows' || controlName === 'columns') {
      newVal = Math.min(Math.max(newVal, this.MIN_DIM), this.MAX_DIM)
    } else if (controlName === 'mines') {
      newVal = Math.min(Math.max(newVal, this.MIN_MINES), this.maxMines())
    }

    if (newVal !== currentVal) {
      control.setValue(newVal)
      control.markAsDirty()
    }
  }

  submit() {
    if (this.form.invalid) return
    const val = this.form.getRawValue()

    const req: NewGameRequest = {
      difficulty: 'CUSTOM',
      customConfig: {
        rows: val.rows,
        columns: val.columns,
        customMines: val.mines,
        customLives: val.enableLives ? 1 : 0,
      },
    }

    this.dialogRef.close(req)
  }
}
