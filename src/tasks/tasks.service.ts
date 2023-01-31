import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { v4 as uuid } from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from "./tasks.repository";
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) // NOTICE: here
    private readonly tasksRepository: TasksRepository,
  ) { }
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user })
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(`(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))`, { search: `%${search}%` });
    }


    const tasks = await query.getMany();

    return tasks;
  }
  async getTaskById(id: string, user: User): Promise<Task> {
    const task = this.tasksRepository.findOne({
      where: {
        id, user
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }


  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user): Promise<void> {
    const result = await this.tasksRepository.delete({id, user })
    if (result.affected == 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.tasksRepository.save
    return task;
  }
}
