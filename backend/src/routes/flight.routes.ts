import { Router } from 'express';
import FlightController from '../controllers/flightController';
import validateRequest from '../middleware/validation';
import { flightSearchSchema } from '../utils/validation';

const router = Router();

// POST /api/flights/search
router.post('/search', validateRequest(flightSearchSchema), FlightController.searchFlights);

// GET /api/flights/trending
router.get('/trending', FlightController.getTrendingRoutes);

// GET /api/flights/price-history/:from/:to
router.get('/price-history/:from/:to', FlightController.getPriceHistory);

// GET /api/flights/:id
router.get('/:id', FlightController.getFlightDetails);

export default router;
