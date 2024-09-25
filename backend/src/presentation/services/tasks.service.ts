import { z } from 'zod';
import { TaskModel, UserModel } from '../../data/mongo';
import { PaginationDto, TaskDto, UpdateTaskDto } from '../../domain';

export class TaskService {
    constructor() { }

    public async getTasks(paginationDto: z.infer<typeof PaginationDto>) {
        try {
            const { page, limit } = paginationDto;
            const tasks = await TaskModel.find()
            .skip((page - 1) * limit)
            .limit(limit);
            
            return {
                page,
                limit,
                total: tasks.length,
                next    : `/api/categories?page=${ ( page + 1 ) }&limit=${ limit }`,
                prev    : (page - 1 > 0) ? `/api/categories?page=${ ( page - 1 ) }&limit=${ limit }`: null,
                tasks   : tasks.map(task => ({
                    idUser      : task.id,
                    name        : task.name,
                    description : task.description,
                    createdAt   : task.start,
                    status      : task.status
                }))
            }
        } catch (error) {
            throw Error('Internal server error');
        }
    }

    public async getTaskById(name: string) {
        try {
            const user = await UserModel.findOne({ name });
            if (!user) throw Error('User not found');
            const task = await TaskModel.findOne({ idUser: user?._id });
            if (!task) throw Error('Task not found');
            
            return {
                ...task,
            }

        } catch (error) {
            throw Error('Internal server error');
        }
    }

    public async createTask(task: z.infer<typeof TaskDto>) {
        const user = await UserModel.findOne({ name: task.nameUser });
        if (!user) throw Error('User not found');
        const taskCreated = new TaskModel({ ...task, userId: user._id });
        await taskCreated.save();
        return {
            message: 'Task created successfully',
            task: {
                idUser      : taskCreated.id,
                name        : taskCreated.name,
                description : taskCreated.description,
                createdAt   : taskCreated.start,
                status      : taskCreated.status
            },
        }
    }

    public async updateTask(task: z.infer<typeof UpdateTaskDto>, nameUser: string, nameTask: string) {
        const updatedTask = await TaskModel.findOneAndUpdate(
            { nameUser: nameUser, name: nameTask },
            task,
            { new: true });

        console.log(updatedTask);
        if (!updatedTask) throw Error('Task not found');
        return {
            message: 'Task updated successfully',
            updatedTask: {
                idUser      : updatedTask.id,
                name        : updatedTask.name,
                description : updatedTask.description,
                createdAt   : updatedTask.start,
                update      : updatedTask.updatedAt,
                end         : updatedTask.end ? updatedTask.end : null,
                status      : updatedTask.status
            },
        }
    }

    public async deleteTask(nameUser: string, nameTask: string) {
        const task = await TaskModel.findOneAndDelete(
            { nameUser: nameUser, name: nameTask });
        if (!task) throw Error('Task not found');
        return {
            message: 'Task deleted successfully',
            task: {
                idUser      : task.id,
                name        : task.name,
                description : task.description,
                createdAt   : task.start,
                status      : task.status
            },
        }
    }
}