import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleOverviewComponent } from './schedule-overview.component';

describe('ScheduleOverviewComponent', () => {
  let component: ScheduleOverviewComponent;
  let fixture: ComponentFixture<ScheduleOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleOverviewComponent]
    });
    fixture = TestBed.createComponent(ScheduleOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
