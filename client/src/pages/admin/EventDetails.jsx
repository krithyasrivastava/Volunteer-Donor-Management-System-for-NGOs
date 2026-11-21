import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorState, EmptyState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function AdminEventDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState(null);
  const [showMatches, setShowMatches] = useState(false);
  const { push } = useToast();

  const load = () => eventService.get(id).then(setData).catch((e) => setError(e.response?.data?.message || 'Failed to load event.'));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const loadMatches = async () => {
    setShowMatches(true);
    setMatches(null);
    try {
      const ranked = await eventService.matches(id);
      setMatches(ranked);
    } catch (err) {
      push(err.response?.data?.message || 'Could not compute matches.', 'error');
    }
  };

  const assign = async (volunteerId) => {
    try {
      await eventService.assign(id, volunteerId);
      push('Volunteer assigned to event.');
      setMatches((m) => m.filter((v) => v.volunteer_id !== volunteerId));
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Could not assign volunteer.', 'error');
    }
  };

  const updateVolunteerStatus = async (volunteerId, status) => {
    try {
      await eventService.updateVolunteer(id, volunteerId, { status });
      push(`Marked ${status}.`);
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Update failed.', 'error');
    }
  };

  const logHours = async (volunteerId, currentHours) => {
    const hours = window.prompt('Enter completed hours for this volunteer:', currentHours || 0);
    if (hours === null) return;
    try {
      await eventService.updateVolunteer(id, volunteerId, { status: 'Completed', hours: Number(hours) });
      push('Hours recorded.');
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Could not save hours.', 'error');
    }
  };

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  return (
    <div className="space-y-5">
      <Link to="/admin/events" className="text-sm text-forest-500 hover:text-forest-800">&larr; Back to events</Link>

      <div className="card flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-semibold text-forest-900">{data.event_name}</h2>
            <StatusBadge status={data.status} />
          </div>
          <p className="text-sm text-forest-500 mt-1">{data.event_date} · {data.start_time?.slice(0,5)}–{data.end_time?.slice(0,5)} · {data.location}</p>
          {data.description && <p className="text-sm text-forest-600 mt-2 max-w-xl">{data.description}</p>}
        </div>
        <button className="btn-primary" onClick={loadMatches}>🎯 Find matching volunteers</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><p className="text-xs text-forest-500">Volunteers required</p><p className="text-2xl font-display font-bold text-forest-900">{data.required_volunteers}</p></div>
        <div className="card"><p className="text-xs text-forest-500">Registered</p><p className="text-2xl font-display font-bold text-forest-900">{data.volunteers.length}</p></div>
        <div className="card"><p className="text-xs text-forest-500">Required skills</p><p className="text-2xl font-display font-bold text-forest-900">{data.requirements.length}</p></div>
      </div>

      {data.requirements.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-forest-900 mb-3">Required skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.requirements.map((r) => (
              <span key={r.requirement_id} className="badge-teal">{r.skill_name} × {r.required_count}</span>
            ))}
          </div>
        </div>
      )}

      {showMatches && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-forest-900">Recommended volunteers</h3>
            <button className="text-sm text-forest-500 hover:text-forest-800" onClick={() => setShowMatches(false)}>Hide</button>
          </div>
          {!matches ? <Loading label="Scoring volunteers…" /> : matches.length === 0 ? (
            <EmptyState title="No eligible volunteers found" subtitle="All approved volunteers may already be registered for this event." />
          ) : (
            <div className="space-y-3">
              {matches.map((m) => (
                <div key={m.volunteer_id} className="flex items-center justify-between rounded-xl border border-forest-100 p-3">
                  <div>
                    <p className="font-medium text-forest-800">{m.name}</p>
                    <p className="text-xs text-forest-500">{m.email} · {m.availability}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {m.matched_skills.length ? m.matched_skills.map((s) => (
                        <span key={s} className="badge-green text-[11px]">✓ {s}</span>
                      )) : <span className="text-xs text-forest-400">No matching skills</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-display font-bold text-teal-700">{m.match_score}%</p>
                      <p className="text-[11px] text-forest-400">match score</p>
                    </div>
                    <button className="btn-primary" onClick={() => assign(m.volunteer_id)}>Assign</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card overflow-x-auto">
        <h3 className="font-semibold text-forest-900 mb-3">Registered volunteers</h3>
        {data.volunteers.length ? (
          <table className="data-table">
            <thead><tr><th>Name</th><th>Status</th><th>Hours</th><th></th></tr></thead>
            <tbody>
              {data.volunteers.map((v) => (
                <tr key={v.volunteer_id}>
                  <td>{v.name}<br /><span className="text-xs text-forest-400">{v.email}</span></td>
                  <td><StatusBadge status={v.status} /></td>
                  <td>{v.hours}</td>
                  <td>
                    <div className="flex gap-2 flex-wrap">
                      {v.status === 'Applied' && (
                        <>
                          <button className="text-xs text-forest-600 font-medium hover:underline" onClick={() => updateVolunteerStatus(v.volunteer_id, 'Approved')}>Approve</button>
                          <button className="text-xs text-red-600 font-medium hover:underline" onClick={() => updateVolunteerStatus(v.volunteer_id, 'Rejected')}>Reject</button>
                        </>
                      )}
                      {v.status === 'Approved' && (
                        <button className="text-xs text-teal-700 font-medium hover:underline" onClick={() => logHours(v.volunteer_id, v.hours)}>Mark completed + log hours</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyState title="No volunteers registered yet" subtitle="Use 'Find matching volunteers' to get recommendations." />}
      </div>
    </div>
  );
}
