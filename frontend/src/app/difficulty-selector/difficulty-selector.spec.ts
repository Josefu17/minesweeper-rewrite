import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DifficultySelector } from './difficulty-selector'
import { COMMON_TEST_IMPORTS, COMMON_TEST_PROVIDERS } from '../testing/test-utils'

describe('DifficultySelector', () => {
  let component: DifficultySelector
  let fixture: ComponentFixture<DifficultySelector>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DifficultySelector, ...COMMON_TEST_IMPORTS],
      providers: [...COMMON_TEST_PROVIDERS],
    }).compileComponents()

    fixture = TestBed.createComponent(DifficultySelector)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
