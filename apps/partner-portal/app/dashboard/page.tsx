'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [earnings, setEarnings] = useState<any>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      const token = localStorage.getItem('partner_token');
      const response = await fetch('http://localhost:5000/api/partner/analytics/earnings', {
        headers: { 'X-API-Key': token || '' }
      });
      const data = await response.json();
      setEarnings(data);
    };

    fetchEarnings();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Partner Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-blue-600 font-semibold">Dashboard</Link>
            <Link href="/referrals" className="text-gray-600 hover:text-blue-600">Referrals</Link>
            <Link href="/analytics" className="text-gray-600 hover:text-blue-600">Analytics</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-2">Total Earnings</p>
            <p className="text-3xl font-bold text-green-600">
              ${earnings?.totalEarnings?.toFixed(2) || '0.00'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-2">Pending Commissions</p>
            <p className="text-3xl font-bold text-yellow-600">
              ${earnings?.pendingCommissions?.toFixed(2) || '0.00'}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-2">Commission Rate</p>
            <p className="text-3xl font-bold text-blue-600">
              {(earnings?.commissionRate * 100)?.toFixed(0) || '0'}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/referrals" className="p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">View Referrals</h3>
              <p className="text-sm text-gray-600">Track your referred customers</p>
            </Link>
            <Link href="/analytics" className="p-4 border rounded-lg hover:bg-gray-50">
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Detailed earnings breakdown</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
