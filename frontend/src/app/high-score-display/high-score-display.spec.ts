import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HighScoreDisplay } from './high-score-display'

describe('HighScoreDisplay', () => {
  let component: HighScoreDisplay
  let fixture: ComponentFixture<HighScoreDisplay>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighScoreDisplay],
    }).compileComponents()

    fixture = TestBed.createComponent(HighScoreDisplay)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
