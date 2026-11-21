import { NavLink } from 'react-router-dom';

const NAV = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/volunteers', label: 'Volunteers', icon: '🧑‍🤝‍🧑' },
    { to: '/admin/donors', label: 'Donors', icon: '🎁' },
    { to: '/admin/events', label: 'Events', icon: '📅' },
    { to: '/admin/donations', label: 'Donations', icon: '💰' },
    { to: '/admin/applications', label: 'Applications', icon: '📝' },
    { to: '/admin/reports', label: 'Reports', icon: '📈' },
    { to: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ],
  volunteer: [
    { to: '/volunteer', label: 'Dashboard', icon: '📊', end: true },
    { to: '/volunteer/events', label: 'Events', icon: '📅' },
    { to: '/volunteer/my-events', label: 'My Events', icon: '✅' },
    { to: '/volunteer/skills', label: 'Skills', icon: '🛠️' },
    { to: '/volunteer/hours', label: 'My Hours', icon: '⏱️' },
    { to: '/volunteer/profile', label: 'Profile', icon: '👤' }
  ],
  donor: [
    { to: '/donor', label: 'Dashboard', icon: '📊', end: true },
    { to: '/donor/donations', label: 'My Donations', icon: '💚' },
    { to: '/donor/profile', label: 'Profile', icon: '👤' }
  ]
};

export default function Sidebar({ role }) {
  const items = NAV[role] || [];
  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 bg-forest-900 text-forest-50 min-h-screen">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-forest-800">
        <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center font-display font-bold">H</div>
        <span className="font-display font-semibold tracking-tight">HEROBANO</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-forest-700 text-white' : 'text-forest-200 hover:bg-forest-800 hover:text-white'
              }`
            }
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 text-xs text-forest-400 border-t border-forest-800">
        {role.charAt(0).toUpperCase() + role.slice(1)} workspace
      </div>
    </aside>
  );
}
