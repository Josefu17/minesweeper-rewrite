import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { TranslateModule, TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
  ],
  template: `
    <header class="app-header">
      <div class="branding">
        <mat-icon svgIcon="controller" class="logo"></mat-icon>
        <h1>{{ 'APP.TITLE' | translate }}</h1>
      </div>

      <div class="actions">
        <button mat-icon-button [matMenuTriggerFor]="langMenu" aria-label="Switch Language">
          <mat-icon>language</mat-icon>
        </button>

        <mat-menu #langMenu="matMenu">
          <button mat-menu-item (click)="switchLang('en')">
            <span>🇺🇸 English</span>
          </button>
          <button mat-menu-item (click)="switchLang('de')">
            <span>🇩🇪 Deutsch</span>
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [
    `
      .app-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        height: 60px;
        padding: 0 16px;

        background: white;
        border-bottom: 1px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

        position: sticky;
        top: 0;
        z-index: 100;
      }

      .branding {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #3f51b5; /* Primary color */

        .logo {
          width: 32px;
          height: 32px;
        }

        h1 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 500;
          color: #333;
        }
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `,
  ],
})
export class HeaderComponent {
  private translate = inject(TranslateService)

  switchLang(lang: string) {
    this.translate.use(lang)
  }
}
