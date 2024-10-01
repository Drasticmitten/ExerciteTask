export interface Task {
    _id: string;
    name: string;
    nameUser: string;
    description: string;
    userId: string;
    status: enumStatus;
    createdAt?: string;
    updatedAt?: string;
    endedAt?: string;
}

export enum enumStatus {
    todo = 'todo',
    inprogress = 'inprogress',
    done = 'done'
}