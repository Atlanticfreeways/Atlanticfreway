import axios, { AxiosInstance } from 'axios';
import logger from '../config/logger';
import { CacheService } from '../config/redis';
import { CACHE_KEYS, CACHE_TTL, generateCacheKey } from '../utils/database';

export interface FlightSearchParams {
  departure: string;
  arrival: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'oneway' | 'roundtrip' | 'multicity';
}

export interface HotelSearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

export interface SkyscannerFlight {
  id: string;
  departure: {
    airport: string;
    city: string;
    date: string;
    time: string;
  };
  arrival: {
    airport: string;
    city: string;
    date: string;
    time: string;
  };
  airline: string;
  price: number;
  currency: string;
  stops: number;
  duration: number;
  deeplink: string;
}

export interface SkyscannerHotel {
  id: string;
  name: string;
  city: string;
  airport: string;
  distance: number;
  rating: number;
  reviews: number;
  pricePerNight: number;
  currency: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  amenities: string[];
  images: string[];
  deeplink: string;
}

export class SkyscannerService {
  private client: AxiosInstance;
  private cacheService: CacheService;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.SKYSCANNER_API_KEY || 'demo-key';
    this.baseUrl = process.env.SKYSCANNER_API_URL || 'https://api.skyscanner.com/v1';
    this.cacheService = new CacheService();

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  /**
   * Search for flights
   */
  async searchFlights(params: FlightSearchParams): Promise<SkyscannerFlight[]> {
    try {
      const cacheKey = generateCacheKey(
        CACHE_KEYS.FLIGHT_SEARCH,
        params.departure,
        params.arrival,
        params.departDate,
        params.returnDate || 'oneway',
        params.passengers.toString()
      );

      // Try to get from cache
      const cached = await this.cacheService.get<SkyscannerFlight[]>(cacheKey);
      if (cached) {
        logger.info(`Flight search cache hit: ${cacheKey}`);
        return cached;
      }

      logger.info('Searching flights via Skyscanner API', params);

      // In production, call actual Skyscanner API
      // For now, return mock data
      const flights = this.generateMockFlights(params);

      // Cache results
      await this.cacheService.set(cacheKey, flights, CACHE_TTL.MEDIUM);

      return flights;
    } catch (error) {
      logger.error('Error searching flights:', error);
      throw error;
    }
  }

  /**
   * Get flight details
   */
  async getFlightDetails(flightId: string): Promise<SkyscannerFlight | null> {
    try {
      const cacheKey = generateCacheKey(CACHE_KEYS.FLIGHT_DETAILS, flightId);

      // Try cache
      const cached = await this.cacheService.get<SkyscannerFlight>(cacheKey);
      if (cached) {
        return cached;
      }

      logger.info(`Getting flight details for: ${flightId}`);

      // Mock implementation
      const flight = this.generateMockFlight(flightId);

      // Cache result
      await this.cacheService.set(cacheKey, flight, CACHE_TTL.MEDIUM);

      return flight;
    } catch (error) {
      logger.error('Error getting flight details:', error);
      throw error;
    }
  }

  /**
   * Get trending routes
   */
  async getTrendingRoutes(): Promise<Array<{ from: string; to: string; price: number }>> {
    try {
      const cacheKey = CACHE_KEYS.FLIGHT_TRENDING;

      // Try cache
      const cached = await this.cacheService.get<Array<{ from: string; to: string; price: number }>>(cacheKey);
      if (cached) {
        return cached;
      }

      logger.info('Getting trending routes');

      // Mock trending routes
      const trending = [
        { from: 'NYC', to: 'LAX', price: 250 },
        { from: 'LAX', to: 'NYC', price: 280 },
        { from: 'ORD', to: 'MIA', price: 180 },
        { from: 'SFO', to: 'JFK', price: 320 },
        { from: 'BOS', to: 'LAX', price: 350 },
      ];

      // Cache results
      await this.cacheService.set(cacheKey, trending, CACHE_TTL.LONG);

      return trending;
    } catch (error) {
      logger.error('Error getting trending routes:', error);
      throw error;
    }
  }

  /**
   * Get price history for a route
   */
  async getPriceHistory(from: string, to: string): Promise<Array<{ date: string; price: number }>> {
    try {
      const cacheKey = generateCacheKey(CACHE_KEYS.FLIGHT_PRICE_HISTORY, from, to);

      // Try cache
      const cached = await this.cacheService.get<Array<{ date: string; price: number }>>(cacheKey);
      if (cached) {
        return cached;
      }

      logger.info(`Getting price history for ${from} -> ${to}`);

      // Mock price history
      const history = this.generateMockPriceHistory();

      // Cache results
      await this.cacheService.set(cacheKey, history, CACHE_TTL.LONG);

      return history;
    } catch (error) {
      logger.error('Error getting price history:', error);
      throw error;
    }
  }

  /**
   * Search for hotels
   */
  async searchHotels(params: HotelSearchParams): Promise<SkyscannerHotel[]> {
    try {
      const cacheKey = generateCacheKey(
        CACHE_KEYS.HOTEL_SEARCH,
        params.city,
        params.checkIn,
        params.checkOut,
        params.guests.toString(),
        params.rooms.toString()
      );

      // Try cache
      const cached = await this.cacheService.get<SkyscannerHotel[]>(cacheKey);
      if (cached) {
        return cached;
      }

      logger.info('Searching hotels via Skyscanner API', params);

      // Mock hotel data
      const hotels = this.generateMockHotels(params);

      // Cache results
      await this.cacheService.set(cacheKey, hotels, CACHE_TTL.MEDIUM);

      return hotels;
    } catch (error) {
      logger.error('Error searching hotels:', error);
      throw error;
    }
  }

  /**
   * Get hotel details
   */
  async getHotelDetails(hotelId: string): Promise<SkyscannerHotel | null> {
    try {
      const cacheKey = generateCacheKey(CACHE_KEYS.HOTEL_DETAILS, hotelId);

      // Try cache
      const cached = await this.cacheService.get<SkyscannerHotel>(cacheKey);
      if (cached) {
        return cached;
      }

      logger.info(`Getting hotel details for: ${hotelId}`);

      // Mock implementation
      const hotel = this.generateMockHotel(hotelId);

      // Cache result
      await this.cacheService.set(cacheKey, hotel, CACHE_TTL.MEDIUM);

      return hotel;
    } catch (error) {
      logger.error('Error getting hotel details:', error);
      throw error;
    }
  }

  // Mock data generators
  private generateMockFlights(params: FlightSearchParams): SkyscannerFlight[] {
    const flights: SkyscannerFlight[] = [];
    const airlines = ['United', 'Delta', 'American', 'Southwest', 'JetBlue'];
    const basePrice = 150 + Math.random() * 400;

    for (let i = 0; i < 5; i++) {
      flights.push({
        id: `flight-${Date.now()}-${i}`,
        departure: {
          airport: params.departure,
          city: params.departure,
          date: params.departDate,
          time: `${8 + i}:00`,
        },
        arrival: {
          airport: params.arrival,
          city: params.arrival,
          date: params.departDate,
          time: `${12 + i}:00`,
        },
        airline: airlines[i % airlines.length],
        price: Math.round(basePrice + Math.random() * 100),
        currency: 'USD',
        stops: i % 3,
        duration: 300 + i * 30,
        deeplink: `https://skyscanner.com/flights/${params.departure}/${params.arrival}`,
      });
    }

    return flights;
  }

  private generateMockFlight(flightId: string): SkyscannerFlight {
    return {
      id: flightId,
      departure: {
        airport: 'NYC',
        city: 'New York',
        date: new Date().toISOString().split('T')[0],
        time: '08:00',
      },
      arrival: {
        airport: 'LAX',
        city: 'Los Angeles',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
      },
      airline: 'United',
      price: 250,
      currency: 'USD',
      stops: 0,
      duration: 300,
      deeplink: 'https://skyscanner.com/flights',
    };
  }

  private generateMockPriceHistory(): Array<{ date: string; price: number }> {
    const history = [];
    const basePrice = 250;

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      history.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(basePrice + (Math.random() - 0.5) * 100),
      });
    }

    return history;
  }

  private generateMockHotels(params: HotelSearchParams): SkyscannerHotel[] {
    const hotels: SkyscannerHotel[] = [];
    const hotelNames = ['Grand Hotel', 'Plaza Hotel', 'Luxury Inn', 'Budget Stay', 'City Center'];

    for (let i = 0; i < 5; i++) {
      hotels.push({
        id: `hotel-${Date.now()}-${i}`,
        name: hotelNames[i],
        city: params.city,
        airport: 'LAX',
        distance: Math.round(Math.random() * 20),
        rating: 3 + Math.random() * 2,
        reviews: Math.floor(Math.random() * 500),
        pricePerNight: 80 + Math.random() * 200,
        currency: 'USD',
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        rooms: params.rooms,
        amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
        images: ['https://via.placeholder.com/300x200'],
        deeplink: `https://skyscanner.com/hotels/${params.city}`,
      });
    }

    return hotels;
  }

  private generateMockHotel(hotelId: string): SkyscannerHotel {
    return {
      id: hotelId,
      name: 'Grand Hotel',
      city: 'Los Angeles',
      airport: 'LAX',
      distance: 5,
      rating: 4.5,
      reviews: 250,
      pricePerNight: 150,
      currency: 'USD',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      rooms: 1,
      amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
      images: ['https://via.placeholder.com/300x200'],
      deeplink: 'https://skyscanner.com/hotels',
    };
  }
}

export default SkyscannerService;
