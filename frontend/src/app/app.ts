import { Component } from '@angular/core'
import { GameBoard } from './game-board/game-board'
import { Header } from './header/header'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameBoard, Header],
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
        display: block;
        height: 100vh;
        overflow: hidden;
      }

      .app-layout {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: transparent;
      }

      .content {
        flex: 1;
        overflow-y: auto;
        display: flex;
        justify-content: center;
        padding: 24px;
      }

      app-game-board {
        width: 100%;
        max-width: 1200px;
      }
    `,
  ],
})
export class App {}
