import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksRepository } from "./tasks.repository";
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]),AuthModule,PassportModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
