import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Warning as AlertTriangle, Pulse as Activity, MapTrifold as Map, Spinner as Loader2, MagnifyingGlass, Heartbeat, X, CheckCircle, XCircle } from '@phosphor-icons/react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getSafetyStatus, getSafetyMapData, searchSafety } from '../services/api';

// Component to fly to a location on the map
const MapFlyTo = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        if (center[0] !== 0 || center[1] !== 0) {
            map.flyTo(center, zoom, { duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
};

const SafetyPage = () => {
    const [status, setStatus] = useState<any>(null);
    const [mapData, setMapData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [searching, setSearching] = useState(false);
    const [flyToCenter, setFlyToCenter] = useState<[number, number]>([20, 0]);
    const [flyToZoom, setFlyToZoom] = useState(2);

    useEffect(() => {
        const fetchData = async () => {
            const [statusData, mapDataRes] = await Promise.all([
                getSafetyStatus(),
                getSafetyMapData()
            ]);
            setStatus(statusData);
            setMapData(mapDataRes);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        const result = await searchSafety(searchQuery);
        setSearchResult(result);
        setSearching(false);

        // If found, fly to the location on map
        if (result?.found && result?.coordinates) {
            setFlyToCenter([result.coordinates[0], result.coordinates[1]]);
            setFlyToZoom(5);
        }
    };

    const clearSearch = () => {
        setSearchResult(null);
        setSearchQuery('');
        setFlyToCenter([20, 0]);
        setFlyToZoom(2);
    };

    const getColor = (score: number) => {
        if (score >= 80) return '#10b981'; // Emerald
        if (score >= 50) return '#f59e0b'; // Amber
        return '#ef4444'; // Red
    };

    const getAdvisoryBadge = (level: number) => {
        switch (level) {
            case 1: return { text: 'Level 1: Normal', color: 'bg-emerald-500' };
            case 2: return { text: 'Level 2: Caution', color: 'bg-yellow-500' };
            case 3: return { text: 'Level 3: Reconsider', color: 'bg-orange-500' };
            case 4: return { text: 'Level 4: Do Not Travel', color: 'bg-red-500' };
            default: return { text: 'Unknown', color: 'bg-gray-500' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text-primary pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        Global <span className="text-gradient">Travel Safety</span> Intelligence
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        Real-time risk assessment, health advisories, and political stability scores powered by US State Dept and CDC data.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-gray-400">
                                <MagnifyingGlass className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search destination (e.g., Japan, Paris, UK...)"
                                className="w-full pl-12 pr-32 py-4 bg-surface border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={searching}
                                className="absolute right-2 px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Search Result Card */}
                <AnimatePresence>
                    {searchResult && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 max-w-2xl mx-auto"
                        >
                            <div className={`glass-card p-6 rounded-2xl border-l-4 ${searchResult.found ? 'border-l-primary' : 'border-l-gray-500'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        {searchResult.found ? (
                                            <>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-bold text-white">{searchResult.name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getAdvisoryBadge(searchResult.advisoryLevel).color}`}>
                                                        {getAdvisoryBadge(searchResult.advisoryLevel).text}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="text-4xl font-bold" style={{ color: getColor(searchResult.safetyScore) }}>
                                                        {searchResult.safetyScore}
                                                        <span className="text-lg text-gray-400">/100</span>
                                                    </div>
                                                    {searchResult.safetyScore >= 70 ? (
                                                        <CheckCircle className="w-8 h-8 text-emerald-500" weight="fill" />
                                                    ) : (
                                                        <XCircle className="w-8 h-8 text-red-500" weight="fill" />
                                                    )}
                                                </div>
                                                <p className="text-gray-300 mb-2"><strong>Status:</strong> {searchResult.status}</p>
                                                <p className="text-gray-400 text-sm">{searchResult.details}</p>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <AlertTriangle className="w-6 h-6" />
                                                <p>{searchResult.message || 'No data found for this destination.'}</p>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={clearSearch} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Security Level Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Global Status</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{status.globalStatus}</h3>
                                <p className="text-sm text-gray-500 mt-1">{status.totalRegions} regions tracked</p>
                            </div>
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                <Shield className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">Average global safety score: <span className="text-white font-bold">{status.globalScore || 70}/100</span></p>
                    </motion.div>

                    {/* Health Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Health Alerts</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{status.healthAlerts} Active</h3>
                            </div>
                            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                                <Heartbeat className="w-6 h-6" />
                            </div>
                        </div>
                        {status.healthAlertsList && status.healthAlertsList.length > 0 && (
                            <div className="space-y-2">
                                {status.healthAlertsList.slice(0, 2).map((alert: any, i: number) => (
                                    <p key={i} className="text-xs text-gray-400 truncate">• {alert.title}</p>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Alerts Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 rounded-2xl border-l-4 border-l-red-500"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">High Risk Regions</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{status.activeAdvisories} Advisories</h3>
                            </div>
                            <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                        </div>
                        {status.topRiskyRegions && status.topRiskyRegions.length > 0 && (
                            <div className="space-y-1">
                                {status.topRiskyRegions.slice(0, 3).map((region: any, i: number) => (
                                    <p key={i} className="text-xs text-gray-400">• {region.name} (Level {region.level})</p>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Interactive Map */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-3xl overflow-hidden h-[600px] relative z-0 border border-white/10"
                >
                    <MapContainer
                        center={[20, 0]}
                        zoom={2}
                        scrollWheelZoom={false}
                        style={{ height: '100%', width: '100%', background: '#0f172a' }}
                        zoomControl={false}
                    >
                        {/* Dark Mode Tiles */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        <ZoomControl position="bottomright" />
                        <MapFlyTo center={flyToCenter} zoom={flyToZoom} />

                        {mapData.map((region) => (
                            <CircleMarker
                                key={region.id}
                                center={region.coordinates}
                                radius={10}
                                pathOptions={{
                                    color: getColor(region.safetyScore),
                                    fillColor: getColor(region.safetyScore),
                                    fillOpacity: 0.6
                                }}
                            >
                                <Popup className="glass-popup">
                                    <div className="p-2 min-w-[200px]">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg text-slate-800">{region.name}</h3>
                                            <span className="font-bold px-2 py-0.5 rounded text-white text-xs" style={{ background: getColor(region.safetyScore) }}>
                                                {region.safetyScore}/100
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-600 uppercase mb-1">{region.status}</p>
                                        <p className="text-sm text-slate-600">{region.details}</p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>

                    {/* Overlay Legend */}
                    <div className="absolute bottom-6 left-6 z-[1000] glass-card p-4 rounded-xl border border-white/10">
                        <h4 className="text-white font-bold mb-2">Safety Legend</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-xs text-gray-300">Safe (80-100)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-xs text-gray-300">Exercise Caution (50-79)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-xs text-gray-300">High Risk (0-49)</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SafetyPage;
