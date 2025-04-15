import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginUser } from '../../interfaces/user.interface';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  error = signal<string | null>(null);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  async onSubmit() {
    if (!this.loginForm.valid) return;
    // this.loginForm.markAllAsTouched()
    const formValue: Partial<LoginUser> = {
      username: this.loginForm.get('username')?.value ?? '',
      password: this.loginForm.get('password')?.value ?? '',
    };
    // console.log({ formValue });

    try {
      const data = await firstValueFrom(this.authService.login(formValue));

      this.authService.authInfo.set({
        authToken: data.accessToken,
        authenticatedUser: formValue.username!,
        role: data.role,
      });
      this.router.navigateByUrl('/todos');
      this.error.set(null);
      // throw new Error('error');
    } catch (error: any) {
      console.log(error.message);

      this.error.set(error.message);
    }
  }
}
