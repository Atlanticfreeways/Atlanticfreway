import { Request, Response } from 'express';
import SkyscannerService from '../services/skyscannerService';
import { FlightSearchInput } from '../utils/validation';
import { parsePaginationParams, paginateResults } from '../utils/pagination';
import logger from '../config/logger';

const skyscannerService = new SkyscannerService();

export class FlightController {
  /**
   * Search flights
   */
  static async searchFlights(req: Request, res: Response): Promise<void> {
    try {
      const params = req.body as FlightSearchInput;
      const { page, limit } = parsePaginationParams(req.query);

      // Extract filter and sort parameters
      const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
      const maxStops = req.query.maxStops ? parseInt(req.query.maxStops as string) : undefined;
      const airlines = req.query.airlines ? (req.query.airlines as string).split(',') : undefined;
      const sortBy = (req.query.sortBy as string) || 'price';
      const sortOrder = (req.query.sortOrder as string) || 'asc';

      logger.info('Flight search request', { params, filters: { minPrice, maxPrice, maxStops, airlines } });

      let flights = await skyscannerService.searchFlights(params);

      // Apply filters and sorting
      const { filterAndSortFlights } = require('../utils/flightFilters');
      flights = filterAndSortFlights(
        flights,
        { minPrice, maxPrice, maxStops, airlines },
        sortBy as any,
        sortOrder as any
      );

      const paginated = paginateResults(flights, page, limit);

      res.json({
        success: true,
        data: {
          flights: paginated.data,
          count: paginated.data.length,
          searchParams: params,
        },
        pagination: paginated.pagination,
      });
    } catch (error: any) {
      logger.error('Flight search error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'FLIGHT_SEARCH_FAILED',
          message: error.message || 'Failed to search flights',
        },
      });
    }
  }

  /**
   * Get flight details
   */
  static async getFlightDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      logger.info(`Getting flight details for: ${id}`);

      const flight = await skyscannerService.getFlightDetails(id);

      if (!flight) {
        res.status(404).json({
          success: false,
          error: {
            code: 'FLIGHT_NOT_FOUND',
            message: 'Flight not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: { flight },
      });
    } catch (error: any) {
      logger.error('Get flight details error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_FLIGHT_FAILED',
          message: error.message || 'Failed to get flight details',
        },
      });
    }
  }

  /**
   * Get trending routes
   */
  static async getTrendingRoutes(_req: Request, res: Response): Promise<void> {
    try {
      logger.info('Getting trending routes');

      const routes = await skyscannerService.getTrendingRoutes();

      res.json({
        success: true,
        data: {
          routes,
          count: routes.length,
        },
      });
    } catch (error: any) {
      logger.error('Get trending routes error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'TRENDING_ROUTES_FAILED',
          message: error.message || 'Failed to get trending routes',
        },
      });
    }
  }

  /**
   * Get price history
   */
  static async getPriceHistory(req: Request, res: Response): Promise<void> {
    try {
      const { from, to } = req.params;

      logger.info(`Getting price history for ${from} -> ${to}`);

      const history = await skyscannerService.getPriceHistory(from, to);

      res.json({
        success: true,
        data: {
          route: { from, to },
          history,
          count: history.length,
        },
      });
    } catch (error: any) {
      logger.error('Get price history error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'PRICE_HISTORY_FAILED',
          message: error.message || 'Failed to get price history',
        },
      });
    }
  }
}

export default FlightController;
