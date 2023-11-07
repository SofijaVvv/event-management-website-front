import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomaComponent } from './doma.component';

describe('DomaComponent', () => {
  let component: DomaComponent;
  let fixture: ComponentFixture<DomaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomaComponent]
    });
    fixture = TestBed.createComponent(DomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
