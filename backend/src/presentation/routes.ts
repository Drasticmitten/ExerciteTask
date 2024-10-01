import { Router } from "express";
import { AuthRoutes } from './auth/routes';
import { TaskRoutes } from './tasks/routes';
import { UserRoutes } from './users/routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/task', TaskRoutes.routes);
        router.use('/api/users', UserRoutes.routes);
        return router;
    }

}