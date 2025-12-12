import { Request, Response } from 'express';
import { SafetyService } from '../services/safetyService';
import { SafetyScraperService } from '../services/safetyScraper';

export class SafetyController {
    static async getGlobalStatus(_req: Request, res: Response) {
        try {
            const stats = await SafetyService.getGlobalStats();
            return res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('[SafetyController] getGlobalStatus error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch safety status' });
        }
    }

    static async getMapData(_req: Request, res: Response) {
        try {
            const data = await SafetyService.getMapData();
            return res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error('[SafetyController] getMapData error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch map data' });
        }
    }

    static async getDestinationSafety(req: Request, res: Response) {
        try {
            const { countryCode } = req.params;
            const data = await SafetyService.getDestinationSafety(countryCode);

            return res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error('[SafetyController] getDestinationSafety error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch destination safety' });
        }
    }

    // Search for destination safety
    static async searchDestination(req: Request, res: Response) {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({ success: false, message: 'Query parameter required' });
            }

            const result = await SafetyScraperService.searchDestination(query);
            return res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('[SafetyController] searchDestination error:', error);
            return res.status(500).json({ success: false, message: 'Search failed' });
        }
    }

    // Get health alerts
    static async getHealthAlerts(_req: Request, res: Response) {
        try {
            const alerts = await SafetyScraperService.getHealthAlerts();
            return res.json({
                success: true,
                data: alerts
            });
        } catch (error) {
            console.error('[SafetyController] getHealthAlerts error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch health alerts' });
        }
    }

    // Force refresh safety data
    static async refreshData(_req: Request, res: Response) {
        try {
            const result = await SafetyService.refreshAllData();
            return res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('[SafetyController] refreshData error:', error);
            return res.status(500).json({ success: false, message: 'Failed to refresh data' });
        }
    }
}
