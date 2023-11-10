import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnosDogadjajaComponent } from './unos-dogadjaja.component';

describe('UnosDogadjajaComponent', () => {
  let component: UnosDogadjajaComponent;
  let fixture: ComponentFixture<UnosDogadjajaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnosDogadjajaComponent]
    });
    fixture = TestBed.createComponent(UnosDogadjajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
