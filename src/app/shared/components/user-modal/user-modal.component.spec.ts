import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalComponent } from './user-modal.component';
import objectContaining = jasmine.objectContaining;
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('UserModalComponent', () => {
  let component: UserModalComponent;
  let fixture: ComponentFixture<UserModalComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserModalComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.userForm.get('firstName')?.value).toBe('');
    expect(component.userForm.get('lastName')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('country')?.value).toBe('');
  });

  it('should populate form when editingUser is provided', () => {
    component.editingUser = mockUser;
    component.ngOnInit();

    expect(component.userForm.get('firstName')?.value).toBe(mockUser.name.first);
    expect(component.userForm.get('lastName')?.value).toBe(mockUser.name.last);
    expect(component.userForm.get('email')?.value).toBe(mockUser.email);
    expect(component.userForm.get('country')?.value).toBe(mockUser.location.country);
  });

  it('should emit close event when onClose is called', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit save event with user data when form is valid', () => {
    spyOn(component.save, 'emit');

    component.userForm.patchValue({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      country: 'Canada'
    });

    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith(objectContaining({
      name: {
        title: 'Mr',
        first: 'Jane',
        last: 'Doe'
      },
      email: 'jane.doe@example.com',
      location: {
        country: 'Canada'
      }
    }));
  });

  it('should not emit save event when form is invalid', () => {
    spyOn(component.save, 'emit');

    component.userForm.patchValue({
      firstName: '',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      country: 'Canada'
    });

    component.onSubmit();

    expect(component.save.emit).not.toHaveBeenCalled();
  });

  it('should validate email format', () => {
    const emailControl = component.userForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors).toBeNull();
  });

});
