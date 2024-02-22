import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueInputComponent } from './revenue-input.component';

describe('RevenueInputComponent', () => {
  let component: RevenueInputComponent;
  let fixture: ComponentFixture<RevenueInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevenueInputComponent]
    });
    fixture = TestBed.createComponent(RevenueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
