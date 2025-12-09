import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Header } from './header'
import { COMMON_TEST_IMPORTS, COMMON_TEST_PROVIDERS } from '../testing/test-utils'

describe('Header', () => {
  let component: Header
  let fixture: ComponentFixture<Header>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header, ...COMMON_TEST_IMPORTS],
      providers: [...COMMON_TEST_PROVIDERS],
    }).compileComponents()

    fixture = TestBed.createComponent(Header)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
