import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesOverviewComponent } from './expenses-overview.component';

describe('ExpensesOverviewComponent', () => {
  let component: ExpensesOverviewComponent;
  let fixture: ComponentFixture<ExpensesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpensesOverviewComponent]
    });
    fixture = TestBed.createComponent(ExpensesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
