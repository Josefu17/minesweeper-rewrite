import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { of } from 'rxjs'
import { GameService } from '../services/game.service'
import { HighScoreDialog } from './high-score-dialog'

describe('HighScoreDialog', () => {
  let component: HighScoreDialog
  let fixture: ComponentFixture<HighScoreDialog>

  const mockGameService = {
    getHighScores: () => of([]),
  }

  // Create mock data for the dialog
  const mockDialogData = {
    difficulty: 'EASY',
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighScoreDialog],
      // Providers for Data and Service
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockDialogData,
        },
        {
          provide: GameService,
          useValue: mockGameService,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(HighScoreDialog)
    component = fixture.componentInstance

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
