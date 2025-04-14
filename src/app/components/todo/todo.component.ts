import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../interfaces/todo.interface';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule],
  templateUrl: './todo.component.html',
})
export default class TodoComponent {
  todoService = inject(TodoService);
  router = inject(Router);
  fb = inject(FormBuilder);

  todoForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    completed: [false],
  });

  async onSubmit() {
    if (!this.todoForm.valid) return;
    // this.todoForm.markAllAsTouched()
    const formValue: Partial<Todo> = {
      title: this.todoForm.get('title')?.value ?? '',
      description: this.todoForm.get('description')?.value ?? '',
      completed: this.todoForm.get('completed')?.value ?? false,
    };
    await firstValueFrom(this.todoService.addTodo(formValue));
    this.router.navigateByUrl('/todos');
  }
}
