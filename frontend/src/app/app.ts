import { Component } from '@angular/core'
import { GameBoard } from './game-board/game-board'
import { HeaderComponent } from './header/header'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameBoard, HeaderComponent],
  template: `
    <div class="app-layout">
      <app-header></app-header>

      <main class="content">
        <app-game-board></app-game-board>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        /* Ensure the host takes full height */
        display: block;
        height: 100vh;
        overflow: hidden;
      }

      .app-layout {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #fafafa; /* Light grey bg for contrast */
      }

      .content {
        flex: 1;
        overflow-y: auto; /* The board scrolls, header stays put */
        display: flex;
        justify-content: center;
        padding: 24px;
      }
    `,
  ],
})
export class App {}
