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
        <span class="signature">by Joseph</span>
      </div>

      <div class="actions">
        <button mat-icon-button (click)="themeService.toggle()" class="theme-btn">
          <mat-icon svgIcon="{{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}"></mat-icon>
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
        background: var(--mat-sys-surface-container-high);
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

        .signature {
          font-size: 0.85rem;
          font-weight: 400;
          opacity: 0.6;
          align-self: flex-end;
          margin-bottom: 6px;
          font-style: italic;
        }

        .logo {
          width: 36px;
          height: 36px;
          transform: scale(1.5);

          color: var(--mat-sys-primary);

          transition: transform 0.4s ease;
        }

        /* The Hover Effect */
        &:hover .logo {
          transform: scale(1.8) rotate(15deg);
          animation: logo-spin-rainbow 4s linear infinite;
        }
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;

        mat-icon {
          color: var(--mat-sys-on-surface);
          transition: color 0.2s ease;
        }

        button:hover mat-icon {
          color: var(--mat-sys-primary);
        }
      }

      :host-context(html.dark-theme) .theme-btn:hover mat-icon {
        color: #ffd740 !important; /* Material Amber Accent */
        filter: drop-shadow(0 0 8px rgba(255, 215, 64, 0.4)); /* Sun Glow */
      }

      @keyframes logo-spin-rainbow {
        0% {
          transform: scale(1.8) rotate(0deg);
          filter: drop-shadow(0 0 8px var(--mat-sys-primary)) hue-rotate(0deg);
        }
        100% {
          transform: scale(1.8) rotate(360deg);
          filter: drop-shadow(0 0 8px var(--mat-sys-primary)) hue-rotate(360deg);
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
