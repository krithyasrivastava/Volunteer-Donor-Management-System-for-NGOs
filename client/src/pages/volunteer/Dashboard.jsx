import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/resources';
import KpiCard from '../../components/KpiCard';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorState, EmptyState } from '../../components/States';
import { useAuth } from '../../context/AuthContext';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService.volunteer().then(setData).catch((e) => setError(e.response?.data?.message || 'Failed to load dashboard.'));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  const { kpis, upcoming } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-sm text-forest-500 mt-1">
          Status: <StatusBadge status={user?.status} />
          {user?.status === 'Pending' && ' — your application is awaiting admin approval.'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Hours" value={kpis.total_hours} icon="⏱️" />
        <KpiCard label="Completed Events" value={kpis.completed_events} icon="✅" accent="teal" />
        <KpiCard label="Upcoming Events" value={kpis.upcoming_events} icon="📅" accent="teal" />
        <KpiCard label="Pending Applications" value={kpis.pending_applications} icon="📝" accent="amber" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-forest-900">Your upcoming events</h3>
          <Link to="/volunteer/events" className="text-sm text-teal-700 font-medium">Browse events →</Link>
        </div>
        {upcoming.length ? (
          <ul className="space-y-3">
            {upcoming.map((e) => (
              <li key={e.event_id} className="flex items-center justify-between rounded-lg hover:bg-forest-50 -mx-2 px-2 py-2">
                <div>
                  <p className="text-sm font-medium text-forest-800">{e.event_name}</p>
                  <p className="text-xs text-forest-500">{e.event_date} · {e.location}</p>
                </div>
                <StatusBadge status={e.status} />
              </li>
            ))}
          </ul>
        ) : <EmptyState title="No upcoming events" subtitle="Browse available events and apply." />}
      </div>
    </div>
  );
}
