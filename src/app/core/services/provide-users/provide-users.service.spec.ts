import { TestBed } from '@angular/core/testing';

import { ProvideUsersService } from './provide-users.service';

describe('ProvideUsersService', () => {
  let service: ProvideUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvideUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
