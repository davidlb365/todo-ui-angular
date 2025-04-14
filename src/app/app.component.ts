import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'todo-ui-angular';

  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.authInfo.set({
      authToken: null,
      authenticatedUser: null,
      role: null,
    });
    this.router.navigateByUrl('/login');
  }
}
