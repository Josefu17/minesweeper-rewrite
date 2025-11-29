import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DifficultySelector} from './difficulty-selector';

describe('DifficultySelector', () => {
  let component: DifficultySelector;
  let fixture: ComponentFixture<DifficultySelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DifficultySelector]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DifficultySelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
