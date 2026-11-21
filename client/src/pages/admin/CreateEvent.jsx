import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService, skillService } from '../../services/resources';
import { useToast } from '../../components/Toast';

export default function AdminCreateEvent() {
  const [form, setForm] = useState({
    event_name: '', description: '', event_date: '', start_time: '09:00', end_time: '13:00',
    location: '', required_volunteers: 5, status: 'Upcoming'
  });
  const [skills, setSkills] = useState([]);
  const [requirements, setRequirements] = useState([{ skill_id: '', required_count: 1 }]);
  const [busy, setBusy] = useState(false);
  const { push } = useToast();
  const navigate = useNavigate();

  useEffect(() => { skillService.list().then(setSkills); }, []);

  const updateReq = (idx, key, value) => {
    setRequirements((r) => r.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
  };
  const addReq = () => setRequirements((r) => [...r, { skill_id: '', required_count: 1 }]);
  const removeReq = (idx) => setRequirements((r) => r.filter((_, i) => i !== idx));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const cleanRequirements = requirements.filter((r) => r.skill_id);
      const { event_id } = await eventService.create({ ...form, requirements: cleanRequirements });
      push('Event created.');
      navigate(`/admin/events/${event_id}`);
    } catch (err) {
      push(err.response?.data?.message || 'Could not create event.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">Create event</h2>
        <p className="text-sm text-forest-500 mt-1">Define the event and the skills you'll need from volunteers.</p>
      </div>

      <form onSubmit={submit} className="card space-y-4">
        <div>
          <label className="field-label">Event name</label>
          <input className="input" required value={form.event_name} onChange={(e) => setForm({ ...form, event_name: e.target.value })} placeholder="e.g. Food Distribution Drive" />
        </div>
        <div>
          <label className="field-label">Description</label>
          <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="field-label">Date</label><input className="input" type="date" required value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
          <div><label className="field-label">Start time</label><input className="input" type="time" required value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
          <div><label className="field-label">End time</label><input className="input" type="time" required value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="field-label">Location</label><input className="input" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div><label className="field-label">Volunteers required</label><input className="input" type="number" min={0} value={form.required_volunteers} onChange={(e) => setForm({ ...form, required_volunteers: e.target.value })} /></div>
        </div>

        <div>
          <label className="field-label">Required skills</label>
          <div className="space-y-2">
            {requirements.map((r, idx) => (
              <div key={idx} className="flex gap-2">
                <select className="input" value={r.skill_id} onChange={(e) => updateReq(idx, 'skill_id', e.target.value)}>
                  <option value="">Select skill…</option>
                  {skills.map((s) => <option key={s.skill_id} value={s.skill_id}>{s.skill_name}</option>)}
                </select>
                <input className="input max-w-[100px]" type="number" min={1} value={r.required_count} onChange={(e) => updateReq(idx, 'required_count', e.target.value)} />
                <button type="button" onClick={() => removeReq(idx)} className="btn-ghost px-3">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addReq} className="text-sm text-teal-700 font-medium mt-2">+ Add another skill</button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/events')}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? 'Creating…' : 'Create event'}</button>
        </div>
      </form>
    </div>
  );
}
