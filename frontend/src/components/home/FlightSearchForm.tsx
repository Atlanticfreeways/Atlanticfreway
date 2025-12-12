import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarBlank as Calendar, MapPin, Users, MagnifyingGlass as Search, ArrowsLeftRight as ArrowRightLeft } from '@phosphor-icons/react';
import clsx from 'clsx';

const FlightSearchForm = () => {
    const navigate = useNavigate();
    const [tripType, setTripType] = useState('round-trip');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [departDate, setDepartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [travelers, setTravelers] = useState(1);

    const handleSearch = () => {
        // Basic validation
        if (!from || !to) return; // Add visual feedback later

        const params = new URLSearchParams({
            from,
            to,
            departDate: departDate || new Date().toISOString().split('T')[0], // Default to today
            returnDate,
            travelers: travelers.toString(),
            tripType
        });

        navigate(`/flights?${params.toString()}`);
    };

    return (
        <div className="glass-card rounded-3xl p-4 md:p-5 w-full text-left relative overflow-hidden group">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Tabs */}
            <div className="flex gap-6 mb-4 relative z-10">
                <button
                    onClick={() => setTripType('round-trip')}
                    className={clsx(
                        'text-sm font-medium transition-colors pb-2 border-b-2',
                        tripType === 'round-trip'
                            ? 'text-white border-primary'
                            : 'text-gray-400 border-transparent hover:text-white'
                    )}
                >
                    Round trip
                </button>
                <button
                    onClick={() => setTripType('one-way')}
                    className={clsx(
                        'text-sm font-medium transition-colors pb-2 border-b-2',
                        tripType === 'one-way'
                            ? 'text-white border-primary'
                            : 'text-gray-400 border-transparent hover:text-white'
                    )}
                >
                    One way
                </button>
                <button
                    onClick={() => setTripType('multi-city')}
                    className={clsx(
                        'text-sm font-medium transition-colors pb-2 border-b-2',
                        tripType === 'multi-city'
                            ? 'text-white border-primary'
                            : 'text-gray-400 border-transparent hover:text-white'
                    )}
                >
                    Multi-city
                </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 relative z-10">

                {/* From/To */}
                <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-2 bg-surface rounded-2xl p-1.5 border border-white/5 mx-auto w-full">
                    <div className="relative group/input">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-primary transition-colors">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            placeholder="From where?"
                            className="w-full bg-transparent text-white placeholder-gray-500 font-medium py-2 pl-10 pr-4 rounded-xl focus:bg-white/5 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="relative group/input">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 bg-surface rounded-full p-1 border border-white/10 text-gray-400 hidden md:block">
                            <ArrowRightLeft className="w-3 h-3" />
                        </div>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-primary transition-colors">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="To where?"
                            className="w-full bg-transparent text-white placeholder-gray-500 font-medium py-2 pl-10 pr-4 rounded-xl focus:bg-white/5 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="md:col-span-4 grid grid-cols-2 gap-2 bg-surface rounded-2xl p-1.5 border border-white/5">
                    <div className="relative group/input cursor-pointer hover:bg-white/5 rounded-xl transition-colors">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover/input:text-primary transition-colors">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <input
                            type="date"
                            value={departDate}
                            onChange={(e) => setDepartDate(e.target.value)}
                            onClick={(e) => e.currentTarget.showPicker?.()}
                            className="w-full h-full bg-transparent text-white opacity-0 absolute inset-0 z-30 cursor-pointer"
                        />
                        <div className="w-full py-2 pl-10 pr-2 relative z-10 pointer-events-none">
                            <span className="block text-xs text-gray-400">Depart</span>
                            <span className="block text-sm font-medium text-white">{departDate || 'Add Date'}</span>
                        </div>
                    </div>
                    <div className="relative group/input cursor-pointer hover:bg-white/5 rounded-xl transition-colors">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover/input:text-primary transition-colors">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            onClick={(e) => e.currentTarget.showPicker?.()}
                            className="w-full h-full bg-transparent text-white opacity-0 absolute inset-0 z-30 cursor-pointer"
                            disabled={tripType === 'one-way'}
                        />
                        <div className={`w-full py-2 pl-10 pr-2 relative z-10 pointer-events-none ${tripType === 'one-way' ? 'opacity-50' : ''}`}>
                            <span className="block text-xs text-gray-400">Return</span>
                            <span className="block text-sm font-medium text-white">{tripType === 'one-way' ? '-' : (returnDate || 'Add Date')}</span>
                        </div>
                    </div>
                </div>

                {/* Travelers / Search Button */}
                <div className="md:col-span-3 grid grid-cols-3 gap-2">
                    <div className="col-span-2 bg-surface rounded-2xl p-1.5 border border-white/5 relative group/input cursor-pointer hover:bg-white/5 transition-colors">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover/input:text-primary transition-colors">
                            <Users className="w-5 h-5" />
                        </div>
                        <select
                            value={travelers}
                            onChange={(e) => setTravelers(parseInt(e.target.value))}
                            className="w-full h-full opacity-0 absolute inset-0 z-20 cursor-pointer appearance-none"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                <option key={n} value={n} className="bg-slate-800 text-white">{n} Traveler{n > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                        <div className="w-full py-2 pl-10 pr-2 relative z-10 pointer-events-none">
                            <span className="block text-xs text-gray-400">Travelers</span>
                            <span className="block text-sm font-medium text-white truncate">{travelers} Traveler{travelers > 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="col-span-1 bg-primary hover:bg-primary-dark text-white rounded-2xl flex items-center justify-center transition-all hover:scale-105 shadow-lg shadow-primary/25"
                    >
                        <Search className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlightSearchForm;
