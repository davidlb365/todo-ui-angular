import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './register.component.html',
})
export default class RegisterComponent {
  authService = inject(AuthService);
  queryClient = inject(QueryClient);
  router = inject(Router);
  fb = inject(FormBuilder);

  error = signal(false);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  registerMutation = injectMutation(() => ({
    mutationFn: (formValue: Partial<User>) =>
      lastValueFrom(this.authService.register(formValue)),
    onSuccess: () => {
      this.router.navigateByUrl('/login');
    },
    onError: (error: HttpErrorResponse) => {
      // console.log('tsquery error', { error });
    },
  }));

  async onSubmit() {
    this.registerForm.markAllAsTouched();

    if (!this.registerForm.valid) return;
    const formValue: Partial<User> = {
      name: this.registerForm.get('name')?.value ?? '',
      username: this.registerForm.get('username')?.value ?? '',
      email: this.registerForm.get('email')?.value ?? '',
      password: this.registerForm.get('password')?.value ?? '',
    };

    this.registerMutation.mutate(formValue);
  }
}
