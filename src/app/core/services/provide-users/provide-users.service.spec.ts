import { TestBed } from '@angular/core/testing';

import { ProvideUsersService } from './provide-users.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('ProvideUsersService', () => {
  let service: ProvideUsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ProvideUsersService,provideHttpClient(),provideHttpClientTesting()]
    });

    service = TestBed.inject(ProvideUsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    const mockResponse = {
      results: [
        {
          name: { title: 'Mr', first: 'John', last: 'Doe' },
          email: 'john.doe@example.com',
          location: { country: 'USA' },
          login: { uuid: '123' },
          picture: {
            thumbnail: 'https://example.com/photo.jpg',
            medium: 'https://example.com/photo.jpg',
            large: 'https://example.com/photo.jpg'}
        }
      ]
    };

    service.fetchUsers().subscribe(users => {
      expect(users).toEqual(mockResponse.results);
    });

    const req = httpMock.expectOne('https://randomuser.me/api/?results=100');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle errors', () => {
    service.fetchUsers().subscribe({
      error: error => {
        expect(error.message).toBe('Error fetching users');
      }
    });

    const req = httpMock.expectOne('https://randomuser.me/api/?results=100');
    req.error(new ErrorEvent('Network error'));
  });
});
