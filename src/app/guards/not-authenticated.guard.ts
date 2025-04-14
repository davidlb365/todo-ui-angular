import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const NotAuthenticatedGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const hasToken = authService.authInfo().authToken;

  if (hasToken) {
    router.navigate(['/todos']);
    return false;
  }

  return true;
};
