import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginUser } from '../../interfaces/user.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

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
      // console.log({ data });

      this.authService.authInfo.set({
        authToken: data.accessToken,
        authenticatedUser: formValue.username!,
        role: data.role,
      });
      this.router.navigateByUrl('/todos');
    } catch (error: any) {
      // console.log(error);
    }
  }
}
