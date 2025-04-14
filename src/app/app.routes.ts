import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { NotAuthenticatedGuard } from './guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/list-todo/list-todo.component'),
    canMatch: [AuthenticatedGuard],
    pathMatch: 'full',
  },
  {
    path: 'todos',
    loadComponent: () => import('./components/list-todo/list-todo.component'),
    canMatch: [AuthenticatedGuard],
  },
  {
    path: 'add-todo',
    loadComponent: () => import('./components/todo/todo.component'),
    canMatch: [AuthenticatedGuard],
  },
  {
    path: 'update-todo/:id',
    loadComponent: () =>
      import('./components/update-todo/update-todo.component'),
    canMatch: [AuthenticatedGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component'),
    canMatch: [NotAuthenticatedGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component'),
    canMatch: [NotAuthenticatedGuard],
  },
  {
    path: '**',
    redirectTo: 'todos',
  },
];
