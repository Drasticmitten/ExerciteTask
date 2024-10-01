import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { CustomError, LoginDto, RegisterDto } from "../../domain";
import { AuthService } from '../services/auth.service';

export class AuthController {
    constructor(public readonly authService: AuthService) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        if (error instanceof ZodError) {
            console.log(`${error}`);
            return res.status(400).json({
                errors: error.errors.map(err => ({ error: `${err.path.join('.')}, ${err.message}` })),
            });
        }

        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    validateToken = (req: Request, res: Response) => {
        res.status(200).json({ message: 'Token is valid' });
    }

    registerUser = (req: Request, res: Response) => {
        try {
            const registerDto = RegisterDto.parse(req.body);

            this.authService.register(registerDto)
                .then(({ user, token }) => {
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                    });
                    res.status(201).json(user);
                })
                .catch((error) => this.handleError(error, res));

        } catch (error) {
            this.handleError(error, res);
        }
    }

    loginUser = (req: Request, res: Response) => {
        try {
            const loginDto = LoginDto.parse(req.body);

            this.authService.login(loginDto)
                .then(({ user, token }) => {
                    res.cookie('token', token);
                    res.status(200).json(user);
                })
                .catch((error) => this.handleError(error, res));
        } catch (error) {
            this.handleError(error, res);
        }
    }

    logoutUser = (req: Request, res: Response) => {
        try {
            res.clearCookie('token')
                .status(200)
                .json({ message: 'Logout successful' });
        } catch (error) {
            this.handleError(error, res);
        }
    }
}
