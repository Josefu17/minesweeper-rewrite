import { GameBoard } from './game-board'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { COMMON_TEST_IMPORTS, COMMON_TEST_PROVIDERS } from '../testing/test-utils'
import { of } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { GameService } from '../../services/game.service'

describe('GameBoard', () => {
  let component: GameBoard
  let fixture: ComponentFixture<GameBoard>

  const mockGameService = {
    createGame: () => of({}),
    reveal: () => of({}),
  }

  const mockMatDialog = {
    open: () => ({
      afterClosed: () => of(true),
    }),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoard, ...COMMON_TEST_IMPORTS],
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: MatDialog, useValue: mockMatDialog },
        ...COMMON_TEST_PROVIDERS,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(GameBoard)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
