import moment from "moment";
import { Schema, Types, model } from "mongoose";

export const taskSchema = new Schema({
    userId: {
        type        : Types.ObjectId,
        ref         : 'User',
        required    : true
    },
    nameUser: {
        type        : String,
        required    : true
    },
    name: {
        type        : String,
        unique      : true,
        required    : true
    },
    description: {
        type        : String,
        required    : true
    },
    status: {
        type        : String,
        enum        : ['todo', 'inprogress', 'done'],
        required    : true
    }
    ,
    start: {
        type        : String,
        default     : moment().format('YYYY-MM-DD HH:mm:ss')
    },
    updatedAt: {
        type        : String,
    },
    end: {
        type        : String
    },
});

export const TaskModel = model('Task', taskSchema);