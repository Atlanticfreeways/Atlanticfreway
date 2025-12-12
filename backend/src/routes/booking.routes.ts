import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router = Router();

// Create booking (Optional auth: Guests can book too, but Auth users get it linked)
router.post('/', optionalAuthenticate, BookingController.createBooking);

// Get my bookings (Strict auth required)
router.get('/my-bookings', authenticate, BookingController.getUserBookings);

export default router;
