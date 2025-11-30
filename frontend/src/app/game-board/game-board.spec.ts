import { GameBoard } from './game-board'
import { ComponentFixture, TestBed } from '@angular/core/testing'

describe('GameBoard', () => {
  let component: GameBoard
  let fixture: ComponentFixture<GameBoard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoard],
    }).compileComponents()

    fixture = TestBed.createComponent(GameBoard)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
