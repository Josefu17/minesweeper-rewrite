import { TestBed } from '@angular/core/testing'
import { App } from './app'
import { COMMON_TEST_IMPORTS, COMMON_TEST_PROVIDERS } from './testing/test-utils'

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, ...COMMON_TEST_IMPORTS],
      providers: [...COMMON_TEST_PROVIDERS],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })
})
