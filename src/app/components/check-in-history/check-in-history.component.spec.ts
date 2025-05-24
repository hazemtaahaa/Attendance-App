import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInHistoryComponent } from './check-in-history.component';

describe('CheckInHistoryComponent', () => {
  let component: CheckInHistoryComponent;
  let fixture: ComponentFixture<CheckInHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckInHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
