import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthenticatedGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // console.log('Authenticated Guard');

  const hasToken = authService.authInfo().authToken;
  // console.log('Guard Check:', {
  //   route: route.path,
  //   hasToken: !!hasToken,
  //   tokenValue: authService.authInfo().authToken,
  // });

  if (!hasToken) {
    // console.log('No token found, redirecting to login');

    router.navigate(['/login']);
    return false;
  }

  return true;
};
