import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/States';

const TITLES = {
  admin: 'Admin Workspace',
  volunteer: 'Volunteer Workspace',
  donor: 'Donor Workspace'
};

export default function DashboardLayout({ allow }) {
  const { role, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading label="Checking session…" /></div>;
  if (!role) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to={`/${role}`} replace />;

  return (
    <div className="flex min-h-screen bg-sand-50">
      <Sidebar role={role} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar title={TITLES[role]} />
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
