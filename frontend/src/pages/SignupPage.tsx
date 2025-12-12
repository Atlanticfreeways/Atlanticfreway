
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Envelope as Mail, Spinner as Loader2, WarningCircle as AlertCircle } from '@phosphor-icons/react';
import Navbar from '../components/layout/Navbar';

const SignupPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-8 rounded-3xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join FlightScanner to unlock personalized safety alerts.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="First Name"
                                required
                                className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all placeholder:text-gray-500"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Last Name"
                                required
                                className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all placeholder:text-gray-500"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all placeholder:text-gray-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all placeholder:text-gray-500"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-primary/25 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:text-white transition-colors font-medium">
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
