import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledKomitenataComponent } from './pregled-komitenata.component';

describe('PregledKomitenataComponent', () => {
  let component: PregledKomitenataComponent;
  let fixture: ComponentFixture<PregledKomitenataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PregledKomitenataComponent]
    });
    fixture = TestBed.createComponent(PregledKomitenataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
