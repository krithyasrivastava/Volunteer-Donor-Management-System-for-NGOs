import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { volunteerService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { Loading, EmptyState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function AdminVolunteers() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', availability: 'Flexible', status: 'Pending' });
  const { push } = useToast();

  const load = () => {
    volunteerService.list({ search, status }).then(setRows).catch((e) => setError(e.response?.data?.message || 'Failed to load volunteers.'));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [search, status]);

  const submitAdd = async (e) => {
    e.preventDefault();
    try {
      await volunteerService.create(form);
      push('Volunteer added.');
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', phone: '', address: '', availability: 'Flexible', status: 'Pending' });
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Could not add volunteer.', 'error');
    }
  };

  const quickStatus = async (id, s) => {
    try {
      await volunteerService.setStatus(id, s);
      push(`Volunteer marked as ${s}.`);
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Update failed.', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest-900">Volunteers</h2>
          <p className="text-sm text-forest-500 mt-1">Manage applications, approvals and profiles.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Add volunteer</button>
      </div>

      <div className="card flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input max-w-[180px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        {error ? <ErrorState message={error} /> : !rows ? <Loading /> : rows.length === 0 ? (
          <EmptyState title="No volunteers found" subtitle="Try adjusting your search or filters." />
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Availability</th><th>Status</th><th>Joined</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.volunteer_id}>
                  <td><Link to={`/admin/volunteers/${v.volunteer_id}`} className="font-medium text-forest-800 hover:text-teal-700">{v.name}</Link></td>
                  <td>{v.email}</td>
                  <td>{v.phone || '—'}</td>
                  <td>{v.availability}</td>
                  <td><StatusBadge status={v.status} /></td>
                  <td>{v.joined_date}</td>
                  <td>
                    {v.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button className="text-xs text-forest-600 font-medium hover:underline" onClick={() => quickStatus(v.volunteer_id, 'Approved')}>Approve</button>
                        <button className="text-xs text-red-600 font-medium hover:underline" onClick={() => quickStatus(v.volunteer_id, 'Rejected')}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add volunteer">
        <form onSubmit={submitAdd} className="space-y-3">
          <div><label className="field-label">Name</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="field-label">Email</label><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="field-label">Temporary password</label><input className="input" type="text" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="field-label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div>
              <label className="field-label">Availability</label>
              <select className="input" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
                <option>Flexible</option><option>Weekdays</option><option>Weekends</option><option>Evenings</option>
              </select>
            </div>
          </div>
          <div><label className="field-label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-primary">Add volunteer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
