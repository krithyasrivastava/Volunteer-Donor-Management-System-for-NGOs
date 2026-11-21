import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { donorService } from '../../services/resources';
import StatusBadge from '../../components/StatusBadge';
import { Loading, ErrorState, EmptyState } from '../../components/States';

export default function AdminDonorDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    donorService.get(id).then(setData).catch((e) => setError(e.response?.data?.message || 'Failed to load donor.'));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;

  return (
    <div className="space-y-5">
      <Link to="/admin/donors" className="text-sm text-forest-500 hover:text-forest-800">&larr; Back to donors</Link>

      <div className="card flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-forest-600 text-white flex items-center justify-center text-xl font-semibold">
          {data.name[0].toUpperCase()}
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-forest-900">{data.name}</h2>
          <p className="text-sm text-forest-500">{data.email} · {data.phone || 'No phone'} · {data.donor_type}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card"><p className="text-xs text-forest-500">Total donated</p><p className="text-2xl font-display font-bold text-forest-900">₹{Number(data.total_donated).toLocaleString('en-IN')}</p></div>
        <div className="card"><p className="text-xs text-forest-500">Total records</p><p className="text-2xl font-display font-bold text-forest-900">{data.donations.length}</p></div>
        <div className="card"><p className="text-xs text-forest-500">Member since</p><p className="text-2xl font-display font-bold text-forest-900">{new Date(data.created_at).getFullYear()}</p></div>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold text-forest-900 mb-3">Donation history</h3>
        {data.donations.length ? (
          <table className="data-table">
            <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Purpose</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {data.donations.map((d) => (
                <tr key={d.donation_id}>
                  <td>{d.donation_date}</td>
                  <td>{d.donation_type}</td>
                  <td>{d.donation_type === 'Money' ? `₹${Number(d.amount).toLocaleString('en-IN')}` : '—'}</td>
                  <td>{d.purpose || '—'}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td><Link to={`/admin/donations/${d.donation_id}`} className="text-teal-700 text-xs font-medium hover:underline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <EmptyState title="No donations recorded yet" />}
      </div>
    </div>
  );
}
