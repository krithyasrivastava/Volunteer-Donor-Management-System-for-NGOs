import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { donorService } from '../../services/resources';
import Modal from '../../components/Modal';
import { Loading, EmptyState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function AdminDonors() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', donor_type: 'Individual' });
  const { push } = useToast();

  const load = () => donorService.list({ search }).then(setRows).catch((e) => setError(e.response?.data?.message || 'Failed to load donors.'));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [search]);

  const submitAdd = async (e) => {
    e.preventDefault();
    try {
      await donorService.create(form);
      push('Donor added.');
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', phone: '', address: '', donor_type: 'Individual' });
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Could not add donor.', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest-900">Donors</h2>
          <p className="text-sm text-forest-500 mt-1">Manage donor records and view giving history.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Add donor</button>
      </div>

      <div className="card">
        <input className="input max-w-xs" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-x-auto">
        {error ? <ErrorState message={error} /> : !rows ? <Loading /> : rows.length === 0 ? (
          <EmptyState title="No donors found" />
        ) : (
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Total donated</th><th>Registered</th></tr></thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.donor_id}>
                  <td><Link to={`/admin/donors/${d.donor_id}`} className="font-medium text-forest-800 hover:text-teal-700">{d.name}</Link></td>
                  <td>{d.email}</td>
                  <td>{d.donor_type}</td>
                  <td>₹{Number(d.total_donated).toLocaleString('en-IN')}</td>
                  <td>{new Date(d.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add donor">
        <form onSubmit={submitAdd} className="space-y-3">
          <div><label className="field-label">Name</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="field-label">Email</label><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="field-label">Temporary password</label><input className="input" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="field-label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div>
              <label className="field-label">Donor type</label>
              <select className="input" value={form.donor_type} onChange={(e) => setForm({ ...form, donor_type: e.target.value })}>
                <option>Individual</option><option>Organization</option>
              </select>
            </div>
          </div>
          <div><label className="field-label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-primary">Add donor</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
