import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Airplane as Plane, Shield, CreditCard, CaretRight as ChevronRight, Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import { createBooking } from '../services/api';

const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const flight = location.state?.flight;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [bookingRef, setBookingRef] = useState('');

    // Form Stats
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        passport: ''
    });

    if (!flight) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h2 className="text-2xl text-white">No flight selected</h2>
                <button onClick={() => navigate('/flights')} className="text-primary mt-4 underline">Back to Search</button>
            </div>
        );
    }

    const handleBooking = async () => {
        setLoading(true);
        try {
            const booking = await createBooking({
                flight,
                passengerDetails: formData
            });
            setBookingRef(booking.bookingReference);
            setStep(3); // Success
        } catch (error) {
            alert('Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-primary pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-display font-bold">Secure Checkout</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className={clsx("w-8 h-8 rounded-full flex items-center justify-center border", step >= 1 ? "bg-primary border-primary text-white" : "border-white/20")}>1</span>
                        <div className="w-8 h-[1px] bg-white/20"></div>
                        <span className={clsx("w-8 h-8 rounded-full flex items-center justify-center border", step >= 2 ? "bg-primary border-primary text-white" : "border-white/20")}>2</span>
                        <div className="w-8 h-[1px] bg-white/20"></div>
                        <span className={clsx("w-8 h-8 rounded-full flex items-center justify-center border", step >= 3 ? "bg-green-500 border-green-500 text-white" : "border-white/20")}>3</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Col: Details & Form */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Step 1: Passenger Details */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-6 rounded-2xl"
                            >
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
                                    Passenger Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm text-gray-400 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full bg-background border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full mt-6 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition-all"
                                >
                                    Continue to Payment
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-6 rounded-2xl"
                            >
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    Payment Method
                                </h3>

                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-white">Credit Card (Mock)</p>
                                        <p className="text-sm text-gray-400">**** **** **** 4242</p>
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    disabled={loading}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Processing...' : `Pay $${flight.price}`}
                                </button>
                                <button onClick={() => setStep(1)} className="w-full mt-2 text-gray-400 text-sm hover:text-white">Go Back</button>
                            </motion.div>
                        )}

                        {/* Step 3: Success */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card p-8 rounded-2xl text-center"
                            >
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
                                <p className="text-gray-400 mb-8">Your flight has been secured safe and sound.</p>

                                <div className="bg-surface p-4 rounded-xl text-left mb-6">
                                    <p className="text-xs text-gray-500 uppercase">Booking Reference</p>
                                    <p className="text-xl font-mono text-primary tracking-wider">{bookingRef}</p>
                                </div>

                                <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-medium">
                                    Return Home
                                </button>
                            </motion.div>
                        )}

                    </div>

                    {/* Right Col: Summary */}
                    <div className="md:col-span-1">
                        <div className="glass-card p-6 rounded-2xl sticky top-24">
                            <h3 className="text-lg font-bold text-white mb-4">Trip Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-2xl font-display font-bold text-white">{flight.departure.city}</p>
                                        <p className="text-sm text-gray-400">{flight.departure.time}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-600 mt-2" />
                                    <div className="text-right">
                                        <p className="text-2xl font-display font-bold text-white">{flight.arrival.city}</p>
                                        <p className="text-sm text-gray-400">{flight.arrival.time}</p>
                                    </div>
                                </div>

                                <hr className="border-white/10" />

                                <div className="flex justify-between">
                                    <span className="text-gray-400">Airline</span>
                                    <div className="flex items-center gap-2">
                                        <Plane className="w-4 h-4 text-primary" />
                                        <span className="text-white text-sm">{flight.airline}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Class</span>
                                    <span className="text-white text-sm">Economy</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Safety Score</span>
                                    <span className="text-emerald-400 text-sm font-bold">{flight.safetyScore}/100</span>
                                </div>

                                <hr className="border-white/10" />

                                <div className="flex justify-between items-end">
                                    <span className="text-gray-300 font-medium">Total Price</span>
                                    <span className="text-3xl font-bold text-white">${flight.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
