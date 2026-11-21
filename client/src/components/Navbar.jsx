import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-forest-100 bg-white/90 backdrop-blur px-4 md:px-6 py-3.5">
      <h1 className="font-display font-semibold text-lg text-forest-900">{title}</h1>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-forest-50"
        >
          <div className="h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <span className="hidden sm:block text-sm font-medium text-forest-800">{user?.name}</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-lg border border-forest-100 bg-white shadow-card py-1">
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full text-left px-3 py-2 text-sm text-forest-700 hover:bg-forest-50"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
