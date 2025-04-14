import { Component, computed, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'list-todo',
  imports: [RouterLink, LoadingComponent],
  templateUrl: './list-todo.component.html',
})
export default class ListTodoComponent {
  todoService = inject(TodoService);
  authService = inject(AuthService);
  router = inject(Router);

  isAdmin = computed(() => this.authService.authInfo().role === 'ROLE_ADMIN');

  todosResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      // console.log('request');

      return this.todoService.getTodos();
    },
  });

  async onDelete(todoId: number) {
    await firstValueFrom(this.todoService.deleteTodo(todoId));
    this.todosResource.reload();
  }

  async onComplete(todoId: number) {
    await firstValueFrom(this.todoService.completeTodo(todoId));
    this.todosResource.reload();
  }

  async onIncomplete(todoId: number) {
    await firstValueFrom(this.todoService.incompleteTodo(todoId));
    this.todosResource.reload();
  }
}
