import { Router } from 'express';
import authRoutes from './auth.routes';
import flightRoutes from './flight.routes';
import hotelRoutes from './hotel.routes';
import bookingRoutes from './booking.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/flights', flightRoutes);
router.use('/hotels', hotelRoutes);
router.use('/bookings', bookingRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

export default router;
