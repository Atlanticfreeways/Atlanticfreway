import { motion } from 'framer-motion';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 md:p-12 rounded-3xl"
                >
                    <h1 className="text-4xl font-display font-bold mb-6">About <span className="text-gradient">FlightScanner</span></h1>

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <p className="text-lg">
                            FlightScanner isn't just another booking site. We are the <strong className="text-white">Safety Guardian</strong> of the travel industry.
                        </p>
                        <p>
                            Born from the need to navigate an increasingly complex world, our mission is to empower travelers not just with the best prices, but with the confidence that they are making safe, informed decisions.
                        </p>
                        <p>
                            We integrate real-time data from government advisories, health organizations, and local security networks directly into your flight search experience. When you book with FlightScanner, you aren't just buying a ticket; you're securing your peace of mind.
                        </p>

                        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 mt-8">
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-2">10M+</h4>
                                <p className="text-sm text-gray-500">Flights Analyzed</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-2">150+</h4>
                                <p className="text-sm text-gray-500">Countries Monitored</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-2">24/7</h4>
                                <p className="text-sm text-gray-500">Real-time Updates</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
