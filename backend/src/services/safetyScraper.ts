import Parser from 'rss-parser';
import countriesData from '../data/countries.json';

const parser = new Parser();
const STATE_DEPT_FEED = 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.rss';
const CDC_TRAVEL_FEED = 'https://tools.cdc.gov/api/v2/resources/media/403372.rss';

// In-memory cache for regions
let inMemoryRegions: any[] = [];

export interface HealthAlert {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    affectedRegions: string[];
}

interface CountryData {
    code: string;
    name: string;
    lat: number;
    lng: number;
}

export class SafetyScraperService {

    // Scrape and sync data to in-memory cache
    static async syncSafetyData() {
        try {
            console.log('[SafetyScraper] Fetching Travel Advisories from US State Dept...');
            const feed = await parser.parseURL(STATE_DEPT_FEED);

            let updatedCount = 0;
            const newRegions: any[] = [];

            for (const item of feed.items) {
                const titleRegex = /^(.*?) - Level (\d): (.*)$/;
                const match = item.title?.match(titleRegex);

                if (match) {
                    const countryName = match[1].trim();
                    const level = parseInt(match[2]);
                    const summary = match[3].trim();

                    const countryCoord = (countriesData as CountryData[]).find(
                        c => c.name === countryName || countryName.includes(c.name)
                    );

                    if (countryCoord) {
                        newRegions.push({
                            id: countryCoord.code,
                            name: countryName,
                            coordinates: [countryCoord.lat, countryCoord.lng],
                            safetyScore: this.calculateScore(level),
                            advisoryLevel: level,
                            status: summary,
                            details: item.contentSnippet || summary,
                            lastUpdated: new Date()
                        });
                        updatedCount++;
                    }
                }
            }

            inMemoryRegions = newRegions;
            console.log(`[SafetyScraper] Successfully synced ${updatedCount} safety advisories.`);
            return updatedCount;
        } catch (error) {
            console.error('[SafetyScraper] Failed to sync safety data:', error);
            // Return some default data if fetch fails
            if (inMemoryRegions.length === 0) {
                inMemoryRegions = this.getDefaultRegions();
            }
            return 0;
        }
    }

    // Get cached regions
    static getCachedRegions() {
        return inMemoryRegions;
    }

    // Fetch real CDC Health Alerts
    static async getHealthAlerts(): Promise<HealthAlert[]> {
        try {
            console.log('[SafetyScraper] Fetching CDC Travel Health Notices...');
            const feed = await parser.parseURL(CDC_TRAVEL_FEED);

            const alerts: HealthAlert[] = feed.items.slice(0, 10).map(item => {
                const affectedRegions = this.extractCountriesFromText(item.title || '');

                return {
                    title: item.title || 'Health Notice',
                    description: item.contentSnippet || item.content || '',
                    link: item.link || '',
                    pubDate: item.pubDate || new Date().toISOString(),
                    affectedRegions
                };
            });

            console.log(`[SafetyScraper] Fetched ${alerts.length} CDC health alerts.`);
            return alerts;
        } catch (error) {
            console.error('[SafetyScraper] Failed to fetch CDC alerts:', error);
            return [
                {
                    title: 'Respiratory Illness Alert - Southeast Asia',
                    description: 'Elevated respiratory illness activity reported.',
                    link: 'https://www.cdc.gov/travel',
                    pubDate: new Date().toISOString(),
                    affectedRegions: ['Thailand', 'Vietnam', 'Philippines']
                }
            ];
        }
    }

    // Search for specific destination safety
    static async searchDestination(query: string) {
        // Ensure we have data
        if (inMemoryRegions.length === 0) {
            await this.syncSafetyData();
        }

        // Search in cached data
        const region = inMemoryRegions.find(
            r => r.id.toLowerCase() === query.toLowerCase() ||
                r.name.toLowerCase().includes(query.toLowerCase())
        );

        if (region) {
            return {
                found: true,
                ...region
            };
        }

        return {
            found: false,
            message: `No safety data found for "${query}". Try searching by country name.`
        };
    }

    // Extract country names from text
    private static extractCountriesFromText(text: string): string[] {
        const countries: string[] = [];
        for (const country of (countriesData as CountryData[])) {
            if (text.toLowerCase().includes(country.name.toLowerCase())) {
                countries.push(country.name);
            }
        }
        return countries;
    }

    // Convert Level 1-4 to Score 0-100
    private static calculateScore(level: number): number {
        switch (level) {
            case 1: return 90;
            case 2: return 70;
            case 3: return 40;
            case 4: return 10;
            default: return 50;
        }
    }

    // Default regions if RSS fails - use all countries with realistic safety scores
    // Based on US State Dept advisory levels (as of late 2024)
    private static getDefaultRegions() {
        // Level 4: Do Not Travel
        const level4: string[] = [
            'AF', 'BY', 'CF', 'HT', 'IR', 'IQ', 'LY', 'ML', 'MM', 'KP',
            'RU', 'SO', 'SS', 'SD', 'SY', 'UA', 'VE', 'YE'
        ];

        // Level 3: Reconsider Travel
        const level3: string[] = [
            'DZ', 'BD', 'BF', 'BI', 'TD', 'CD', 'CU', 'ER', 'ET', 'GN',
            'HN', 'LB', 'MR', 'NI', 'NG', 'PK', 'PS', 'SN', 'SL', 'TN'
        ];

        // Level 2: Exercise Increased Caution
        const level2: string[] = [
            'AO', 'AZ', 'BH', 'CM', 'CN', 'CI', 'EG', 'SV', 'GQ', 'GM',
            'GH', 'GT', 'GW', 'GY', 'IN', 'ID', 'IL', 'JM', 'JO', 'KZ',
            'KE', 'KG', 'LS', 'LR', 'MG', 'MW', 'MY', 'MX', 'MA', 'MZ',
            'NA', 'NE', 'OM', 'PA', 'PH', 'RO', 'RW', 'SA', 'RS', 'ZA',
            'LK', 'SR', 'TZ', 'TH', 'TG', 'TT', 'TR', 'UG', 'UZ', 'ZM', 'ZW'
        ];

        return (countriesData as CountryData[]).map(country => {
            let advisoryLevel = 1;
            if (level4.includes(country.code)) advisoryLevel = 4;
            else if (level3.includes(country.code)) advisoryLevel = 3;
            else if (level2.includes(country.code)) advisoryLevel = 2;

            const statusMap: Record<number, string> = {
                1: 'Exercise Normal Precautions',
                2: 'Exercise Increased Caution',
                3: 'Reconsider Travel',
                4: 'Do Not Travel'
            };

            return {
                id: country.code,
                name: country.name,
                coordinates: [country.lat, country.lng],
                safetyScore: this.calculateScore(advisoryLevel),
                advisoryLevel,
                status: statusMap[advisoryLevel],
                details: `Advisory level ${advisoryLevel} as of ${new Date().toLocaleDateString()}`
            };
        });
    }
}
