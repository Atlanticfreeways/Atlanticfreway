import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Airplane as Plane } from '@phosphor-icons/react';
import { Flight } from '../../types/flight';
import clsx from 'clsx';
import { useCurrency } from '../../context/CurrencyContext';

interface FlightCardProps {
    flight: Flight;
    index: number;
}

const FlightCard = ({ flight, index }: FlightCardProps) => {
    const navigate = useNavigate();
    const { formatPrice } = useCurrency();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
        >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Airline Info */}
                <div className="flex items-center gap-4 w-full md:w-1/4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2 shadow-sm">
                        <span className="text-xl font-bold text-primary">{flight.airline[0]}</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{flight.airline}</h3>
                        <p className="text-sm text-gray-400">{flight.flightNumber}</p>
                    </div>
                </div>

                {/* Route Info */}
                <div className="flex-1 flex items-center justify-center gap-4 w-full md:w-auto">
                    <div className="text-right">
                        <p className="text-xl font-display font-medium text-white">{flight.departure.time}</p>
                        <p className="text-sm text-gray-400">{flight.departure.airport}</p>
                    </div>

                    <div className="flex flex-col items-center w-32 px-2">
                        <span className="text-xs text-gray-500 mb-1">
                            {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
                        </span>
                        <div className="w-full h-[2px] bg-white/10 relative">
                            <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-primary -translate-y-1/2" />
                            <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-white/20 -translate-y-1/2" />
                            <Plane className="w-4 h-4 text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                        </div>
                        <span className={clsx("text-xs mt-1", flight.stops === 0 ? "text-green-400" : "text-amber-400")}>
                            {flight.stops === 0 ? "Direct" : `${flight.stops} Stop`}
                        </span>
                    </div>

                    <div className="text-left">
                        <p className="text-xl font-display font-medium text-white">{flight.arrival.time}</p>
                        <p className="text-sm text-gray-400">{flight.arrival.airport}</p>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto md:items-end gap-2 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 mt-4 md:mt-0">
                    <div className="flex flex-col items-end">
                        <p className="text-3xl font-display font-bold text-white">
                            {formatPrice(flight.price)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full mt-1">
                            <Shield className="w-3 h-3" />
                            <span>Safety Score: {flight.safetyScore}/100</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/booking', { state: { flight } })}
                        className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary/20"
                    >
                        Select
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default FlightCard;
