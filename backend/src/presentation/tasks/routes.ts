import { Router } from "express";
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { TaskService } from '../services/tasks.service';
import { userService } from "../users/userServiceInstance";
import { TaskController } from './controller';
export class TaskRoutes {
    static get routes() :  Router {
        const router = Router();

        const taskService   = new TaskService();
        const controller    = new TaskController(taskService, userService);
        
        router.get('/'                          , AuthMiddleware.validateJWT    , controller.getTasks);
        router.get('/:name'                     , AuthMiddleware.validateJWT    , controller.getTaskByName);
        router.post('/'                         , AuthMiddleware.validateJWT    , controller.createTask);
        router.put('/:nameUser/:nameTask'       , AuthMiddleware.validateJWT    , controller.updateTask);
        router.delete('/:nameUser/:nameTask'    , AuthMiddleware.validateJWT    , controller.deleteTask);
        return router;
    }
}