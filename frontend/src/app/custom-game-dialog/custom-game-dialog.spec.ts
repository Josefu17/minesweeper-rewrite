import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatDialogRef } from '@angular/material/dialog' // Import this
import { CustomGameDialog } from './custom-game-dialog'
import { COMMON_TEST_IMPORTS, COMMON_TEST_PROVIDERS } from '../testing/test-utils'

describe('CustomGameDialog', () => {
  let component: CustomGameDialog
  let fixture: ComponentFixture<CustomGameDialog>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomGameDialog, ...COMMON_TEST_IMPORTS],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => {} },
        },
        ...COMMON_TEST_PROVIDERS,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomGameDialog)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
