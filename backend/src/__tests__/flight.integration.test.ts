import request from 'supertest';
import app from '../app';

describe('Flight API Integration Tests', () => {
  describe('POST /api/flights/search', () => {
    it('should search flights with valid parameters', async () => {
      const response = await request(app)
        .post('/api/flights/search')
        .send({
          departure: 'NYC',
          arrival: 'LAX',
          departDate: '2024-12-25',
          passengers: 2,
          tripType: 'oneway',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.flights).toBeDefined();
      expect(Array.isArray(response.body.data.flights)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it('should return 400 for invalid search parameters', async () => {
      const response = await request(app)
        .post('/api/flights/search')
        .send({
          departure: 'NYC',
          arrival: 'LAX',
          departDate: 'invalid-date',
          passengers: 2,
          tripType: 'oneway',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .post('/api/flights/search?page=1&limit=5')
        .send({
          departure: 'NYC',
          arrival: 'LAX',
          departDate: '2024-12-25',
          passengers: 1,
          tripType: 'oneway',
        });

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.data.flights.length).toBeLessThanOrEqual(5);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/flights/search')
        .send({
          departure: 'NYC',
          // missing arrival
          departDate: '2024-12-25',
          passengers: 1,
          tripType: 'oneway',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/flights/trending', () => {
    it('should return trending routes', async () => {
      const response = await request(app).get('/api/flights/trending');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.routes).toBeDefined();
      expect(Array.isArray(response.body.data.routes)).toBe(true);
    });
  });

  describe('GET /api/flights/price-history/:from/:to', () => {
    it('should return price history for a route', async () => {
      const response = await request(app).get('/api/flights/price-history/NYC/LAX');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.history).toBeDefined();
      expect(Array.isArray(response.body.data.history)).toBe(true);
    });

    it('should include date and price in history', async () => {
      const response = await request(app).get('/api/flights/price-history/NYC/LAX');

      expect(response.status).toBe(200);
      if (response.body.data.history.length > 0) {
        const entry = response.body.data.history[0];
        expect(entry.date).toBeDefined();
        expect(entry.price).toBeDefined();
      }
    });
  });

  describe('GET /api/flights/:id', () => {
    it('should return flight details', async () => {
      const response = await request(app).get('/api/flights/flight-123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.flight).toBeDefined();
      expect(response.body.data.flight.id).toBe('flight-123');
    });

    it('should include flight information', async () => {
      const response = await request(app).get('/api/flights/flight-123');

      expect(response.status).toBe(200);
      const flight = response.body.data.flight;
      expect(flight.departure).toBeDefined();
      expect(flight.arrival).toBeDefined();
      expect(flight.price).toBeDefined();
      expect(flight.airline).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      const response = await request(app)
        .post('/api/flights/search')
        .send({
          departure: 'NYC',
          arrival: 'LAX',
          departDate: '2024-12-25',
          passengers: 0, // Invalid
          tripType: 'oneway',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBeDefined();
    });
  });
});
