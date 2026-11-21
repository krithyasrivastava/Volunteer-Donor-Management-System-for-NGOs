import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

export default function Register() {
  const [role, setRole] = useState('volunteer');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', availability: 'Flexible', donor_type: 'Individual' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await register({ role, ...form });
      push('Account created! Welcome to Greenhands.');
      if (role === 'volunteer') {
        push('Your application is pending admin approval before you can apply to events.', 'info');
      }
      navigate(`/${data.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="h-9 w-9 rounded-lg bg-forest-700 text-white flex items-center justify-center font-display font-bold">H</div>
          <span className="font-display font-semibold text-forest-900 text-lg">HEROBANO</span>
        </div>

        <div className="card">
          <h1 className="font-display text-xl font-semibold text-forest-900 mb-1">Create your account</h1>
          <p className="text-sm text-forest-500 mb-5">Join as a volunteer or register as a donor.</p>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {['volunteer', 'donor'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize ${
                  role === r ? 'border-forest-600 bg-forest-50 text-forest-800' : 'border-forest-200 text-forest-500'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {error && <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="field-label">Full name</label>
              <input className="input" value={form.name} onChange={set('name')} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Email</label>
                <input className="input" type="email" value={form.email} onChange={set('email')} required />
              </div>
              <div>
                <label className="field-label">Phone</label>
                <input className="input" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div>
              <label className="field-label">Password</label>
              <input className="input" type="password" value={form.password} onChange={set('password')} required minLength={6} />
            </div>
            <div>
              <label className="field-label">Address</label>
              <input className="input" value={form.address} onChange={set('address')} />
            </div>

            {role === 'volunteer' ? (
              <div>
                <label className="field-label">Availability</label>
                <select className="input" value={form.availability} onChange={set('availability')}>
                  <option>Flexible</option>
                  <option>Weekdays</option>
                  <option>Weekends</option>
                  <option>Evenings</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="field-label">Donor type</label>
                <select className="input" value={form.donor_type} onChange={set('donor_type')}>
                  <option>Individual</option>
                  <option>Organization</option>
                </select>
              </div>
            )}

            <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
          </form>
        </div>

        <p className="text-sm text-center text-forest-500 mt-5">
          Already have an account? <Link to="/login" className="text-teal-700 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
