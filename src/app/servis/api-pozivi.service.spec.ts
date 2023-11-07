import { TestBed } from '@angular/core/testing';

import { ApiPoziviService } from './api-pozivi.service';

describe('ApiPoziviService', () => {
  let service: ApiPoziviService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPoziviService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
