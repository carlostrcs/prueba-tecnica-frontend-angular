import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {By} from '@angular/platform-browser';
import {UserTableComponent} from './shared/components/user-table/user-table.component';
import {User} from './core/models/User';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {UserModalComponent} from './shared/components/user-modal/user-modal.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {ProvideUsersService} from './core/services/provide-users/provide-users.service';
import {of} from 'rxjs';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const mockUser = {
    name: {
      title: 'Mr',
      first: 'John',
      last: 'Doe'
    },
    email: 'john.doe@example.com',
    location: {
      country: 'USA'
    },
    login: {
      uuid: '123'
    },
    picture: {
      thumbnail: 'https://example.com/photo.jpg',
      medium: 'https://example.com/photo.jpg',
      large: 'https://example.com/photo.jpg'
    }
  };

  const mockProvideUsersService = {
    fetchUsers: () => of([mockUser])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, UserTableComponent, UserModalComponent],
      providers: [provideHttpClient(),provideHttpClientTesting(), { provide: ProvideUsersService, useValue: mockProvideUsersService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show modal when showModal is called', () => {
    component.showModal();
    expect(component.isModalVisible).toBeTrue();
  });

  it('should hide modal when hideModal is called', () => {
    component.showModal();
    component.hideModal();
    expect(component.isModalVisible).toBeFalse();
    expect(component.selectedUser).toBeNull();
  });

  it('should set selectedUser when showModal is called with user', () => {
    component.showModal(mockUser);
    expect(component.selectedUser).toEqual(mockUser);
    expect(component.isModalVisible).toBeTrue();
  });

  it('should add new user when onSaveUser is called without selectedUser', () => {
    const userTableComponent = fixture.debugElement.query(By.directive(UserTableComponent));
    const newUser = { ...mockUser, login: { uuid: '456' } };

    component.onSaveUser(newUser);

    expect(userTableComponent.componentInstance.users).toContain(newUser);
  });

  it('should update existing user when onSaveUser is called with selectedUser', () => {
    const userTableComponent = component.userTable //fixture.debugElement.query(By.directive(UserTableComponent));
    component.selectedUser = mockUser;
    const updatedUser = {
      ...mockUser,
      name: { ...mockUser.name, first: 'Jane' }
    };

    component.onSaveUser(updatedUser);
    const updatedUserInList = userTableComponent.users
      .find((u:User) => u.login.uuid === mockUser.login.uuid);
    expect(updatedUserInList?.name.first).toBe('Jane');
  });

  it('should have add and restore buttons', () => {
    const addButton = fixture.debugElement.query(By.css('[data-testid="add-button"]'));
    const restoreButton = fixture.debugElement.query(By.css('[data-testid="restore-button"]'));

    expect(addButton).toBeTruthy();
    expect(restoreButton).toBeTruthy();
    expect(addButton.nativeElement.textContent.trim()).toBe('Añadir');
    expect(restoreButton.nativeElement.textContent.trim()).toBe('Restaurar');
  });
});
