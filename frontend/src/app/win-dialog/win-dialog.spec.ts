import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { WinDialog, WinDialogData } from './win-dialog'
import { COMMON_TEST_IMPORTS, COMMON_TEST_PROVIDERS } from '../testing/test-utils'

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
      imports: [WinDialog, ...COMMON_TEST_IMPORTS],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (_: unknown) => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockDialogData,
        },
        ...COMMON_TEST_PROVIDERS,
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
