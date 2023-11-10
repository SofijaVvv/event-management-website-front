import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledZadatakaComponent } from './pregled-zadataka.component';

describe('PregledZadatakaComponent', () => {
  let component: PregledZadatakaComponent;
  let fixture: ComponentFixture<PregledZadatakaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PregledZadatakaComponent]
    });
    fixture = TestBed.createComponent(PregledZadatakaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
