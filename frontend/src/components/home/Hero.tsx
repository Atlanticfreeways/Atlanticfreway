import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Globe } from '@phosphor-icons/react';
import FlightSearchForm from './FlightSearchForm';

const Hero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-background">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-background to-background" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse-slow" />
                <div className="absolute top-40 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
                >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-gray-300">
                        Real-time Travel Safety Intelligence
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight leading-tight text-emerald-400"
                >
                    Explore the World with
                    <br />
                    <span className="text-white">Confidence & Style</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12"
                >
                    The most advanced flight scanner integrating real-time government safety data,
                    AI-driven pricing predictions, and seamless booking experiences.
                </motion.p>

                {/* Search Component Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="w-full max-w-5xl"
                >
                    <FlightSearchForm />
                </motion.div>

                {/* Features / Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                >
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-500 font-semibold font-display">Skyscanner</span>
                    </div>
                    {/* Add more placeholder logos as text for now */}
                    <span className="text-gray-500 font-semibold font-display">US Dept. of State</span>
                    <span className="text-gray-500 font-semibold font-display">CDC Health</span>
                    <span className="text-gray-500 font-semibold font-display">Stripe</span>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
