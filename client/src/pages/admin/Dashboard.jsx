import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { dashboardService } from '../../services/resources';
import KpiCard from '../../components/KpiCard';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorState, EmptyState } from '../../components/States';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService.admin().then(setData).catch((e) => setError(e.response?.data?.message || 'Failed to load dashboard.'));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  const { kpis, monthly_donations, upcoming_events, recent_donations, recent_volunteers } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">Dashboard</h2>
        <p className="text-sm text-forest-500 mt-1">Live overview of volunteers, donors and events.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Total Volunteers" value={kpis.total_volunteers} icon="🧑‍🤝‍🧑" />
        <KpiCard label="Active Volunteers" value={kpis.active_volunteers} icon="✅" accent="teal" />
        <KpiCard label="Total Donors" value={kpis.total_donors} icon="🎁" />
        <KpiCard label="Total Donations" value={`₹${Number(kpis.total_donations).toLocaleString('en-IN')}`} icon="💰" accent="amber" />
        <KpiCard label="Upcoming Events" value={kpis.upcoming_events} icon="📅" accent="teal" />
        <KpiCard label="Total Volunteer Hours" value={kpis.total_hours} icon="⏱️" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-forest-900 mb-4">Donation overview</h3>
          {monthly_donations.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthly_donations}>
                <CartesianGrid stroke="#eef4f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#8cc9a5" />
                <YAxis tick={{ fontSize: 12 }} stroke="#8cc9a5" />
                <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
                <Line type="monotone" dataKey="amount" stroke="#159a8f" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No donation history yet" />
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-forest-900 mb-4">Upcoming events</h3>
          {upcoming_events.length ? (
            <ul className="space-y-3">
              {upcoming_events.map((e) => (
                <li key={e.event_id}>
                  <Link to={`/admin/events/${e.event_id}`} className="block rounded-lg hover:bg-forest-50 -mx-2 px-2 py-1.5">
                    <p className="text-sm font-medium text-forest-800">{e.event_name}</p>
                    <p className="text-xs text-forest-500">{e.event_date} · {e.location}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No upcoming events" subtitle="Create one to get started." />
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-semibold text-forest-900 mb-4">Recent donations</h3>
          {recent_donations.length ? (
            <table className="data-table">
              <thead><tr><th>Donor</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recent_donations.map((d) => (
                  <tr key={d.donation_id}>
                    <td>{d.donor_name}</td>
                    <td>{d.donation_type === 'Money' ? `₹${Number(d.amount).toLocaleString('en-IN')}` : d.donation_type}</td>
                    <td><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <EmptyState title="No donations recorded yet" />}
        </div>

        <div className="card">
          <h3 className="font-semibold text-forest-900 mb-4">Recent volunteer registrations</h3>
          {recent_volunteers.length ? (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Joined</th><th>Status</th></tr></thead>
              <tbody>
                {recent_volunteers.map((v) => (
                  <tr key={v.volunteer_id}>
                    <td>{v.name}</td>
                    <td>{v.joined_date}</td>
                    <td><StatusBadge status={v.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <EmptyState title="No volunteers yet" />}
        </div>
      </div>
    </div>
  );
}
