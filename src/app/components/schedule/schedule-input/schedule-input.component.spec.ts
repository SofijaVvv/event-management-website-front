import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInputComponent } from './schedule-input.component';

describe('ScheduleInputComponent', () => {
  let component: ScheduleInputComponent;
  let fixture: ComponentFixture<ScheduleInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleInputComponent]
    });
    fixture = TestBed.createComponent(ScheduleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
