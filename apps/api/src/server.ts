import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import partnerRoutes from './routes/partner.routes';
import consumerRoutes from './routes/consumer.routes';
import resellerRoutes from './routes/reseller.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/partner', partnerRoutes);
app.use('/api/consumer', consumerRoutes);
app.use('/api/reseller', resellerRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`🚀 Atlanticfreway API running on port ${PORT}`);
});
