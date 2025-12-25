import express from 'express';
import { authRouter } from '../modules/auth/auth.router';
import path from 'path';
import { UserRouter } from '../modules/user/user.router';
import { AvailabilityRouter } from '../modules/availability/availability.router';
import { ListingRoutes } from '../modules/listing/listing.router';
import { BookingRoutes } from '../modules/booking/booking.router';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/user',
        route:UserRouter
    },
    {
        path:'/availability',
        route:AvailabilityRouter
    },
    {
        path:'/listing',
        route:ListingRoutes
    },
    {
        path:'/booking',
        route:BookingRoutes
    }
    
   
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;