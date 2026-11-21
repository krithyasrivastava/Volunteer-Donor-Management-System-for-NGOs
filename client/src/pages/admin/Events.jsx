import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import { Loading, EmptyState, ErrorState } from '../../components/States';

export default function AdminEvents() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    eventService.list({ search, status }).then(setRows).catch((e) => setError(e.response?.data?.message || 'Failed to load events.'));
  }, [search, status]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest-900">Events</h2>
          <p className="text-sm text-forest-500 mt-1">Plan and track community activities.</p>
        </div>
        <Link to="/admin/events/new" className="btn-primary">+ Create event</Link>
      </div>

      <div className="card flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search events" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input max-w-[180px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>Upcoming</option><option>Ongoing</option><option>Completed</option><option>Cancelled</option>
        </select>
      </div>

      {error ? <ErrorState message={error} /> : !rows ? <Loading /> : rows.length === 0 ? (
        <EmptyState title="No events found" subtitle="Create your first community event." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((e) => (
            <Link to={`/admin/events/${e.event_id}`} key={e.event_id} className="card hover:shadow-lg transition-shadow block">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-forest-900">{e.event_name}</h3>
                <StatusBadge status={e.status} />
              </div>
              <p className="text-sm text-forest-500 mt-2">{e.event_date} · {e.start_time?.slice(0,5)}–{e.end_time?.slice(0,5)}</p>
              <p className="text-sm text-forest-500">{e.location}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-forest-500">
                <span>{e.assigned_count}/{e.required_volunteers} volunteers assigned</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-forest-100 overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: `${Math.min(100, (e.assigned_count / (e.required_volunteers || 1)) * 100)}%` }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
