'use client';

import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Partner Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
            <Link href="/referrals" className="text-gray-600 hover:text-blue-600">Referrals</Link>
            <Link href="/analytics" className="text-blue-600 font-semibold">Analytics</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Commission Analytics</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Commission Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Commission (20%)</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume Bonus</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-green-600">$0.00</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Referrals</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-semibold">0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Booking Value</span>
                <span className="font-semibold">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Tier Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Current: Tier 2 Reseller (20%)</span>
                <span className="text-sm text-gray-600">Next: Tier 3 White-Label (35%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">$0 / $50,000 monthly volume needed</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
