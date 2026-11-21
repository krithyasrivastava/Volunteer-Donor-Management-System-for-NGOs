import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { dashboardService } from '../../services/resources';
import { Loading, ErrorState, EmptyState } from '../../components/States';

const COLORS = ['#28734c', '#159a8f', '#5cab7f', '#0d655e', '#8cc9a5'];

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService.reports().then(setData).catch((e) => setError(e.response?.data?.message || 'Failed to load reports.'));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  const { monthlyDonations, eventParticipation, volunteerStatusBreakdown, donationTypeBreakdown, topVolunteers } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">Reports</h2>
        <p className="text-sm text-forest-500 mt-1">Aggregate statistics computed directly from the database.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-semibold text-forest-900 mb-4">Monthly donations</h3>
          {monthlyDonations.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyDonations}>
                <CartesianGrid stroke="#eef4f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#8cc9a5" />
                <YAxis tick={{ fontSize: 12 }} stroke="#8cc9a5" />
                <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
                <Bar dataKey="amount" fill="#28734c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState title="No donation data yet" />}
        </div>

        <div className="card">
          <h3 className="font-semibold text-forest-900 mb-4">Donation types</h3>
          {donationTypeBreakdown.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={donationTypeBreakdown} dataKey="count" nameKey="donation_type" cx="50%" cy="50%" outerRadius={90} label>
                  {donationTypeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState title="No donations yet" />}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-semibold text-forest-900 mb-4">Volunteer status breakdown</h3>
          {volunteerStatusBreakdown.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={volunteerStatusBreakdown} layout="vertical">
                <CartesianGrid stroke="#eef4f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#8cc9a5" />
                <YAxis type="category" dataKey="status" tick={{ fontSize: 12 }} width={80} stroke="#8cc9a5" />
                <Tooltip />
                <Bar dataKey="count" fill="#159a8f" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState title="No volunteers yet" />}
        </div>

        <div className="card overflow-x-auto">
          <h3 className="font-semibold text-forest-900 mb-4">Top volunteers by hours</h3>
          {topVolunteers.length ? (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Total hours</th></tr></thead>
              <tbody>
                {topVolunteers.map((v) => (
                  <tr key={v.volunteer_id}><td>{v.name}</td><td>{v.total_hours}</td></tr>
                ))}
              </tbody>
            </table>
          ) : <EmptyState title="No hours logged yet" />}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold text-forest-900 mb-4">Event-wise volunteer participation</h3>
        {eventParticipation.length ? (
          <table className="data-table">
            <thead><tr><th>Event</th><th>Volunteers</th><th>Total hours</th></tr></thead>
            <tbody>
              {eventParticipation.map((e) => (
                <tr key={e.event_name}><td>{e.event_name}</td><td>{e.volunteer_count}</td><td>{e.total_hours}</td></tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyState title="No events yet" />}
      </div>
    </div>
  );
}
