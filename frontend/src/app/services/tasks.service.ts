import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { Task } from "../pages/dashboard/tasks/task.model";

export interface CreateTaskResponse {
    message: string;
    task: Task;
}

export interface UpdatedTaskResponse {
    message: string;
    updatedTask: Task;
}

export interface GetTaskByUserName {
    message     : string;
    tasks       : Task[];
}

@Injectable({
    providedIn: 'root',
})
export class TasksService {
    constructor(private http: HttpClient) {}

    getTasks() {
        return this.http.get('http://localhost:3000/api/task', {
            withCredentials: true,
        }).pipe(
            map(tasks => {
                console.log('Tasks:', tasks);
                return tasks;
            }),
            catchError(error => {
                console.error('Error fetching tasks:', error);
                return of([]);
            })
        );
    }

    getTasksByName(name: string): Observable<Task[]> {
        return this.http.get<GetTaskByUserName>(`http://localhost:3000/api/task/${name}`, {
            withCredentials: true,
        }).pipe(
            map(tasks => {
                return tasks.tasks;
            }),
            catchError(error => {
                console.error('Error fetching tasks:', error);
                return of([]);
            })
        );
    }


    createTask(task: Task) {
        return this.http.post<CreateTaskResponse>('http://localhost:3000/api/task', task, {
            withCredentials: true,
        }).pipe(
            map(task => {
                return task.task;
            }),
            catchError(error => {
                console.error('Error creating task:', error);
                return of([]);
            })
        );
    }

    updateTask(nameUser: string, nameTask: string, task: Task): Observable<Task> {
        return this.http.put<UpdatedTaskResponse>(`http://localhost:3000/api/task/${nameUser}/${nameTask}`, task, {
            withCredentials: true,
        }).pipe(
            map(task => {
                console.log('Task updated:', task.updatedTask);
                return task.updatedTask;
            }),
            catchError(error => {
                console.error('Error updating task:', error);
                return of();
            })
        );
    }

    deleteTask(nameUser: string, nameTask: string) {
        return this.http.delete(`http://localhost:3000/api/task/${nameUser}/${nameTask}`, {
            withCredentials: true,
        }).pipe(
            map(task => {
                console.log('Task deleted:', task);
                return task;
            }),
            catchError(error => {
                console.error('Error deleting task:', error);
                return of([]);
            })
        );
    }
}