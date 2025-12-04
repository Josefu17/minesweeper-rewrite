import {Component, inject} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog'
import {MatButtonModule} from '@angular/material/button'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {toSignal} from '@angular/core/rxjs-interop'
import {map, startWith} from 'rxjs/operators'
import {NewGameRequest} from '../models/api.types'

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
  ],
  templateUrl: './custom-game-dialog.html',
  styleUrls: ['./custom-game-dialog.scss'],
})
export class CustomGameDialog {
  private fb = inject(FormBuilder)
  private dialogRef = inject(MatDialogRef<CustomGameDialog>)

  form = this.fb.nonNullable.group({
    rows: [20, [Validators.required, Validators.min(5), Validators.max(30)]],
    columns: [20, [Validators.required, Validators.min(5), Validators.max(30)]],
    mines: [50, [Validators.required, Validators.min(1)]],
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
    {initialValue: 391}
  )

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
      }
    }

    this.dialogRef.close(req)
  }
}
