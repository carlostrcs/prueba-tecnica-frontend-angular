import { Injectable } from '@angular/core';
import {User} from '../../models/User';
import {catchError, map, Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProvideUsersService {
  private apiUrl = 'https://randomuser.me/api/?results=100';

  constructor(private http: HttpClient) { }

  fetchUsers(): Observable<User[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.results as User[]),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Error fetching users'));
      })
    );
  }
}
