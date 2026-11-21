import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/resources';
import KpiCard from '../../components/KpiCard';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorState, EmptyState } from '../../components/States';
import { useAuth } from '../../context/AuthContext';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService.donor().then(setData).catch((e) => setError(e.response?.data?.message || 'Failed to load dashboard.'));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  const { kpis, recent_donations } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">Welcome, {user?.name?.split(' ')[0]} 💚</h2>
        <p className="text-sm text-forest-500 mt-1">Thank you for supporting our community programs.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-md">
        <KpiCard label="Total donated" value={`₹${Number(kpis.total_donated).toLocaleString('en-IN')}`} icon="💰" accent="amber" />
        <KpiCard label="Donation records" value={kpis.donation_count} icon="🎁" accent="teal" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-forest-900">Recent donations</h3>
          <Link to="/donor/donations" className="text-sm text-teal-700 font-medium">View all →</Link>
        </div>
        {recent_donations.length ? (
          <table className="data-table">
            <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {recent_donations.map((d) => (
                <tr key={d.donation_id}>
                  <td>{d.donation_date}</td>
                  <td>{d.donation_type}</td>
                  <td>{d.donation_type === 'Money' ? `₹${Number(d.amount).toLocaleString('en-IN')}` : '—'}</td>
                  <td><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyState title="No donations yet" />}
      </div>
    </div>
  );
}
