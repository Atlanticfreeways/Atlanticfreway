import { Request, Response } from 'express';

export class HotelController {
  // Hotels feature is currently in development
  // This endpoint returns a message indicating the feature status
  static async searchHotels(_req: Request, res: Response) {
    return res.json({
      success: true,
      message: 'Hotel search integration coming soon. Currently showing featured hotels.',
      data: {
        hotels: [],
        count: 0,
        status: 'coming_soon'
      }
    });
  }
}
