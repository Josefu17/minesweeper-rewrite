import { Component } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Restart Game?</h2>
    <mat-dialog-content>
      <p>Current progress will be lost. Are you sure?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Confirm</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmationDialog {}
