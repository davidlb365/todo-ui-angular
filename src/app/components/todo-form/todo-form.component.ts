import { Component, effect, inject, input, signal } from '@angular/core';
import { Todo } from '../../interfaces/todo.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'todo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {
  todoService = inject(TodoService);
  router = inject(Router);
  fb = inject(FormBuilder);

  todo = input<Todo>();

  error = signal(false);

  updateForm = effect(() => {
    if (this.todo()) {
      this.todoForm.patchValue({
        title: this.todo()?.title,
        description: this.todo()?.description,
        completed: this.todo()?.completed,
      });
    }
  });

  todoForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    completed: [false],
  });

  async onSubmit() {
    this.todoForm.markAllAsTouched();
    if (!this.todoForm.valid) return;
    const formValue: Partial<Todo> = {
      title: this.todoForm.get('title')?.value ?? '',
      description: this.todoForm.get('description')?.value ?? '',
      completed: this.todoForm.get('completed')?.value ?? false,
    };
    try {
      // if (this.todo()?.id) {
      //   await firstValueFrom(
      //     this.todoService.updateTodo(formValue, this.todo()?.id!)
      //   );
      // } else {
      //   await firstValueFrom(this.todoService.addTodo(formValue));
      // }
      // this.router.navigateByUrl('/todos');
      // this.error.set(false);
      throw new Error('error');
    } catch (error: any) {
      this.error.set(true);
    }
  }
}
