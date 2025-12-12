import { Request, Response } from 'express';
import Booking from '../models/Booking';
import { AuthRequest } from '../middleware/auth';

export class BookingController {

    // Create a new booking
    static async createBooking(req: Request, res: Response) {
        try {
            // If authenticated, attach user ID
            const userId = (req as AuthRequest).user?._id;

            const { flight, passengerDetails } = req.body;
            const bookingReference = `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

            const booking = await Booking.create({
                user: userId, // Can be undefined for guest
                flightId: flight.id || 'mock-id',
                bookingReference,
                passengerDetails,
                flightDetails: {
                    airline: flight.airline,
                    flightNumber: flight.flightNumber,
                    from: flight.departure.city,
                    to: flight.arrival.city,
                    departDate: new Date(`${flight.departure.date}T${flight.departure.time}`),
                    arriveDate: new Date(`${flight.arrival.date}T${flight.arrival.time}`),
                    price: flight.price
                },
                safetyScoreSnapshot: flight.safetyScore
            });

            res.status(201).json({
                success: true,
                data: booking
            });
        } catch (error: any) {
            console.error('Booking creation error:', error);
            res.status(500).json({ success: false, error: 'Booking failed', details: error.message });
        }
    }

    // Get bookings for the logged-in user
    static async getUserBookings(req: Request, res: Response) {
        try {
            const userId = (req as AuthRequest).user!._id;
            const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });

            res.json({
                success: true,
                data: bookings
            });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
        }
    }
}
