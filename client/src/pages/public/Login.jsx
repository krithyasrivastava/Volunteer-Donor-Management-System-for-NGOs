import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'donor', label: 'Donor' }
];

const DEMO = {
  admin: 'admin@ngo.org',
  volunteer: 'priya.sharma@mail.com',
  donor: 'suresh.agarwal@mail.com'
};

export default function Login() {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState(DEMO.admin);
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const handleRole = (r) => { setRole(r); setEmail(DEMO[r]); };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await login({ role, email, password });
      push(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      navigate(`/${data.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="h-9 w-9 rounded-lg bg-forest-700 text-white flex items-center justify-center font-display font-bold">H</div>
          <span className="font-display font-semibold text-forest-900 text-lg">HEROBANO</span>
        </div>

        <div className="card">
          <h1 className="font-display text-xl font-semibold text-forest-900 mb-1">Log in</h1>
          <p className="text-sm text-forest-500 mb-5">Access your HEROBANO workspace.</p>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => handleRole(r.value)}
                className={`rounded-lg border px-2 py-2 text-sm font-medium ${
                  role === r.value ? 'border-forest-600 bg-forest-50 text-forest-800' : 'border-forest-200 text-forest-500'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {error && <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="field-label">Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
          </form>

          <p className="text-xs text-forest-400 mt-4 text-center">
            Demo password for every seeded account: <span className="font-medium text-forest-600">password123</span>
          </p>
        </div>

        <p className="text-sm text-center text-forest-500 mt-5">
          New volunteer or donor? <Link to="/register" className="text-teal-700 font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
