import {Component, Injector, OnInit} from '@angular/core';
import {User} from '../../../core/models/User';
import {ProvideUsersService} from '../../../core/services/provide-users/provide-users.service';
import {CommonModule} from '@angular/common';
import {AppComponent} from '../../../app.component';

@Component({
  selector: 'app-user-table',
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit {
  users: User[] = [];
  originalUsers: User[] = [];
  errorMessage: string | null = null;

  constructor(private usersService: ProvideUsersService,  private injector: Injector) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.fetchUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.originalUsers = data;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error al cargar usuarios', error);
        this.errorMessage = 'No se pudieron cargar los usuarios. Por favor, inténtelo de nuevo más tarde.';
      }
    });
  }

  editUser(user: User): void {
    // Emitir evento al componente padre
    const appComponent = this.injector.get(AppComponent);
    appComponent.showModal(user);
  }

  deleteUser(userId: string): void {
    // Lógica para eliminar un usuario
    this.users = this.users.filter(user => user.login.uuid !== userId);
  }
}
