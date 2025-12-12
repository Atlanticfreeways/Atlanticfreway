import { chromium } from 'playwright-core';
// We use playwright-core + local chromium to avoid full browser download overhead if possible, 
// but npx playwright install ensures binary exists.

export class FlightScraperService {

    static async searchFlights(from: string, to: string, date: string) {
        let browser;
        try {
            // Launch browser (headless: true for production, false for debugging)
            browser = await chromium.launch({
                headless: true,
                channel: 'chrome', // Try to use installed chrome if available, or chromium
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for some container envs
            });

            const context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });

            const page = await context.newPage();

            // Construct Google Flights URL
            // Format: https://www.google.com/travel/flights?q=Flights%20to%20LHR%20from%20JFK%20on%202023-12-15
            const query = `Flights to ${to} from ${from} on ${date}`;
            const url = `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;

            console.log(`Scraping URL: ${url}`);

            // Navigate and wait
            await page.goto(url, { waitUntil: 'networkidle' });

            // Google Flights selectors often change (obfuscated classes). 
            // We rely on stable aria-labels or roles where possible, or generic list structures.
            // Strategy: Look for the main list items.

            // Wait for the "Best departing flights" or typical list container
            // The flight cards usually have a specific role or structure.
            // We will try to grab the list items with role="listitem" in the main area.

            // Keep it simple: Wait for ANY price element to indicate load
            try {
                await page.waitForSelector('div[role="main"]', { timeout: 10000 });
            } catch (e) {
                console.log('Timeout waiting for main content. Google might have blocked simple access.');
            }

            // Extract Data
            const flights = await page.evaluate(() => {
                const results: any[] = [];
                // @ts-ignore
                const listItems = Array.from(document.querySelectorAll('div[role="main"] li'));

                listItems.forEach((card: any) => {
                    const text = card.innerText;
                    if (text.includes('$') || text.includes('€') || text.includes('£')) {
                        // Heuristics to parsing
                        const lines = text.split('\n');

                        // Usually: Time, Airline, Duration, Stops, Price
                        // We will try to best-guess fields. 
                        // Note: accurate parsing of Google's complex DOM is hard without robust maintenance.

                        // Mocking extraction logic for demo purpose if selectors fail:
                        // ideally we find specific sub-elements.

                        const priceMatch = text.match(/[$€£]\d+(?:,\d+)?/);
                        const timeMatch = text.match(/\d{1,2}:\d{2} [AP]M/);

                        if (priceMatch) {
                            results.push({
                                raw: text,
                                price: priceMatch[0],
                                time: timeMatch ? timeMatch[0] : 'N/A',
                                airline: lines[0] || 'Unknown Airline'
                            });
                        }
                    }
                });

                return results.slice(0, 10); // Limit to top 10
            });

            console.log(`Found ${flights.length} flights`);
            return flights.map((f, i) => ({
                id: `real-fl-${i}`,
                airline: f.airline || 'Unknown',
                flightNumber: `GF-${i}`, // Google doesn't easily expose flight number in summary
                departure: {
                    airport: from,
                    city: from, // simplified
                    date: date,
                    time: f.time
                },
                arrival: {
                    airport: to,
                    city: to, // simplified
                    date: date,
                    time: 'N/A'
                },
                price: parseInt(f.price.replace(/[^0-9]/g, '')),
                duration: 300, // placeholder
                safetyScore: 90 // Default safety
            }));

        } catch (error) {
            console.error('Playwright Scraping Failed:', error);
            return []; // Return empty to trigger fallback
        } finally {
            if (browser) await browser.close();
        }
    }
}
