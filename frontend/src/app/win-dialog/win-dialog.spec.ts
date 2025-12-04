import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinDialog } from './win-dialog';

describe('WinDialog', () => {
  let component: WinDialog;
  let fixture: ComponentFixture<WinDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
