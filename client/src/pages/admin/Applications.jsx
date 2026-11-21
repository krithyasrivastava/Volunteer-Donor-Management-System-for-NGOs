import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationService, volunteerService, eventService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import { Loading, EmptyState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function AdminApplications() {
  const [tab, setTab] = useState('volunteers');
  const [volApps, setVolApps] = useState(null);
  const [eventApps, setEventApps] = useState(null);
  const [error, setError] = useState('');
  const { push } = useToast();

  const loadVol = () => applicationService.volunteers().then(setVolApps).catch((e) => setError(e.response?.data?.message || 'Failed to load.'));
  const loadEvents = () => applicationService.events().then(setEventApps).catch((e) => setError(e.response?.data?.message || 'Failed to load.'));

  useEffect(() => { loadVol(); loadEvents(); }, []);

  const decideVolunteer = async (id, status) => {
    try {
      await volunteerService.setStatus(id, status);
      push(`Volunteer marked as ${status}.`);
      loadVol();
    } catch (err) {
      push(err.response?.data?.message || 'Update failed.', 'error');
    }
  };

  const decideEvent = async (eventId, volunteerId, status) => {
    try {
      await eventService.updateVolunteer(eventId, volunteerId, { status });
      push(`Application ${status.toLowerCase()}.`);
      loadEvents();
    } catch (err) {
      push(err.response?.data?.message || 'Update failed.', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">Applications</h2>
        <p className="text-sm text-forest-500 mt-1">Review pending volunteer sign-ups and event applications.</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('volunteers')} className={`btn-secondary ${tab === 'volunteers' ? '!bg-forest-600 !text-white !border-forest-600' : ''}`}>Volunteer sign-ups</button>
        <button onClick={() => setTab('events')} className={`btn-secondary ${tab === 'events' ? '!bg-forest-600 !text-white !border-forest-600' : ''}`}>Event applications</button>
      </div>

      {error && <ErrorState message={error} />}

      {tab === 'volunteers' && (
        <div className="card overflow-x-auto">
          {!volApps ? <Loading /> : volApps.length === 0 ? (
            <EmptyState title="No pending volunteer applications" />
          ) : (
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Availability</th><th>Applied</th><th></th></tr></thead>
              <tbody>
                {volApps.map((v) => (
                  <tr key={v.volunteer_id}>
                    <td><Link to={`/admin/volunteers/${v.volunteer_id}`} className="font-medium text-forest-800 hover:text-teal-700">{v.name}</Link></td>
                    <td>{v.email}</td>
                    <td>{v.availability}</td>
                    <td>{v.joined_date}</td>
                    <td className="space-x-3">
                      <button className="text-xs text-forest-600 font-medium hover:underline" onClick={() => decideVolunteer(v.volunteer_id, 'Approved')}>Approve</button>
                      <button className="text-xs text-red-600 font-medium hover:underline" onClick={() => decideVolunteer(v.volunteer_id, 'Rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'events' && (
        <div className="card overflow-x-auto">
          {!eventApps ? <Loading /> : eventApps.length === 0 ? (
            <EmptyState title="No pending event applications" />
          ) : (
            <table className="data-table">
              <thead><tr><th>Volunteer</th><th>Event</th><th>Event date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {eventApps.map((a) => (
                  <tr key={`${a.event_id}-${a.volunteer_id}`}>
                    <td>{a.volunteer_name}<br /><span className="text-xs text-forest-400">{a.volunteer_email}</span></td>
                    <td><Link to={`/admin/events/${a.event_id}`} className="text-forest-800 hover:text-teal-700 font-medium">{a.event_name}</Link></td>
                    <td>{a.event_date}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td className="space-x-3">
                      <button className="text-xs text-forest-600 font-medium hover:underline" onClick={() => decideEvent(a.event_id, a.volunteer_id, 'Approved')}>Approve</button>
                      <button className="text-xs text-red-600 font-medium hover:underline" onClick={() => decideEvent(a.event_id, a.volunteer_id, 'Rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
