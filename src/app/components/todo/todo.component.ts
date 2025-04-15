import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../interfaces/todo.interface';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule, TodoFormComponent],
  templateUrl: './todo.component.html',
})
export default class TodoComponent {}
