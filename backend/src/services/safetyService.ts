import { SafetyScraperService } from './safetyScraper';

// In-memory cache for when MongoDB is unavailable
let cachedMapData: any[] = [];
let cachedStats: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class SafetyService {

    static async getGlobalStats() {
        // Check if we need to refresh cache
        if (!cachedStats || Date.now() - lastFetchTime > CACHE_TTL) {
            await this.refreshCache();
        }

        return cachedStats || {
            globalStatus: 'Normal Activity',
            globalScore: 75,
            activeAdvisories: 0,
            totalRegions: 0,
            healthAlerts: 0,
            healthAlertsList: [],
            topRiskyRegions: []
        };
    }

    static async getMapData() {
        // Check if we need to refresh cache
        if (cachedMapData.length === 0 || Date.now() - lastFetchTime > CACHE_TTL) {
            await this.refreshCache();
        }

        return cachedMapData;
    }

    static async getDestinationSafety(countryCode: string) {
        // Search in cached data first
        if (cachedMapData.length === 0) {
            await this.refreshCache();
        }

        const region = cachedMapData.find(
            r => r.id === countryCode.toUpperCase() ||
                r.name.toLowerCase().includes(countryCode.toLowerCase())
        );

        if (region) {
            return {
                found: true,
                id: region.id,
                name: region.name,
                coordinates: region.coordinates,
                safetyScore: region.safetyScore,
                status: region.status,
                details: region.details,
                advisoryLevel: region.advisoryLevel
            };
        }

        // Try live search
        const searchResult = await SafetyScraperService.searchDestination(countryCode);
        return searchResult;
    }

    // Get safety score for a city/country (used by flight search)
    static async getSafetyScoreForDestination(destination: string): Promise<number> {
        const searchResult = await SafetyScraperService.searchDestination(destination);
        if (searchResult.found && 'safetyScore' in searchResult && searchResult.safetyScore !== undefined) {
            return searchResult.safetyScore as number;
        }
        return 70; // Default moderate score if unknown
    }

    // Refresh cache from RSS feeds
    static async refreshCache() {
        console.log('[SafetyService] Refreshing cache from RSS feeds...');

        try {
            // Sync safety data
            await SafetyScraperService.syncSafetyData();

            // Get health alerts
            const healthAlerts = await SafetyScraperService.getHealthAlerts();

            // Build map data from in-memory cache in the scraper
            cachedMapData = SafetyScraperService.getCachedRegions();

            // Calculate stats
            const riskyRegions = cachedMapData.filter(r => r.advisoryLevel >= 3);
            const avgScore = cachedMapData.length > 0
                ? cachedMapData.reduce((sum, r) => sum + r.safetyScore, 0) / cachedMapData.length
                : 70;

            let globalStatus = 'Normal Activity';
            if (avgScore < 50) globalStatus = 'Elevated Alerts';
            if (avgScore < 30) globalStatus = 'High Alert';

            cachedStats = {
                globalStatus,
                globalScore: Math.round(avgScore),
                activeAdvisories: riskyRegions.length,
                totalRegions: cachedMapData.length,
                healthAlerts: healthAlerts.length,
                healthAlertsList: healthAlerts.slice(0, 5),
                topRiskyRegions: riskyRegions.slice(0, 5).map(r => ({ name: r.name, level: r.advisoryLevel }))
            };

            lastFetchTime = Date.now();
            console.log(`[SafetyService] Cache refreshed. ${cachedMapData.length} regions loaded.`);
        } catch (error) {
            console.error('[SafetyService] Cache refresh failed:', error);
        }
    }

    // Force refresh all safety data
    static async refreshAllData() {
        await this.refreshCache();
        return { updated: cachedMapData.length, timestamp: new Date() };
    }
}
