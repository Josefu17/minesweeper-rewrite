import { Component } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'CONFIRMATION.TITLE' | translate }}</h2>
    <mat-dialog-content>
      <p>{{ 'CONFIRMATION.MESSAGE' | translate }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">
        {{ 'CONFIRMATION.CONFIRM' | translate }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmationDialog {}
