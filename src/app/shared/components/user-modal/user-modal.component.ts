import {Component, EventEmitter, Input, input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {User} from '../../../core/models/User';

@Component({
  selector: 'app-user-modal',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent implements OnInit {
  @Input() editingUser: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.editingUser) {
      this.userForm.patchValue({
        firstName: this.editingUser.name.first,
        lastName: this.editingUser.name.last,
        email: this.editingUser.email,
        country: this.editingUser.location.country
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData: User = {
        name: {
          title: this.editingUser?.name.title || 'Mr',
          first: formValue.firstName,
          last: formValue.lastName
        },
        email: formValue.email,
        location: {
          country: formValue.country
        },
        login: {
          uuid: this.editingUser?.login.uuid || crypto.randomUUID()
        },
        picture: {
          thumbnail: this.editingUser?.picture.thumbnail || 'https://via.placeholder.com/150',
          medium: this.editingUser?.picture.thumbnail || 'https://via.placeholder.com/150',
          large: this.editingUser?.picture.thumbnail || 'https://via.placeholder.com/150'
        }
      };
      this.save.emit(userData);
      this.userForm.reset();
    }
  }
}
