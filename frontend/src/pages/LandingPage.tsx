import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30 selection:text-white">
            <Navbar />
            <Hero />

            {/* Spacer for scroll testing if needed, or footer later */}
            <div className="h-20" />
        </div>
    );
};

export default LandingPage;
