import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export default class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  error = signal(false);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit() {
    // this.todoForm.markAllAsTouched()
    // console.log(this.registerForm.valid);

    if (!this.registerForm.valid) return;
    const formValue: Partial<User> = {
      name: this.registerForm.get('name')?.value ?? '',
      username: this.registerForm.get('username')?.value ?? '',
      email: this.registerForm.get('email')?.value ?? '',
      password: this.registerForm.get('password')?.value ?? '',
    };

    try {
      const data = await firstValueFrom(this.authService.register(formValue));
      this.router.navigateByUrl('/login');
      this.error.set(false);
      // throw new Error('error');
    } catch (error: any) {
      this.error.set(true);
    }
  }
}
