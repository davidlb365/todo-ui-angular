import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { Todo } from '../interfaces/todo.interface';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

const baseUrl = `${environment.baseUrl}/todos`;

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient);
  authService = inject(AuthService);

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(baseUrl);
    // .pipe(catchError((error) => this.authService.handleAuthError(error)));
  }

  getTodo(id: number): Observable<Todo> {
    console.log('mec');

    return this.http
      .get<Todo>(`${baseUrl}/${id}`)
      .pipe(tap((res) => console.log('getTodo')));
  }

  addTodo(todo: Partial<Todo>): Observable<Todo> {
    return this.http.post<Todo>(baseUrl, todo);
    // .pipe(catchError((error) => this.authService.handleAuthError(error)));
  }

  updateTodo(todo: Partial<Todo>, id: number): Observable<Todo> {
    return this.http.put<Todo>(`${baseUrl}/${id}`, todo);
  }

  completeTodo(todoId: number) {
    return this.http.patch(`${baseUrl}/${todoId}/complete`, {});
    // .pipe(catchError((error) => this.authService.handleAuthError(error)));
  }

  incompleteTodo(todoId: number) {
    return this.http.patch(`${baseUrl}/${todoId}/incomplete`, {});
    // .pipe(catchError((error) => this.authService.handleAuthError(error)));
  }

  deleteTodo(todoId: number) {
    console.log(todoId);

    return this.http.delete(`${baseUrl}/${todoId}`, {
      responseType: 'text',
    });
    // .pipe(catchError((error) => this.authService.handleAuthError(error)));
  }
}
