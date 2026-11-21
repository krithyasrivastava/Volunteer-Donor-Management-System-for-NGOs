import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { donationService, donorService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { Loading, EmptyState, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function AdminDonations() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [donors, setDonors] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ donor_id: '', amount: 0, donation_type: 'Money', purpose: '', donation_date: '', payment_method: 'UPI', status: 'Completed' });
  const { push } = useToast();

  const load = () => donationService.list({ search, type, status }).then(setRows).catch((e) => setError(e.response?.data?.message || 'Failed to load donations.'));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [search, type, status]);
  useEffect(() => { donorService.list().then(setDonors); }, []);

  const submitAdd = async (e) => {
    e.preventDefault();
    try {
      await donationService.create(form);
      push('Donation recorded.');
      setShowAdd(false);
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Could not record donation.', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest-900">Donations</h2>
          <p className="text-sm text-forest-500 mt-1">Track every contribution and issue receipts.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Add donation</button>
      </div>

      <div className="card flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search donor, purpose, transaction ID" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input max-w-[160px]" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option>Money</option><option>Food</option><option>Clothes</option><option>Books</option><option>Other</option>
        </select>
        <select className="input max-w-[160px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>Pending</option><option>Completed</option><option>Cancelled</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        {error ? <ErrorState message={error} /> : !rows ? <Loading /> : rows.length === 0 ? (
          <EmptyState title="No donations found" />
        ) : (
          <table className="data-table">
            <thead><tr><th>Donor</th><th>Type</th><th>Amount</th><th>Date</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.donation_id}>
                  <td>{d.donor_name}</td>
                  <td>{d.donation_type}</td>
                  <td>{d.donation_type === 'Money' ? `₹${Number(d.amount).toLocaleString('en-IN')}` : '—'}</td>
                  <td>{d.donation_date}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td className="space-x-3">
                    <Link to={`/admin/donations/${d.donation_id}`} className="text-xs text-forest-600 font-medium hover:underline">View</Link>
                    <Link to={`/admin/donations/${d.donation_id}/receipt`} className="text-xs text-teal-700 font-medium hover:underline">Receipt</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add donation" wide>
        <form onSubmit={submitAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Donor</label>
              <select className="input" required value={form.donor_id} onChange={(e) => setForm({ ...form, donor_id: e.target.value })}>
                <option value="">Select donor…</option>
                {donors.map((d) => <option key={d.donor_id} value={d.donor_id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Donation type</label>
              <select className="input" value={form.donation_type} onChange={(e) => setForm({ ...form, donation_type: e.target.value })}>
                <option>Money</option><option>Food</option><option>Clothes</option><option>Books</option><option>Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="field-label">Amount (₹)</label><input className="input" type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
            <div><label className="field-label">Date</label><input className="input" type="date" required value={form.donation_date} onChange={(e) => setForm({ ...form, donation_date: e.target.value })} /></div>
          </div>
          <div><label className="field-label">Purpose</label><input className="input" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Food Distribution Drive" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Payment method</label>
              <select className="input" value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
                <option>UPI</option><option>Cash</option><option>Card</option><option>Bank Transfer</option><option>Cheque</option><option>N/A</option>
              </select>
            </div>
            <div>
              <label className="field-label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Pending</option><option>Completed</option><option>Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-primary">Save donation</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
