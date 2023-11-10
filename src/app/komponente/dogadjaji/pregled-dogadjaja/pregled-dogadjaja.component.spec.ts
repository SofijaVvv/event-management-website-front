import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledDogadjajaComponent } from './pregled-dogadjaja.component';

describe('PregledDogadjajaComponent', () => {
  let component: PregledDogadjajaComponent;
  let fixture: ComponentFixture<PregledDogadjajaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PregledDogadjajaComponent]
    });
    fixture = TestBed.createComponent(PregledDogadjajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
