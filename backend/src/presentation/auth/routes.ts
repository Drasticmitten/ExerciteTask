import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthService } from '../services/auth.service';
import { AuthController } from './controller';

export class AuthRoutes {
    static get routes() :  Router {
        const router = Router();

        const authService = new AuthService();
        const controller = new AuthController(authService);
        router.get('/validate-token', AuthMiddleware.validateJWT, controller.validateToken);
        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);
        router.post('/logout', controller.logoutUser);
        return router;
    }
}