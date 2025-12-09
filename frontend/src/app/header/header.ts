import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { ThemeService } from '../../services/theme.service'

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
        <button mat-icon-button (click)="themeService.toggle()" class="theme-btn">
          <mat-icon>{{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

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

        /* Adaptive Background & Border */
        background: var(--mat-sys-surface-container);
        border-bottom: 1px solid var(--mat-sys-outline-variant);

        position: sticky;
        top: 0;
        z-index: 100;

        transition:
          background-color 0.3s ease,
          border-color 0.3s ease;
      }

      .branding {
        display: flex;
        align-items: center;
        gap: 16px;

        /* Adaptive Text Color */
        color: var(--mat-sys-on-surface);
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

          color: var(--mat-sys-primary);

          transition:
            transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55),
            filter 0.3s ease;
        }

        /* The Hover Effect */
        &:hover .logo {
          transform: scale(1.8) rotate(15deg);
          filter: drop-shadow(0 0 8px var(--mat-sys-primary));
          animation: rainbow-shift 2s linear infinite;
        }
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;

        mat-icon {
          color: var(--mat-sys-on-surface-variant);
        }

        /* Hover state for buttons */
        button:hover mat-icon {
          color: var(--mat-sys-primary);
        }
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
export class Header {
  private translate = inject(TranslateService)
  public themeService = inject(ThemeService)

  switchLang(lang: string) {
    this.translate.use(lang)
  }
}
