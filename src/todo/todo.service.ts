import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  // Получить одну задачу по ID
  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  // Создать новую задачу
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);
    return this.todoRepository.save(todo);
  }

  // Обновить существующую задачу
  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const result = await this.todoRepository.update(
      parseInt(id),
      updateTodoDto,
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return this.findOne(id); // Fetch updated task
  }

  // Удалить задачу
  async remove(id: string): Promise<void> {
    const result = await this.todoRepository.delete(parseInt(id));
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }
}
