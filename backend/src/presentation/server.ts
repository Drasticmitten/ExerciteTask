import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Router } from 'express';
import morgan from 'morgan';
import { Options } from '../infraestructure';

export class Server {
    public readonly app         = express();
    private readonly port       : number;
    private readonly publicPath : string;
    private serverListener?     : any;
    private readonly routes     : Router;

    constructor(options: Options) {
        const { port, routes, public_path = 'public' } = options;
        this.port       = port;
        this.routes     = routes;
        this.publicPath = public_path;
    }

    async start() {
        this.app.use(morgan('dev'));
        this.app.use(cookieParser());
        this.app.use(cors({
            origin          : 'http://localhost:4200',
            credentials     : true
        }))
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(this.routes);

        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    public close() {
        this.serverListener?.close();
    }
}


