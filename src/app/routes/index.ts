import express from 'express';
import { authRouter } from '../modules/auth/auth.router';
import { UserRouter } from '../modules/user/user.router';
import { ListingRoutes } from '../modules/listing/listing.router';
import { BookingRoutes } from '../modules/booking/booking.router';
import { ReviewRoutes } from '../modules/review/review.router';


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
        path:'/listing',
        route:ListingRoutes
    },
    {
        path:'/booking',
        route:BookingRoutes
    },
    {
        path:'/review',
        route:ReviewRoutes
    }
      
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;