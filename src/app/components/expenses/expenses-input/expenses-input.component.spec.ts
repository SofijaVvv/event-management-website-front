import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesInputComponent } from './expenses-input.component';

describe('ExpensesInputComponent', () => {
  let component: ExpensesInputComponent;
  let fixture: ComponentFixture<ExpensesInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpensesInputComponent]
    });
    fixture = TestBed.createComponent(ExpensesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
