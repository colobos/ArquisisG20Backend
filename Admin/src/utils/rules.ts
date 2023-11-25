import { Request, Response, NextFunction } from 'express';
const dotenv = require('dotenv');

dotenv.config();

export function cors (req: Request, res: Response, next: NextFunction) {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }

    next();
}

export function auth (req: Request, res: Response, next: NextFunction) {
    // Custom Authorization
    var authHeader = req.headers.authorization;
    if(authHeader != process.env.AUTH_TOKEN){
        var err = new Error('Unauthorized');

        res.setHeader('WWW-Authenticate','Basic');
        return res.status(401).send(err.message);
    }
    next();
}