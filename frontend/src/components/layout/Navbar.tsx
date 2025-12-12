import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobeHemisphereWest, List, X, User, Bell } from '@phosphor-icons/react';
import clsx from 'clsx';

const CurrencyToggle = () => {
    const { currency, setCurrency } = useCurrency();
    const currencies: any[] = ['USD', 'EUR', 'GBP', 'JPY'];

    return (
        <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-bold text-gray-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
                {currency}
            </button>
            <div className="absolute right-0 mt-2 w-20 bg-surface border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block px-1 py-1">
                {currencies.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${currency === c ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </div>
    );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
        to={to}
        className="text-gray-300 hover:text-white font-medium transition-colors relative group"
    >
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
);

const MobileNavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) => (
    <Link
        to={to}
        onClick={onClick}
        className="text-2xl font-display font-semibold text-gray-200 hover:text-primary transition-colors block"
    >
        {children}
    </Link>
);

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={clsx(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    scrolled ? 'glass py-3' : 'bg-transparent py-6'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <GlobeHemisphereWest className="w-7 h-7 text-emerald-400 group-hover:rotate-12 transition-transform" weight="duotone" />
                            <span className="font-display font-bold text-xl tracking-tight text-white">
                                Sky<span className="text-emerald-400">Skana</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/safety">Travel Safety</NavLink>
                            <NavLink to="/about">About</NavLink>
                        </div>

                        {/* Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
                                <Bell className="w-5 h-5 text-gray-300" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-background"></span>
                            </button>

                            {/* Currency Toggle */}
                            <CurrencyToggle />

                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/20 transition-all hover:scale-105"
                                >
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                                        {user.firstName[0]}
                                    </div>
                                    <span className="font-medium text-sm text-white">{user.firstName}</span>
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/5 transition-all hover:scale-105"
                                >
                                    <User className="w-4 h-4" />
                                    <span className="font-medium text-sm">Sign In</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-300"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden pt-24 px-4"
                    >
                        <div className="flex flex-col gap-6">
                            <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                            <MobileNavLink to="/safety" onClick={() => setMobileMenuOpen(false)}>Travel Safety</MobileNavLink>
                            <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
                            <hr className="border-white/10" />
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/20"
                            >
                                <User className="w-5 h-5" />
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
