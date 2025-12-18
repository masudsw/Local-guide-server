import express from 'express';
import { authRouter } from '../modules/auth/auth.router';
import { userRoutes } from '../modules/user/user.router';
import { ScheduleRouter } from '../modules/schedule/schedule.router';
import { doctorScheduleRouter } from '../modules/doctorSchedule/doctorSchedule.router';
import { DoctorRoutes } from '../modules/doctor/doctor.router';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { PatientRouter } from '../modules/patient/patient.routes';
import { SpecialtiesRoutes } from '../modules/specialities/specialities.routes';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/schedule',
        route: ScheduleRouter
    },
    {
        path:'/doctor-schedule',
        route:doctorScheduleRouter
    },
    {
        path:'/doctor',
        route:DoctorRoutes
    },
    {
        path:'/admin',
        route:AdminRoutes
    },
    {
        path:'/patient',
        route:PatientRouter
    },
    {
        path:'/appointment',
        route:ScheduleRouter
    },
    {
        path:'/specialties',
        route:SpecialtiesRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;