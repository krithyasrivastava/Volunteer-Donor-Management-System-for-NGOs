import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../../services/resources';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function VolunteerEventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { push } = useToast();

  const load = () => eventService.get(id).then(setData).catch((e) => setError(e.response?.data?.message || 'Failed to load event.'));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  const myEntry = data.volunteers.find((v) => v.volunteer_id === user?.volunteer_id || v.email === user?.email);

  const apply = async () => {
    setBusy(true);
    try {
      await eventService.apply(id);
      push('Application submitted!');
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Could not apply.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <Link to="/volunteer/events" className="text-sm text-forest-500 hover:text-forest-800">&larr; Back to events</Link>

      <div className="card">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-semibold text-forest-900">{data.event_name}</h2>
          <StatusBadge status={data.status} />
        </div>
        <p className="text-sm text-forest-500 mt-1">{data.event_date} · {data.start_time?.slice(0,5)}–{data.end_time?.slice(0,5)} · {data.location}</p>
        {data.description && <p className="text-sm text-forest-600 mt-3">{data.description}</p>}

        {data.requirements.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-forest-500 mb-2">Skills needed</p>
            <div className="flex flex-wrap gap-2">
              {data.requirements.map((r) => <span key={r.requirement_id} className="badge-teal">{r.skill_name}</span>)}
            </div>
          </div>
        )}

        <div className="mt-6">
          {myEntry ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-forest-600">Your application status:</span>
              <StatusBadge status={myEntry.status} />
            </div>
          ) : user?.status === 'Approved' ? (
            <button className="btn-primary" disabled={busy} onClick={apply}>{busy ? 'Applying…' : 'Apply to this event'}</button>
          ) : (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              Your volunteer account must be approved before you can apply to events.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
