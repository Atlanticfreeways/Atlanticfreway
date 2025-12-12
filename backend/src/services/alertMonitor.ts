import Booking from '../models/Booking';
import SafetyRegion from '../models/SafetyRegion';
import { NotificationService } from './notificationService';

// Extended city-to-country mapping
const CITY_TO_COUNTRY: Record<string, string> = {
    // Major Airports / Cities
    'LHR': 'GB', 'London': 'GB', 'Heathrow': 'GB', 'Gatwick': 'GB', 'Manchester': 'GB', 'Edinburgh': 'GB',
    'JFK': 'US', 'LAX': 'US', 'New York': 'US', 'Los Angeles': 'US', 'Chicago': 'US', 'Miami': 'US', 'Boston': 'US', 'San Francisco': 'US', 'Seattle': 'US',
    'CDG': 'FR', 'Paris': 'FR', 'Nice': 'FR', 'Lyon': 'FR', 'Marseille': 'FR',
    'FRA': 'DE', 'Frankfurt': 'DE', 'Berlin': 'DE', 'Munich': 'DE', 'Hamburg': 'DE',
    'AMS': 'NL', 'Amsterdam': 'NL', 'Rotterdam': 'NL',
    'DXB': 'AE', 'Dubai': 'AE', 'Abu Dhabi': 'AE',
    'SIN': 'SG', 'Singapore': 'SG',
    'HKG': 'HK', 'Hong Kong': 'HK',
    'NRT': 'JP', 'HND': 'JP', 'Tokyo': 'JP', 'Osaka': 'JP', 'Narita': 'JP',
    'ICN': 'KR', 'Seoul': 'KR', 'Incheon': 'KR',
    'PEK': 'CN', 'Beijing': 'CN', 'Shanghai': 'CN', 'PVG': 'CN',
    'SYD': 'AU', 'Sydney': 'AU', 'Melbourne': 'AU', 'Brisbane': 'AU',
    'DEL': 'IN', 'Delhi': 'IN', 'Mumbai': 'IN', 'BOM': 'IN', 'Bangalore': 'IN',
    'IST': 'TR', 'Istanbul': 'TR', 'Ankara': 'TR',
    'MAD': 'ES', 'Madrid': 'ES', 'Barcelona': 'ES', 'BCN': 'ES',
    'FCO': 'IT', 'Rome': 'IT', 'Milan': 'IT', 'MXP': 'IT', 'Venice': 'IT',
    'ZRH': 'CH', 'Zurich': 'CH', 'Geneva': 'CH',
    'VIE': 'AT', 'Vienna': 'AT',
    'CPH': 'DK', 'Copenhagen': 'DK',
    'ARN': 'SE', 'Stockholm': 'SE',
    'OSL': 'NO', 'Oslo': 'NO',
    'HEL': 'FI', 'Helsinki': 'FI',
    'DUB': 'IE', 'Dublin': 'IE',
    'LIS': 'PT', 'Lisbon': 'PT', 'Porto': 'PT',
    'ATH': 'GR', 'Athens': 'GR',
    'WAW': 'PL', 'Warsaw': 'PL', 'Krakow': 'PL',
    'PRG': 'CZ', 'Prague': 'CZ',
    'BUD': 'HU', 'Budapest': 'HU',
    'KIV': 'UA', 'Kyiv': 'UA', 'Kiev': 'UA',
    'SVO': 'RU', 'Moscow': 'RU', 'St Petersburg': 'RU',
    'TLV': 'IL', 'Tel Aviv': 'IL',
    'CAI': 'EG', 'Cairo': 'EG',
    'JNB': 'ZA', 'Johannesburg': 'ZA', 'Cape Town': 'ZA',
    'NBO': 'KE', 'Nairobi': 'KE',
    'LOS': 'NG', 'Lagos': 'NG', 'Abuja': 'NG',
    'ACC': 'GH', 'Accra': 'GH',
    'CMN': 'MA', 'Casablanca': 'MA', 'Marrakech': 'MA',
    'GRU': 'BR', 'Sao Paulo': 'BR', 'Rio': 'BR', 'GIG': 'BR',
    'EZE': 'AR', 'Buenos Aires': 'AR',
    'SCL': 'CL', 'Santiago': 'CL',
    'LIM': 'PE', 'Lima': 'PE',
    'BOG': 'CO', 'Bogota': 'CO',
    'MEX': 'MX', 'Mexico City': 'MX', 'Cancun': 'MX', 'CUN': 'MX',
    'YYZ': 'CA', 'Toronto': 'CA', 'Vancouver': 'CA', 'YVR': 'CA', 'Montreal': 'CA',
    'BKK': 'TH', 'Bangkok': 'TH', 'Phuket': 'TH',
    'KUL': 'MY', 'Kuala Lumpur': 'MY',
    'CGK': 'ID', 'Jakarta': 'ID', 'Bali': 'ID', 'DPS': 'ID',
    'MNL': 'PH', 'Manila': 'PH',
    'SGN': 'VN', 'Ho Chi Minh': 'VN', 'Hanoi': 'VN', 'HAN': 'VN'
};

export class AlertMonitorService {

    // This runs periodically (e.g. cron job)
    static async checkAllBookings() {
        console.log('🔍 Running Safety Alert Check...');

        // 1. Get all active bookings
        const activeBookings = await Booking.find({ status: 'confirmed' });

        // 2. Scan each booking
        let alertsSent = 0;
        const alertDetails: any[] = [];

        for (const booking of activeBookings) {
            const destinationCode = this.getCountryCode(booking.flightDetails.to);
            if (!destinationCode) {
                console.log(`[AlertMonitor] Could not map destination: ${booking.flightDetails.to}`);
                continue;
            }

            const region = await SafetyRegion.findOne({ countryCode: destinationCode });

            if (region) {
                const currentScore = region.score;
                const bookedScore = booking.safetyScoreSnapshot || 80;

                // Check for significant drop (>10 points) or if now high risk
                const scoreDropped = (bookedScore - currentScore) > 10;
                const nowHighRisk = region.advisoryLevel >= 3;

                if (scoreDropped || nowHighRisk) {
                    try {
                        await NotificationService.sendSafetyAlert(
                            booking.passengerDetails.email,
                            booking.flightDetails.to,
                            bookedScore,
                            currentScore
                        );
                        alertsSent++;
                        alertDetails.push({
                            email: booking.passengerDetails.email,
                            destination: booking.flightDetails.to,
                            previousScore: bookedScore,
                            currentScore,
                            advisoryLevel: region.advisoryLevel
                        });
                    } catch (emailError) {
                        console.error('[AlertMonitor] Failed to send alert:', emailError);
                    }
                }
            }
        }

        console.log(`✅ Safety Check Complete. Sent ${alertsSent} alerts.`);
        return {
            alertsSent,
            totalBookingsChecked: activeBookings.length,
            alertDetails
        };
    }

    static getCountryCode(cityOrCode: string): string | null {
        // Direct lookup
        const directMatch = CITY_TO_COUNTRY[cityOrCode];
        if (directMatch) return directMatch;

        // Case-insensitive search
        const lowerCity = cityOrCode.toLowerCase();
        for (const [key, value] of Object.entries(CITY_TO_COUNTRY)) {
            if (key.toLowerCase() === lowerCity) return value;
        }

        // Partial match (if city contains a known name)
        for (const [key, value] of Object.entries(CITY_TO_COUNTRY)) {
            if (cityOrCode.toLowerCase().includes(key.toLowerCase())) return value;
        }

        return null;
    }
}
