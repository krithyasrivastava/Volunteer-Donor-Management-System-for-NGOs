import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { donationService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function AdminDonationDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const { push } = useToast();

  const load = () => donationService.get(id).then(setData).catch((e) => setError(e.response?.data?.message || 'Failed to load donation.'));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const setStatus = async (status) => {
    try {
      await donationService.update(id, { status });
      push(`Donation marked as ${status}.`);
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Update failed.', 'error');
    }
  };

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  return (
    <div className="max-w-2xl space-y-5">
      <Link to="/admin/donations" className="text-sm text-forest-500 hover:text-forest-800">&larr; Back to donations</Link>

      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-forest-900">Donation #{data.donation_id}</h2>
            <p className="text-sm text-forest-500 mt-1">{data.transaction_id}</p>
          </div>
          <StatusBadge status={data.status} />
        </div>

        <dl className="grid grid-cols-2 gap-4 mt-6 text-sm">
          <div><dt className="text-forest-500">Donor</dt><dd className="text-forest-800 font-medium">{data.donor_name}</dd></div>
          <div><dt className="text-forest-500">Email</dt><dd className="text-forest-800">{data.donor_email}</dd></div>
          <div><dt className="text-forest-500">Type</dt><dd className="text-forest-800">{data.donation_type}</dd></div>
          <div><dt className="text-forest-500">Amount</dt><dd className="text-forest-800">{data.donation_type === 'Money' ? `₹${Number(data.amount).toLocaleString('en-IN')}` : '—'}</dd></div>
          <div><dt className="text-forest-500">Purpose</dt><dd className="text-forest-800">{data.purpose || '—'}</dd></div>
          <div><dt className="text-forest-500">Date</dt><dd className="text-forest-800">{data.donation_date}</dd></div>
          <div><dt className="text-forest-500">Payment method</dt><dd className="text-forest-800">{data.payment_method}</dd></div>
        </dl>

        <div className="flex gap-2 mt-6">
          <button className="btn-secondary" onClick={() => setStatus('Completed')}>Mark completed</button>
          <button className="btn-secondary" onClick={() => setStatus('Pending')}>Mark pending</button>
          <button className="btn-danger" onClick={() => setStatus('Cancelled')}>Cancel</button>
          <Link to={`/admin/donations/${id}/receipt`} className="btn-primary ml-auto">View receipt</Link>
        </div>
      </div>
    </div>
  );
}
