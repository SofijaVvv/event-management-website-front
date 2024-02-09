import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPrivilegesOverviewComponent } from './roles-privileges-overview.component';

describe('RolesPrivilegesOverviewComponent', () => {
  let component: RolesPrivilegesOverviewComponent;
  let fixture: ComponentFixture<RolesPrivilegesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolesPrivilegesOverviewComponent]
    });
    fixture = TestBed.createComponent(RolesPrivilegesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
