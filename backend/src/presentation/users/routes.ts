import { Router } from "express";
import { UserController } from "./controller";
import { userService } from "./userServiceInstance";

export class UserRoutes {

    static get routes() :  Router {
        const router = Router();
        const userController = new UserController(userService);
        router.get('/'                          , userController.getUsers);
        router.get('/:name'                     , userController.getUserByName);
        router.put('/:name'                     , userController.updateUser);
        router.delete('/:name'                  , userController.deleteUser);
        return router;
    }
}