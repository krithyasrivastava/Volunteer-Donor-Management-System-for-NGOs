import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorState, EmptyState } from '../../components/States';

export default function VolunteerMyEvents() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    applicationService.mine().then(setRows).catch((e) => setError(e.response?.data?.message || 'Failed to load your events.'));
  }, []);

  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">My events</h2>
        <p className="text-sm text-forest-500 mt-1">Track the status of every event you've applied to.</p>
      </div>

      <div className="card overflow-x-auto">
        {!rows ? <Loading /> : rows.length === 0 ? (
          <EmptyState title="You haven't applied to any events yet" subtitle="Browse available events to get started." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Event</th><th>Date</th><th>Status</th><th>Hours</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.event_id}>
                  <td><Link to={`/volunteer/events/${r.event_id}`} className="font-medium text-forest-800 hover:text-teal-700">{r.event_name}</Link></td>
                  <td>{r.event_date}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{r.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
