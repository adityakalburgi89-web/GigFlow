import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h2>
        <p className="mt-1 text-gray-500">Here is your lead overview.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Leads</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">New Leads</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
          </div>
        </div>
      </main>
    </div>
  );
}
