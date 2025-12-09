import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { WinDialog, WinDialogData } from './win-dialog'

describe('WinDialog', () => {
  let component: WinDialog
  let fixture: ComponentFixture<WinDialog>

  const mockDialogData: WinDialogData = {
    timeSeconds: 120,
    difficulty: 'Easy',
    existingScores: [],
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinDialog],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (_: any) => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockDialogData,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(WinDialog)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
