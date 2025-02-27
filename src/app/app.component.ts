import {Component, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UserTableComponent} from './shared/components/user-table/user-table.component';
import {User} from './core/models/User';
import {CommonModule} from '@angular/common';
import {UserModalComponent} from './shared/components/user-modal/user-modal.component';

@Component({
  selector: 'app-root',
  imports: [UserTableComponent, CommonModule,UserModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild(UserTableComponent) userTable!: UserTableComponent;
  isModalVisible = false;
  selectedUser: User | null = null;

  showModal(user?: User): void {
    this.selectedUser = user || null;
    this.isModalVisible = true;
  }

  hideModal(): void {
    this.isModalVisible = false;
    this.selectedUser = null;
  }

  onSaveUser(userData: User): void {
    if (this.selectedUser) {
      // Editar usuario existente
      this.userTable.users = this.userTable.users.map(user =>
        user.login.uuid === userData.login.uuid ? userData : user
      );
    } else {
      // Añadir nuevo usuario
      this.userTable.users = [...this.userTable.users, userData];
    }
    this.hideModal();
  }

  restoreUsers(): void {
    this.userTable.users = [...this.userTable.originalUsers];
  }
}
