import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnosZadatakaComponent } from './unos-zadataka.component';

describe('UnosZadatakaComponent', () => {
  let component: UnosZadatakaComponent;
  let fixture: ComponentFixture<UnosZadatakaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnosZadatakaComponent]
    });
    fixture = TestBed.createComponent(UnosZadatakaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
