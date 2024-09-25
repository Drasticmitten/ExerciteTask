import { Schema, model } from "mongoose";

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
    }
});

export const UserModel = model('User', userSchema);