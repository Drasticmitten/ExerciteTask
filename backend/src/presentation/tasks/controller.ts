import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { PaginationDto, TaskDto, UpdateTaskDto } from '../../domain';
import { TaskService } from '../services/tasks.service';
import { UserService } from '../services/users.service';

export class TaskController {
    constructor(
        private readonly tasksService   : TaskService,
        private readonly userService    : UserService
    ) { }

    getTasks = (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10 }  = req.query;
            const paginationDto             = PaginationDto.parse({page: +page, limit: +limit});

            this.tasksService.getTasks(paginationDto)
            .then(tasks     => res.status(200).json(tasks))
            .catch(error    => res.status(404).json({ error: error.message }));
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ errors: error.errors.map(err => `${err.path.join('.')}, ${err.message}`) });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    getTaskByName = (req: Request, res: Response) => {
        try {
            const { name } = req.params;
            this.tasksService.getTasksByUserName(name)
            .then(task   => res.status(200).json(task))
            .catch(error => res.status(404).json({ error: error.message }));
            
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    createTask = (req: Request, res: Response) => {
        try {
            const task = TaskDto.parse(req.body);
            this.tasksService.createTask(task)
            .then((createdTask) => {
                return this.userService.addTask(createdTask.task.nameUser, createdTask.task._id)
                    .then(() => {
                        res.status(201).json(createdTask);
                    });
            })
            .catch((error) => {
                res.status(400).json({ error: error.message });
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ errors: error.errors.map(err => `${err.path.join('.')}, ${err.message}`) });
            }
            res.status(500).json({ error });
        }
    }

    updateTask = (req: Request, res: Response) => {
        try {
            console.log('Task to Update: ', req.body);
            const task                      = UpdateTaskDto.parse(req.body);
            const { nameUser, nameTask }    = req.params;
            this.tasksService.updateTask(task, nameUser, nameTask)
            .then(task      => res.status(201).json(task))
            .catch(error    => res.status(400).json({ error: error.message }));
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ errors: error.errors.map(err => `${err.path.join('.')}, ${err.message}`) });
            }
            res.status(500).json({ error });
        }
    }
    
    deleteTask = (req: Request, res: Response) => {
        try {
            const { nameUser, nameTask } = req.params;
            this.tasksService.deleteTask(nameUser, nameTask)
            .then(task => res.status(204).send(task))
            .catch(error => res.status(400).json({ error: error.message }));
        } catch (error) {
            res.status(500).json({ error });
        }
    }
}