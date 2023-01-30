import { Injectable } from "@nestjs/common";
import {  Repository,DataSource, EntityRepository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";
@Injectable() 
export class TasksRepository extends Repository<Task>{

    constructor(private dataSource: DataSource)
    {
        super(Task, dataSource.createEntityManager());
    }
   
    
}

