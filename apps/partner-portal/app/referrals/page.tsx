'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      const token = localStorage.getItem('partner_token');
      const response = await fetch('http://localhost:5000/api/partner/referrals/list', {
        headers: { 'X-API-Key': token || '' }
      });
      const data = await response.json();
      setReferrals(data.referrals || []);
    };

    fetchReferrals();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Partner Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
            <Link href="/referrals" className="text-blue-600 font-semibold">Referrals</Link>
            <Link href="/analytics" className="text-gray-600 hover:text-blue-600">Analytics</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Your Referrals</h2>

        {referrals.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {referrals.map((ref: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4">{ref.userEmail}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        ref.status === 'converted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{ref.totalBookings}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-xl text-gray-600">No referrals yet</p>
            <p className="text-gray-500 mt-2">Share your referral link to start earning</p>
          </div>
        )}
      </div>
    </main>
  );
}
