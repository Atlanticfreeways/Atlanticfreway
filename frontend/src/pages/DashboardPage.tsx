import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { SignOut as LogOut, Airplane as Plane, Gear as Settings } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserBookings } from '../services/api';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only fetch if registered. For demo, we might want to check locastorage or assume empty
        // But let's fetch for now
        const fetchBookings = async () => {
            const data = await getUserBookings();
            setBookings(data);
            setLoading(false);
        };
        fetchBookings();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return <div className="min-h-screen pt-24 text-center text-white">Loading Profile...</div>;
    }

    return (
        <div className="min-h-screen bg-background text-text-primary pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-display font-bold text-white">Hello, {user.firstName}!</h1>
                        <p className="text-gray-400">Welcome to your personal command center.</p>
                    </motion.div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-sm text-gray-300"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 rounded-2xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                                {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{user.firstName} {user.lastName}</h3>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <button className="w-full py-2 rounded-lg bg-surface hover:bg-white/5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <Settings className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </motion.div>

                    {/* Stats / Active Trips */}
                    <div className="md:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Your Trips</h2>

                            {loading ? (
                                <p className="text-gray-400">Loading trips...</p>
                            ) : bookings.length === 0 ? (
                                <div className="glass-card p-8 rounded-2xl text-center">
                                    <p className="text-gray-400 mb-4">No trips booked yet.</p>
                                    <button onClick={() => navigate('/')} className="text-primary hover:underline">Book a flight</button>
                                </div>
                            ) : (
                                bookings.map(booking => (
                                    <div key={booking._id} className="glass-card p-6 rounded-2xl border-l-4 border-l-primary flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/20 rounded-xl text-primary">
                                                <Plane className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{booking.flightDetails.from} → {booking.flightDetails.to}</h3>
                                                <p className="text-sm text-gray-400">
                                                    Ref: {booking.bookingReference} • {new Date(booking.flightDetails.departDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 uppercase">{booking.status}</span>
                                            <p className="text-xs text-emerald-400 mt-1 font-mono">My Safety Score: {booking.safetyScoreSnapshot}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
