import { Component, effect, inject, input, signal } from '@angular/core';
import { Todo } from '../../interfaces/todo.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { LoadingComponent } from '../loading/loading.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'todo-form',
  imports: [ReactiveFormsModule, LoadingComponent],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {
  todoService = inject(TodoService);
  queryClient = inject(QueryClient);
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

  addTodoMutation = injectMutation(() => ({
    mutationFn: (formValue: Partial<Todo>) =>
      lastValueFrom(this.todoService.addTodo(formValue)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['todos'] });
      this.router.navigateByUrl('/todos');
    },
    onError: (error: HttpErrorResponse) => {
      // console.log('tsquery error', { error });
    },
  }));

  updateTodoMutation = injectMutation(() => ({
    mutationFn: (args: { formValue: Partial<Todo>; todoId: number }) =>
      lastValueFrom(this.todoService.updateTodo(args.formValue, args.todoId)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['todos'] });
      this.queryClient.invalidateQueries({
        queryKey: ['todo', this.todo()?.id],
      });
      this.router.navigateByUrl('/todos');
    },
    onError: (error: HttpErrorResponse) => {
      // console.log('tsquery error', { error });
    },
  }));

  async onSubmit() {
    this.todoForm.markAllAsTouched();
    if (!this.todoForm.valid) return;
    const formValue: Partial<Todo> = {
      title: this.todoForm.get('title')?.value ?? '',
      description: this.todoForm.get('description')?.value ?? '',
      completed: this.todoForm.get('completed')?.value ?? false,
    };
    try {
      if (this.todo()?.id) {
        // this.todoService.updateTodo(formValue, this.todo()?.id!)
        this.updateTodoMutation.mutate({
          formValue,
          todoId: this.todo()?.id!,
        });
      } else {
        this.addTodoMutation.mutate(formValue);
      }
      // this.router.navigateByUrl('/todos');
      this.error.set(false);
      // throw new Error('error');
    } catch (error: any) {
      this.error.set(true);
    }
  }
}
