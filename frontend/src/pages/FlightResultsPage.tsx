import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchFlights, getDestinationSafety } from '../services/api';
import { Flight } from '../types/flight';
import FlightCard from '../components/flights/FlightCard';
import PriceChart from '../components/flights/PriceChart';
import { Spinner as Loader2, WarningCircle as AlertCircle, Shield, Warning } from '@phosphor-icons/react';

const FlightResultsPage = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [destinationSafety, setDestinationSafety] = useState<any>(null);

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            setError(null);
            try {
                const from = searchParams.get('from') || '';
                const to = searchParams.get('to') || '';
                const departDate = searchParams.get('departDate') || '';

                // Fetch flights and destination safety in parallel
                const [response, safety] = await Promise.all([
                    searchFlights({
                        from,
                        to,
                        departDate,
                        travelers: parseInt(searchParams.get('travelers') || '1'),
                        class: 'economy',
                    }),
                    getDestinationSafety(to)
                ]);

                setFlights(response.flights);
                setDestinationSafety(safety);
            } catch (err) {
                setError('Failed to load flights. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchParams]);

    const getSafetyColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 50) return 'text-amber-400';
        return 'text-red-400';
    };

    const getSafetyBg = (score: number) => {
        if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/30';
        if (score >= 50) return 'bg-amber-500/10 border-amber-500/30';
        return 'bg-red-500/10 border-red-500/30';
    };

    const getSafetyText = (score: number) => {
        if (score >= 80) return 'Low Risk';
        if (score >= 50) return 'Moderate Risk';
        return 'High Risk';
    };

    return (
        <div className="min-h-screen bg-background text-text-primary">

            <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Flights from <span className="text-primary">{searchParams.get('from') || 'London'}</span> to <span className="text-primary">{searchParams.get('to') || 'New York'}</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="text-gray-400">
                            {flights.length} results found
                        </p>

                        {/* Destination Safety Badge */}
                        {destinationSafety && destinationSafety.safetyScore && (
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getSafetyBg(destinationSafety.safetyScore)}`}>
                                {destinationSafety.safetyScore >= 50 ? (
                                    <Shield className={`w-4 h-4 ${getSafetyColor(destinationSafety.safetyScore)}`} weight="fill" />
                                ) : (
                                    <Warning className={`w-4 h-4 ${getSafetyColor(destinationSafety.safetyScore)}`} weight="fill" />
                                )}
                                <span className={`text-sm font-medium ${getSafetyColor(destinationSafety.safetyScore)}`}>
                                    {getSafetyText(destinationSafety.safetyScore)} • {destinationSafety.safetyScore}/100
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Safety Details Dropdown */}
                    {destinationSafety && destinationSafety.found && (
                        <div className="mt-4 p-4 glass-card rounded-xl border border-white/5">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${getSafetyBg(destinationSafety.safetyScore)}`}>
                                    <Shield className={`w-6 h-6 ${getSafetyColor(destinationSafety.safetyScore)}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold">{destinationSafety.name} Travel Advisory</h3>
                                    <p className="text-gray-400 text-sm mt-1">{destinationSafety.status}</p>
                                    {destinationSafety.details && (
                                        <p className="text-gray-500 text-xs mt-2 line-clamp-2">{destinationSafety.details}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="text-gray-400 animate-pulse">Scanning airlines & checking safety protocols...</p>
                    </div>
                ) : error ? (
                    <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
                        <p className="text-gray-400">{error}</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Price History Chart */}
                        <PriceChart />

                        {/* Results */}
                        <div className="grid gap-4">
                            {flights.map((flight, index) => (
                                <FlightCard key={flight.id} flight={flight} index={index} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightResultsPage;
