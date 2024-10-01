import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data/mongo';


export class AuthMiddleware {


    static async validateJWT(req: Request, res: Response, next: NextFunction) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: 'UnAuthorized' });

        try {
            const payload = await JwtAdapter.validateToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Invalid token' })

            const user = await UserModel.findById(payload.id);
            if (!user) return res.status(401).json({ error: 'Invalid token - user' });

            const { password, ...userWithoutPassword } = user.toObject();
            req.body.user = userWithoutPassword;

            next();

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}


