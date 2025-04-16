import { Component, effect, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Todo } from '../../interfaces/todo.interface';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { LoadingComponent } from '../loading/loading.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-update-todo',
  imports: [ReactiveFormsModule, LoadingComponent, TodoFormComponent],
  templateUrl: './update-todo.component.html',
})
export default class UpdateTodoComponent {
  todoService = inject(TodoService);
  queryClient = inject(QueryClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  todoId = toSignal(this.route.params.pipe(map((params) => params['id'])));

  // updateTodoResource = rxResource({
  //   request: () => ({
  //     id: this.todoId(),
  //   }),
  //   loader: ({ request }) => {
  //     return this.todoService.getTodo(request.id);
  //   },
  // });

  todoQuery = injectQuery(() => ({
    queryKey: ['todo', this.todoId()],
    queryFn: () => lastValueFrom(this.todoService.getTodo(this.todoId())),
    staleTime: 1000 * 60 * 10,
  }));

  updateForm = effect(() => {
    if (this.todoQuery.data()) {
      this.todoForm.patchValue({
        title: this.todoQuery.data()?.title,
        description: this.todoQuery.data()?.description,
        completed: this.todoQuery.data()?.completed,
      });
    }
  });

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
    await firstValueFrom(this.todoService.updateTodo(formValue, this.todoId()));
    this.router.navigateByUrl('/todos');
  }
}
