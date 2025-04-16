import { Component, computed, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, Router } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoadingComponent } from '../loading/loading.component';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

@Component({
  selector: 'list-todo',
  imports: [RouterLink, LoadingComponent],
  templateUrl: './list-todo.component.html',
})
export default class ListTodoComponent {
  todoService = inject(TodoService);
  authService = inject(AuthService);
  queryClient = inject(QueryClient);
  router = inject(Router);

  isAdmin = computed(() => this.authService.authInfo().role === 'ROLE_ADMIN');

  // todosResource = rxResource({
  //   request: () => ({}),
  //   loader: ({ request }) => {
  //     return this.todoService.getTodos();
  //   },
  // });

  todosQuery = injectQuery(() => ({
    queryKey: ['todos'],
    queryFn: () => lastValueFrom(this.todoService.getTodos()),
    staleTime: 1000 * 60 * 10,
  }));

  deleteMutation = injectMutation(() => ({
    mutationFn: (todoId: number) =>
      lastValueFrom(this.todoService.deleteTodo(todoId)),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['todos'] }),
  }));

  completeMutation = injectMutation(() => ({
    mutationFn: (todoId: number) =>
      lastValueFrom(this.todoService.completeTodo(todoId)),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['todos'] }),
  }));

  incompleteMutation = injectMutation(() => ({
    mutationFn: (todoId: number) =>
      lastValueFrom(this.todoService.incompleteTodo(todoId)),
    onSuccess: () =>
      this.queryClient.invalidateQueries({ queryKey: ['todos'] }),
  }));

  async onDelete(todoId: number) {
    this.deleteMutation.mutate(todoId);
  }

  async onComplete(todoId: number) {
    this.completeMutation.mutate(todoId);
  }

  async onIncomplete(todoId: number) {
    this.incompleteMutation.mutate(todoId);
  }
}
