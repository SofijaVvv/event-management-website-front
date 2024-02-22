import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOverviewComponent } from './task-overview.component';

describe('TaskOverviewComponent', () => {
  let component: TaskOverviewComponent;
  let fixture: ComponentFixture<TaskOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskOverviewComponent]
    });
    fixture = TestBed.createComponent(TaskOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
