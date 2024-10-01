import { Task } from "../pages/dashboard/tasks/task.model";

export interface UserInfo {
    _id             : string;
    name            : string;
    email           : string;
    tasksAsigned?   : Task[];
}