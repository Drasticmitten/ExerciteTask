import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        unique      : true,
        type        : String,
        required    : true
    },
    email: {
        type        : String,
        unique      : true,
        required    : true
    },
    password: {
        type        : String,
        required    : true
    },
    tasksAsigned: [{
        type        : Schema.Types.ObjectId,
        ref         : 'Task',
    }]
});


export const UserModel = mongoose.model('User', userSchema);