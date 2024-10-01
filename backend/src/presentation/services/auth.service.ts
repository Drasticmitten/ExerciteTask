import { z } from "zod";
import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongo";
import { CustomError, LoginDto, RegisterDto } from "../../domain";

export class AuthService {
    constructor() { }

    public async register(registerUserDto: z.infer<typeof RegisterDto>) {
        if (registerUserDto.password !== registerUserDto.passwordConfirmation) throw CustomError.badRequest('Passwords do not match');


        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest('Email already used');
        const existName = await UserModel.findOne({ name: registerUserDto.name });
        if (existName) throw CustomError.badRequest('Name already used');

        const user = new UserModel(registerUserDto);
        user.password = bcryptAdapter.hash(user.password);
        await user.save();
        const { password, ...userWithoutPassword } = user.toObject();
        const token = await JwtAdapter.generateToken({ id: user._id });
        if (!token) throw new Error('Error creating token');
        return {
            user: userWithoutPassword,
            token
        };
    }

    public async login(loginUserDto: z.infer<typeof LoginDto>) {
        const user = await UserModel.findOne({ name: loginUserDto.name });
        if (!user) throw CustomError.badRequest('User not found');

        const isPasswordCorrect = bcryptAdapter.compare(loginUserDto.password, user.password);
        if (!isPasswordCorrect) throw CustomError.badRequest('Invalid password');
        const { password, ...userWithoutPassword } = user.toObject();
        const token = await JwtAdapter.generateToken({ id: user._id });
        if (!token) throw CustomError.internalServer('Error creating token');
        return {
            user: userWithoutPassword,
            token
        };
    }




}