import { Types } from "mongoose";
import { z } from 'zod';
import { UserModel } from '../../data/mongo';
import { PaginationDto, UpdateUserDto } from '../../domain';

export class UserService {
    constructor() { }

    public async getUsers(paginationDto: z.infer<typeof PaginationDto>) {
        const { page, limit } = paginationDto;
        const users = await UserModel.find()
        .skip((page - 1) * limit)
        .limit(limit);

        if (!users) throw new Error('No users found');

        return {
            page,
            limit,
            total: users.length,
            next    : (users.length === limit) ? `/api/categories?page=${(page + 1)}&limit=${limit}` : null,
            prev    : (page - 1 > 0) ? `/api/categories?page=${ ( page - 1 ) }&limit=${ limit }`: null,
            users   : users.map(user => ({
                idUser          : user.id,
                name            : user.name,
                email           : user.email,
                tasksAsigned    : user.tasksAsigned.map(task => ({
                    idTask      : task.id,
                }))
            }))
        }
    }

    public async getUserByName(name: string) {
        const user = await UserModel.findOne({ name });
        if (!user) throw new Error('User not found');
        return {
            _id         : user.id,
            name        : user.name,
            email       : user.email,
            tasksAsigned : user.tasksAsigned.map(task => ({
                idTask      : task.id,
            }))
        }
    }

    public async updateUser(user: z.infer<typeof UpdateUserDto>, name: string) {
        const updatedUser = await UserModel.findOneAndUpdate({ name }, user, { new: true });
        if (!updatedUser) throw new Error('User not found');
        return {
            idUser      : updatedUser.id,
            name        : updatedUser.name,
            email       : updatedUser.email,
        }
    }

    public async deleteUser(name: string) {
        const deletedUser = await UserModel.deleteOne({ name });
        if (!deletedUser) throw new Error('User not found');
        return {
            message: 'User deleted'
        }
    }

    public async addTask(name: string, idTask: Types.ObjectId) {
        const user = await UserModel.findOne({ name });
        if (!user) throw new Error('User not found');
        user.tasksAsigned.push(idTask);
        await user.save();
    }
}