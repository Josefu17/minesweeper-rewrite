import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatDialogRef } from '@angular/material/dialog' // Import this
import { CustomGameDialog } from './custom-game-dialog'

describe('CustomGameDialog', () => {
  let component: CustomGameDialog
  let fixture: ComponentFixture<CustomGameDialog>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomGameDialog],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => {} },
        },
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
