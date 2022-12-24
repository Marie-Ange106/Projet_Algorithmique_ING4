import { TestBed } from '@angular/core/testing';

import { ForfaitsService } from './forfaits.service';

describe('ForfaitsService', () => {
  let service: ForfaitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForfaitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
