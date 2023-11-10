import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledRasporedaComponent } from './pregled-rasporeda.component';

describe('PregledRasporedaComponent', () => {
  let component: PregledRasporedaComponent;
  let fixture: ComponentFixture<PregledRasporedaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PregledRasporedaComponent]
    });
    fixture = TestBed.createComponent(PregledRasporedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
