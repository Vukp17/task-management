import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
      ) {}
    
      async getTaskById(id: string): Promise<Task> {
        const task = this.tasksRepository.findOne({
          where: {
            id,
          },
        });
    
        if (!task) {
          throw new NotFoundException(`Task with id ${id} not found`);
        }
    
        return task;
      }
    

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto

        const task = this.tasksRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,

        });
        await this.tasksRepository.save(task);
        return task;
    }
    
    async deleteTask(id: string): Promise<void> {
        const result = await this.tasksRepository.delete(id)
       console.log(result);
    }
    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task =await this.tasksRepository.findOne({
            where: {
              id,
            },
          });
        task.status = status;
        return task;
    }
}
