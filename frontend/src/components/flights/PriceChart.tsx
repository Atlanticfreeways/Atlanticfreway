import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PriceChart = () => {
    // Mock Data: Last 30 Days trend
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Today'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Average Price (USD)',
                data: [420, 380, 450, 350],
                borderColor: '#0ea5e9', // Primary Color
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                tension: 0.4, // Smooth curve
                fill: true,
                pointBackgroundColor: '#0ea5e9',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#0ea5e9',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                    callback: (value: any) => `$${value}`
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#94a3b8',
                }
            }
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl mb-8"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Price History</h3>
                    <p className="text-sm text-gray-400">Analysis for this route over the last 30 days.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        Low Demand
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs font-medium">
                        Best time to buy
                    </div>
                </div>
            </div>

            <div className="h-64 w-full">
                <Line options={options} data={data} />
            </div>
        </motion.div>
    );
};

export default PriceChart;
