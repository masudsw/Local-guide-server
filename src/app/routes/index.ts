import express from 'express';
import { authRouter } from '../modules/auth/auth.router';
import path from 'path';
import { UserRouter } from '../modules/user/user.router';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/user',
        route:UserRouter
    }
    
   
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;