import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { Loading, ErrorState, EmptyState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function DonorMyDonations() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ amount: 0, donation_type: 'Money', purpose: '', donation_date: '', payment_method: 'UPI' });
  const { push } = useToast();

  const load = () => donationService.mine().then(setRows).catch((e) => setError(e.response?.data?.message || 'Failed to load donations.'));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await donationService.create({ ...form, status: 'Pending' });
      push('Donation submitted — thank you! It will show as Pending until confirmed.');
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
          <h2 className="font-display text-2xl font-semibold text-forest-900">My donations</h2>
          <p className="text-sm text-forest-500 mt-1">Your full giving history with Greenhands.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Record a donation</button>
      </div>

      <div className="card overflow-x-auto">
        {error ? <ErrorState message={error} /> : !rows ? <Loading /> : rows.length === 0 ? (
          <EmptyState title="No donations yet" subtitle="Record your first contribution above." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Purpose</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.donation_id}>
                  <td>{d.donation_date}</td>
                  <td>{d.donation_type}</td>
                  <td>{d.donation_type === 'Money' ? `₹${Number(d.amount).toLocaleString('en-IN')}` : '—'}</td>
                  <td>{d.purpose || '—'}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td><Link to={`/donor/donations/${d.donation_id}/receipt`} className="text-xs text-teal-700 font-medium hover:underline">Receipt</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Record a donation">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="field-label">Donation type</label>
            <select className="input" value={form.donation_type} onChange={(e) => setForm({ ...form, donation_type: e.target.value })}>
              <option>Money</option><option>Food</option><option>Clothes</option><option>Books</option><option>Other</option>
            </select>
          </div>
          {form.donation_type === 'Money' && (
            <div><label className="field-label">Amount (₹)</label><input className="input" type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
          )}
          <div><label className="field-label">Date</label><input className="input" type="date" required value={form.donation_date} onChange={(e) => setForm({ ...form, donation_date: e.target.value })} /></div>
          <div><label className="field-label">Purpose</label><input className="input" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Food Distribution Drive" /></div>
          {form.donation_type === 'Money' && (
            <div>
              <label className="field-label">Payment method</label>
              <select className="input" value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
                <option>UPI</option><option>Cash</option><option>Card</option><option>Bank Transfer</option><option>Cheque</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-primary">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
