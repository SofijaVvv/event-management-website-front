import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedOverviewComponent } from './shared-overview.component';

describe('SharedOverviewComponent', () => {
  let component: SharedOverviewComponent;
  let fixture: ComponentFixture<SharedOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedOverviewComponent]
    });
    fixture = TestBed.createComponent(SharedOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
