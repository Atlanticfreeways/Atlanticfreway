import { Router } from 'express';
import { WakanowService } from '../services/wakanow.service';

const router = Router();
const wakanowService = new WakanowService();

router.get('/flights/search', async (req, res) => {
  const { origin, destination, date } = req.query;
  const flights = await wakanowService.searchFlights({
    origin: origin as string,
    destination: destination as string,
    date: date as string
  });
  res.json({ flights });
});

router.get('/hotels/search', async (req, res) => {
  const { location, checkin, checkout } = req.query;
  const hotels = await wakanowService.searchHotels({
    location: location as string,
    checkin: checkin as string,
    checkout: checkout as string
  });
  res.json({ hotels });
});

router.post('/bookings/create', async (req, res) => {
  const booking = await wakanowService.createBooking(req.body);
  res.json({ booking });
});

export default router;
