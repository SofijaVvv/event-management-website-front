import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnosKomitenataComponent } from './unos-komitenata.component';

describe('UnosKomitenataComponent', () => {
  let component: UnosKomitenataComponent;
  let fixture: ComponentFixture<UnosKomitenataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnosKomitenataComponent]
    });
    fixture = TestBed.createComponent(UnosKomitenataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
