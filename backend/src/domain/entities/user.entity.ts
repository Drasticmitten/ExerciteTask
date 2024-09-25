import { CustomError } from '../errors/custom.error';


export class UserEntity {

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public password: string,
    ) { }

    static fromObject(object: { [key: string]: any; }) {
        const { _id, name, email, password } = object;

        if (!_id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!email) throw CustomError.badRequest('Missing email');
        if (!password) throw CustomError.badRequest('Missing password');

        return new UserEntity(_id, name, email, password);
    }
}