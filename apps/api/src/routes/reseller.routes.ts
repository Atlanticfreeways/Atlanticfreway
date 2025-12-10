import { Router } from 'express';
import { authenticateToken, requireTier } from '../middleware/auth.middleware';
import { WakanowService } from '../services/wakanow.service';

const router = Router();
const wakanowService = new WakanowService();

router.get('/inventory/flights', authenticateToken, requireTier('RESELLER'), async (req, res) => {
  const flights = await wakanowService.searchFlights(req.query as any);
  res.json({ flights, resellerMarkup: 0.20 });
});

router.get('/inventory/hotels', authenticateToken, requireTier('RESELLER'), async (req, res) => {
  const hotels = await wakanowService.searchHotels(req.query as any);
  res.json({ hotels, resellerMarkup: 0.20 });
});

router.post('/bookings/create', authenticateToken, requireTier('RESELLER'), async (req, res) => {
  const booking = await wakanowService.createBooking(req.body);
  res.json({ booking });
});

export default router;
