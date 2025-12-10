import { Router } from 'express';
import HotelController from '../controllers/hotelController';
import validateRequest from '../middleware/validation';
import { hotelSearchSchema } from '../utils/validation';

const router = Router();

// POST /api/hotels/search
router.post('/search', validateRequest(hotelSearchSchema), HotelController.searchHotels);

// GET /api/hotels/near-airport/:airport
router.get('/near-airport/:airport', HotelController.getHotelsNearAirport);

// GET /api/hotels/:id
router.get('/:id', HotelController.getHotelDetails);

export default router;
