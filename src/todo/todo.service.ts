import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './models/todo.model';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { SearchTodoDto } from  './dto/search-todo.dto';
import { Like, Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  constructor(
    @InjectRepository(TodoEntity)
    private readonly TodoRepository: Repository<TodoEntity>
  ) {
    const todo = new Todo();
    todo.name = 'Sport';
    todo.description = 'Faire du Sport';
    this.todos = [
      todo
    ];
  }
  private findFakeTodoById(id: string): Todo {
    const todo = this.todos.find(
      (actualTodo) => {
        if (actualTodo.id === id)
          return actualTodo;
      }
    );
    if (todo)
      return todo;
    throw new NotFoundException(`Le todo d'id ${id} n'existe pas`);
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  async findAllTodos(): Promise<TodoEntity[]> {
    return await this.TodoRepository.find();
  }

  async findSearchedTodo(searchFilter: SearchTodoDto) {
    const todos = await this.TodoRepository.find(
      {
        description:Like(`%${searchFilter.description}%`),
        status: searchFilter.status      
      });
      return todos;
      throw new NotFoundException(`Le todo avec recherchée n'existe pas`);
  }

  async findTodoById(id:number) {
    const todos = await this.TodoRepository.find({id});
    if (todos[0])
      return todos[0];
    throw new NotFoundException(`Le todo d'id ${id} n'est pas disponible`);
  }


  fakeAddTodo(newTodo: CreateTodoDto): Todo {
    const {name, description} = newTodo;
    const todo =  new Todo();
    todo.name = name;
    todo.description = description;

    this.todos.push(todo);
    return todo;
  }

  async addTodo(newTodo: CreateTodoDto): Promise<TodoEntity> {
    const todo =  this.TodoRepository.create(newTodo);
    return await this.TodoRepository.save(todo);
  }


  async deleteTodo(id: number) {
    return await this.TodoRepository.softDelete(id);
  }

  async restoreTodo(id: number) {
    return await this.TodoRepository.restore(id);
  }

  async updateTodo(id: string, newTodo: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.TodoRepository.preload({
      id: +id,
      ...newTodo
    });
    if (!todo) {
      new NotFoundException(`Le todo d'id ${id} n'existe pas`);
    }
    return await this.TodoRepository.save(todo);
  }
}
