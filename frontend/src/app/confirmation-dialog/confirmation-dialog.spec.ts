import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConfirmationDialog } from './confirmation-dialog'
import { COMMON_TEST_IMPORTS } from '../testing/test-utils'

describe('ConfirmationDialog', () => {
  let component: ConfirmationDialog
  let fixture: ComponentFixture<ConfirmationDialog>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialog, ...COMMON_TEST_IMPORTS],
    }).compileComponents()

    fixture = TestBed.createComponent(ConfirmationDialog)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
