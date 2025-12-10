import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Partner Portal</h1>
          <p className="text-xl mb-8">Atlanticfreway Affiliate Program</p>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">10%</h3>
              <p className="text-sm">Tier 1 Affiliate</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">20%</h3>
              <p className="text-sm">Tier 2 Reseller</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">35%</h3>
              <p className="text-sm">Tier 3 White-Label</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">50%</h3>
              <p className="text-sm">Tier 4 Enterprise</p>
            </div>
          </div>

          <Link
            href="/login"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Partner Login
          </Link>
        </div>
      </div>
    </main>
  );
}
