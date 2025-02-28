import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableComponent } from './user-table.component';
import {ProvideUsersService} from '../../../core/services/provide-users/provide-users.service';
import {Injector} from '@angular/core';
import {of, throwError} from 'rxjs';
import {AppComponent} from '../../../app.component';
import {By} from '@angular/platform-browser';

describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  let provideUsersServiceSpy: jasmine.SpyObj<ProvideUsersService>;
  let injectorSpy: jasmine.SpyObj<Injector>;

  const mockUsers = [
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
  ];

  beforeEach(async () => {
    const mockAppComponent = { showModal: jasmine.createSpy('showModal') };
    const spy = jasmine.createSpyObj('ProvideUsersService', ['fetchUsers']);
    spy.fetchUsers.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [UserTableComponent],
      providers: [
        { provide: ProvideUsersService, useValue: spy },
        {
          provide: Injector,
          useValue: {
            get: (token: any) => {
              if (token === AppComponent) {
                return mockAppComponent;
              }
              return null;
            }
          }
        },
        { provide: AppComponent, useValue: mockAppComponent }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;
    provideUsersServiceSpy = TestBed.inject(ProvideUsersService) as jasmine.SpyObj<ProvideUsersService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    provideUsersServiceSpy.fetchUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(component.users).toEqual(mockUsers);
    expect(component.originalUsers).toEqual(mockUsers);
    expect(component.errorMessage).toBeNull();
  });

  it('should handle error when loading users fails', () => {
    provideUsersServiceSpy.fetchUsers.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.ngOnInit();

    expect(component.errorMessage).toBe(
      'No se pudieron cargar los usuarios. Por favor, inténtelo de nuevo más tarde.'
    );
  });

  it('should delete user', () => {
    component.users = [...mockUsers];

    component.deleteUser('123');

    expect(component.users.length).toBe(0);
  });

  it('should call showModal on AppComponent when editing user', () => {
    const appComponent = TestBed.inject(AppComponent);
    component.editUser(mockUsers[0]);
    component.editUser(mockUsers[0]);
    expect(appComponent.showModal).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should render user table with correct columns', () => {
    component.users = mockUsers;
    fixture.detectChanges();

    const headers = fixture.debugElement.queryAll(By.css('th'));
    expect(headers.length).toBe(5);
    expect(headers[0].nativeElement.textContent).toContain('Imagen');
    expect(headers[1].nativeElement.textContent).toContain('Nombre Completo');
    expect(headers[2].nativeElement.textContent).toContain('Email');
    expect(headers[3].nativeElement.textContent).toContain('País');
    expect(headers[4].nativeElement.textContent).toContain('Acciones');
  });
});
