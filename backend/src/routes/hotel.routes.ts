import { Router } from 'express';
import { HotelController } from '../controllers/hotelController';

const router = Router();

router.get('/search', HotelController.searchHotels);

export default router;
