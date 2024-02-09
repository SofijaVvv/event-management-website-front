import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPrivilegesInputComponent } from './roles-privileges-input.component';

describe('RolesPrivilegesInputComponent', () => {
  let component: RolesPrivilegesInputComponent;
  let fixture: ComponentFixture<RolesPrivilegesInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolesPrivilegesInputComponent]
    });
    fixture = TestBed.createComponent(RolesPrivilegesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
