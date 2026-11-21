import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { volunteerService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorState, EmptyState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function AdminVolunteerDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const { push } = useToast();

  const load = () => volunteerService.get(id).then(setData).catch((e) => setError(e.response?.data?.message || 'Failed to load volunteer.'));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const setStatus = async (s) => {
    try {
      await volunteerService.setStatus(id, s);
      push(`Volunteer marked as ${s}.`);
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Update failed.', 'error');
    }
  };

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  return (
    <div className="space-y-5">
      <Link to="/admin/volunteers" className="text-sm text-forest-500 hover:text-forest-800">&larr; Back to volunteers</Link>

      <div className="card flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-teal-500 text-white flex items-center justify-center text-xl font-semibold">
            {data.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-forest-900">{data.name}</h2>
            <p className="text-sm text-forest-500">{data.email} · {data.phone || 'No phone'}</p>
            <div className="mt-1"><StatusBadge status={data.status} /></div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setStatus('Approved')}>Approve</button>
          <button className="btn-secondary" onClick={() => setStatus('Rejected')}>Reject</button>
          <button className="btn-danger" onClick={() => setStatus('Inactive')}>Deactivate</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card"><p className="text-xs text-forest-500">Total hours</p><p className="text-2xl font-display font-bold text-forest-900">{data.total_hours}</p></div>
        <div className="card"><p className="text-xs text-forest-500">Events participated</p><p className="text-2xl font-display font-bold text-forest-900">{data.events.length}</p></div>
        <div className="card"><p className="text-xs text-forest-500">Completed activities</p><p className="text-2xl font-display font-bold text-forest-900">{data.completed_activities}</p></div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-semibold text-forest-900 mb-3">Details</h3>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between"><dt className="text-forest-500">Address</dt><dd className="text-forest-800">{data.address || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-forest-500">Availability</dt><dd className="text-forest-800">{data.availability}</dd></div>
            <div className="flex justify-between"><dt className="text-forest-500">Joined</dt><dd className="text-forest-800">{data.joined_date}</dd></div>
          </dl>
          <h4 className="font-semibold text-forest-900 mt-5 mb-2 text-sm">Skills</h4>
          {data.skills.length ? (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => <span key={s.skill_id} className="badge-teal">{s.skill_name} · {s.proficiency}</span>)}
            </div>
          ) : <p className="text-sm text-forest-500">No skills added yet.</p>}
        </div>

        <div className="card">
          <h3 className="font-semibold text-forest-900 mb-3">Event history</h3>
          {data.events.length ? (
            <table className="data-table">
              <thead><tr><th>Event</th><th>Date</th><th>Status</th><th>Hours</th></tr></thead>
              <tbody>
                {data.events.map((e) => (
                  <tr key={e.event_id}>
                    <td>{e.event_name}</td>
                    <td>{e.event_date}</td>
                    <td><StatusBadge status={e.participation_status} /></td>
                    <td>{e.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <EmptyState title="No events yet" />}
        </div>
      </div>
    </div>
  );
}
