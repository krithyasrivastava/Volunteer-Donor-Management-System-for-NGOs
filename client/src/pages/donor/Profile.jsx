import { useEffect, useState } from 'react';
import { donorService } from '../../services/resources';
import { Loading, ErrorState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function DonorProfile() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const { push } = useToast();

  const load = () => donorService.myProfile().then((d) => { setData(d); setForm({ name: d.name, phone: d.phone || '', address: d.address || '' }); }).catch((e) => setError(e.response?.data?.message || 'Failed to load profile.'));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await donorService.updateMyProfile(form);
      push('Profile updated.');
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Update failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (error) return <ErrorState message={error} />;
  if (!data || !form) return <Loading />;

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-forest-900">My profile</h2>
        <p className="text-sm text-forest-500 mt-1">Manage your personal details.</p>
      </div>

      <div className="card flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-forest-600 text-white flex items-center justify-center text-xl font-semibold">
          {data.name[0].toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-forest-900">{data.name}</p>
          <p className="text-sm text-forest-500">{data.email} · {data.donor_type}</p>
        </div>
      </div>

      <form onSubmit={save} className="card space-y-4">
        <div><label className="field-label">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="field-label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label className="field-label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </form>
    </div>
  );
}
