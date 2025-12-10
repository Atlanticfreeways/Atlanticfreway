import { Request, Response } from 'express';
import SkyscannerService from '../services/skyscannerService';
import { HotelSearchInput } from '../utils/validation';
import logger from '../config/logger';

const skyscannerService = new SkyscannerService();

export class HotelController {
  /**
   * Search hotels
   */
  static async searchHotels(req: Request, res: Response): Promise<void> {
    try {
      const params = req.body as HotelSearchInput;

      logger.info('Hotel search request', params);

      const hotels = await skyscannerService.searchHotels(params);

      res.json({
        success: true,
        data: {
          hotels,
          count: hotels.length,
          searchParams: params,
        },
      });
    } catch (error: any) {
      logger.error('Hotel search error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'HOTEL_SEARCH_FAILED',
          message: error.message || 'Failed to search hotels',
        },
      });
    }
  }

  /**
   * Get hotel details
   */
  static async getHotelDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      logger.info(`Getting hotel details for: ${id}`);

      const hotel = await skyscannerService.getHotelDetails(id);

      if (!hotel) {
        res.status(404).json({
          success: false,
          error: {
            code: 'HOTEL_NOT_FOUND',
            message: 'Hotel not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: { hotel },
      });
    } catch (error: any) {
      logger.error('Get hotel details error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_HOTEL_FAILED',
          message: error.message || 'Failed to get hotel details',
        },
      });
    }
  }

  /**
   * Get hotels near airport
   */
  static async getHotelsNearAirport(req: Request, res: Response): Promise<void> {
    try {
      const { airport } = req.params;

      logger.info(`Getting hotels near airport: ${airport}`);

      // Mock implementation - in production, query database
      const hotels = await skyscannerService.searchHotels({
        city: airport,
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        guests: 1,
        rooms: 1,
      });

      res.json({
        success: true,
        data: {
          airport,
          hotels,
          count: hotels.length,
        },
      });
    } catch (error: any) {
      logger.error('Get hotels near airport error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'HOTELS_NEAR_AIRPORT_FAILED',
          message: error.message || 'Failed to get hotels near airport',
        },
      });
    }
  }
}

export default HotelController;
