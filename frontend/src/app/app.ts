import {Component, inject, OnInit, signal} from '@angular/core';
import {GameBoard} from './game-board/game-board';
import {IconRegistryService} from './services/icon-registry.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    GameBoard
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly iconRegistry = inject(IconRegistryService)

  protected readonly title = signal('Minesweeper');

  ngOnInit() {
    this.iconRegistry.registerIcons()
  }
}
