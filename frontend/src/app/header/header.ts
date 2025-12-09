import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { TranslateModule, TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, TranslateModule],
  template: `
    <header class="app-header">
      <div class="left-section"></div>

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
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;

        height: 64px;
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
        gap: 16px;
        color: #333;
        user-select: none;

        h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .logo {
          width: 36px;
          height: 36px;
          transform: scale(1.5);
          color: #9c27b0;
          transition:
            transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55),
            filter 0.3s ease;
        }

        /* The Hover Effect */
        &:hover .logo {
          transform: scale(1.8) rotate(15deg);
          filter: drop-shadow(0 0 8px rgba(156, 39, 176, 0.6));
          animation: rainbow-shift 2s linear infinite;
        }
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      @keyframes rainbow-shift {
        0% {
          filter: hue-rotate(0deg);
        }
        100% {
          filter: hue-rotate(360deg);
        }
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
