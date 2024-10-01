import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { PaginationDto, UpdateUserDto } from '../../domain';
import { UserService } from '../services/users.service';

export class UserController {
    constructor(private readonly usersService: UserService) { }

    getUsers = async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10 }  = req.query;
            const paginationDto             = PaginationDto.parse({page: +page, limit: +limit});
            
            this.usersService.getUsers(paginationDto)
            .then(users     => res.status(200).json(users))
            .catch(error    => res.status(404).json({ error: error.message }));
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ errors: error.errors.map(err => `${err.path.join('.')}, ${err.message}`) });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    getUserByName = async (req: Request, res: Response) => {
        try {
            const { name } = req.params;
            this.usersService.getUserByName(name)
            .then(user   => res.status(200).json(user))
            .catch(error => res.status(404).json({ error: error.message }));
            
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ errors: error.errors.map(err => `${err.path.join('.')}, ${err.message}`) });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    updateUser = async (req: Request, res: Response) => {
        try {
            const user                      = UpdateUserDto.parse(req.body);
            const { name }                  = req.params;

            this.usersService.updateUser(user, name)
            .then(user      => res.status(201).json(user))
            .catch(error    => res.status(400).json({ error: error.message }));
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ errors: error.errors.map(err => `${err.path.join('.')}, ${err.message}`) });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    deleteUser = async (req: Request, res: Response) => {
        try {
            const { name } = req.params;
            this.usersService.deleteUser(name)
            .then(user   => res.status(200).json(user))
            .catch(error => res.status(404).json({ error: error.message }));
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ errors: error.errors.map(err => `${err.path.join('.')}, ${err.message}`) });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}