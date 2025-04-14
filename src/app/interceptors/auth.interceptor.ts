import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authService = inject(AuthService);

  const todosPath = req.url.includes('/api/todos');
  if (!todosPath) return next(req);

  // Inject the current `AuthService` and use it to get an authentication token:
  // const authToken = inject(AuthService).getAuthToken();
  const authToken = authService.authInfo().authToken;
  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authToken}`),
  });
  return next(newReq).pipe(
    catchError((error) => authService.handleAuthError(error))
  );
}
