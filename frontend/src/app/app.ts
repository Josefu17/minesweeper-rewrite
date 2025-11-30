import { Component } from '@angular/core'
import { GameBoard } from './game-board/game-board'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameBoard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
