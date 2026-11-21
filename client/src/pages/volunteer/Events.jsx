import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorState, EmptyState } from '../../components/States';

export default function VolunteerEvents() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    eventService.list({ search, status: 'Upcoming' }).then(setRows).catch((e) => setError(e.response?.data?.message || 'Failed to load events.'));
  }, [search]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">Available events</h2>
        <p className="text-sm text-forest-500 mt-1">Browse upcoming events and apply to the ones that fit you.</p>
      </div>

      <div className="card">
        <input className="input max-w-xs" placeholder="Search events" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error ? <ErrorState message={error} /> : !rows ? <Loading /> : rows.length === 0 ? (
        <EmptyState title="No upcoming events right now" subtitle="Check back soon for new opportunities." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((e) => (
            <Link to={`/volunteer/events/${e.event_id}`} key={e.event_id} className="card hover:shadow-lg transition-shadow block">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-forest-900">{e.event_name}</h3>
                <StatusBadge status={e.status} />
              </div>
              <p className="text-sm text-forest-500 mt-2">{e.event_date} · {e.start_time?.slice(0,5)}–{e.end_time?.slice(0,5)}</p>
              <p className="text-sm text-forest-500">{e.location}</p>
              <p className="text-xs text-forest-400 mt-3">{e.assigned_count}/{e.required_volunteers} volunteers assigned</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
