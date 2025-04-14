import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import {
  AuthInfo,
  LoginResponse,
  LoginUser,
  User,
} from '../interfaces/user.interface';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const baseUrl = `${environment.baseUrl}/auth`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);

  authInfo = signal<AuthInfo>({
    authToken: localStorage.getItem('token'),
    authenticatedUser: localStorage.getItem('authenticatedUser'),
    role: localStorage.getItem('role'),
  });

  saveAuthInfo = effect(() => {
    // const { authToken, authenticatedUser, role } = this.authInfo();
    const authToken = this.authInfo().authToken;
    const authenticatedUser = this.authInfo().authenticatedUser;
    const role = this.authInfo().role;
    authToken
      ? localStorage.setItem('token', authToken)
      : localStorage.removeItem('token');
    authenticatedUser
      ? localStorage.setItem('authenticatedUser', authenticatedUser)
      : localStorage.removeItem('authenticatedUser');
    role ? localStorage.setItem('role', role) : localStorage.removeItem('role');
  });

  handleAuthError(error: HttpErrorResponse) {
    console.log(error);

    if (error.status === 401) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error.error);
      this.authInfo.set({
        authToken: null,
        authenticatedUser: null,
        role: null,
      });
      this.router.navigateByUrl('/login');
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  register(user: Partial<User>) {
    return this.http.post(`${baseUrl}/register`, user);
  }

  login(user: Partial<LoginUser>): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${baseUrl}/login`, {
        usernameOrEmail: user.username,
        password: user.password,
      })
      .pipe(catchError(this.handleAuthError));
  }
}
