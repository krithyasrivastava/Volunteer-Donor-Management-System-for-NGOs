import { useEffect, useState } from 'react';
import { volunteerService } from '../../services/resources';
import KpiCard from '../../components/KpiCard';
import { Loading, ErrorState, EmptyState } from '../../components/States';

export default function VolunteerHours() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    volunteerService.myProfile().then(setData).catch((e) => setError(e.response?.data?.message || 'Failed to load hours.'));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  const completed = data.events.filter((e) => e.participation_status === 'Completed');

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">My hours</h2>
        <p className="text-sm text-forest-500 mt-1">A record of your volunteering contribution over time.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-md">
        <KpiCard label="Total hours" value={data.total_hours} icon="⏱️" />
        <KpiCard label="Completed activities" value={data.completed_activities} icon="✅" accent="teal" />
      </div>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold text-forest-900 mb-3">Completed events</h3>
        {completed.length ? (
          <table className="data-table">
            <thead><tr><th>Event</th><th>Date</th><th>Hours logged</th></tr></thead>
            <tbody>
              {completed.map((e) => (
                <tr key={e.event_id}><td>{e.event_name}</td><td>{e.event_date}</td><td>{e.hours}</td></tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyState title="No completed activities yet" subtitle="Hours are logged once an admin marks your participation as completed." />}
      </div>
    </div>
  );
}
