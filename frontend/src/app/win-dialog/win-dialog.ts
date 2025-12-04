import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'

export interface WinDialogData {
  timeSeconds: number
  difficulty: string
}

@Component({
  selector: 'app-win-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="win-title">
      <mat-icon class="trophy-icon" svgIcon="trophy"></mat-icon>
      Victory!
    </h2>

    <mat-dialog-content>
      <div class="summary">
        <p>You cleared the field in <strong>{{ data.timeSeconds }} seconds</strong>!</p>
        <p class="subtitle">Enter your name to immortalize your score.</p>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Player Name</mat-label>
        <input matInput [formControl]="nameControl" placeholder="Anonymous" maxlength="20">
        @if (nameControl.hasError('required')) {
          <mat-error>Name is required</mat-error>
        }
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Skip</button>
      <button mat-flat-button color="primary"
              [disabled]="nameControl.invalid"
              (click)="submit()">
        Submit Score
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
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
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 1.1rem;
    }
    .subtitle {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.25rem;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class WinDialog {
  private dialogRef = inject(MatDialogRef<WinDialog>)
  data = inject<WinDialogData>(MAT_DIALOG_DATA)

  nameControl = new FormControl('', [Validators.required, Validators.maxLength(20)])

  submit() {
    if (this.nameControl.valid) {
      this.dialogRef.close(this.nameControl.value)
    }
  }
}
