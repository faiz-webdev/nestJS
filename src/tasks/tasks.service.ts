import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDot: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDot);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task not foud with ID ${id}`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createtask(createTaskDto);
    // const { title, description } = createTaskDto;
    // const task = this.taskRepository.create({
    //   title,
    //   description,
    //   status: TasksStatus.OPEN,
    // });

    // // task.status = TasksStatus.DONE;//wen can change like this

    // await this.taskRepository.save(task);
    // return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(id: string, status: TasksStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.taskRepository.save(task);
    return task;
  }

  async updateTaskTitle(id: string, title: string): Promise<Task> {
    const task = await this.getTaskById(id);
    task.title = title;

    await this.taskRepository.save(task);
    return task;
  }
}
