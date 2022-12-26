import { TestBed } from '@angular/core/testing';

import { DowloadFileService } from './dowload-file.service';

describe('DowloadFileService', () => {
  let service: DowloadFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DowloadFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
