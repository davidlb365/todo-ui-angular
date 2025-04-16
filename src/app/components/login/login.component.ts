import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginUser } from '../../interfaces/user.interface';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  QueryClient,
  injectMutation,
} from '@tanstack/angular-query-experimental';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  authService = inject(AuthService);
  queryClient = inject(QueryClient);
  router = inject(Router);
  fb = inject(FormBuilder);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loginMutation = injectMutation(() => ({
    mutationFn: (formValue: Partial<LoginUser>) =>
      firstValueFrom(this.authService.login(formValue)),
    onSuccess: (data) => {
      this.authService.authInfo.set({
        authToken: data.accessToken,
        authenticatedUser: this.loginForm.get('username')?.value!,
        role: data.role,
      });
      this.router.navigateByUrl('/todos');
    },
    onError: (error: HttpErrorResponse) => {
      // console.log('tsquery error', { error });
    },
  }));

  async onSubmit() {
    if (!this.loginForm.valid) return;
    // this.loginForm.markAllAsTouched()
    const formValue: Partial<LoginUser> = {
      username: this.loginForm.get('username')?.value ?? '',
      password: this.loginForm.get('password')?.value ?? '',
    };
    // console.log({ formValue });

    this.loginMutation.mutate(formValue);

    // this.authService.authInfo.set({
    //   authToken: data.accessToken,
    //   authenticatedUser: formValue.username!,
    //   role: data.role,
    // });
    // throw new Error('error');
  }
}
