import { Link } from 'react-router-dom';

const STATS = [
  { label: 'Active volunteers', value: '120+' },
  { label: 'Community events run', value: '48' },
  { label: 'Funds raised', value: '₹12.4L' },
  { label: 'Volunteer hours logged', value: '3,200+' }
];

const MODULES = [
  { title: 'Volunteer management', desc: 'Approve applications, track skills, availability and participation history in one place.', icon: '🧑‍🤝‍🧑' },
  { title: 'Donor & donation tracking', desc: 'Record every contribution — money, food, clothes or books — with receipts generated automatically.', icon: '💚' },
  { title: 'Event coordination', desc: 'Plan events, define the skills you need, and see who is registered at a glance.', icon: '📅' },
  { title: 'Volunteer–event matching', desc: 'A transparent scoring engine recommends the right volunteers for each event based on skills and availability.', icon: '🎯' }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-sand-50">
      <header className="border-b border-forest-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-forest-700 text-white flex items-center justify-center font-display font-bold">H</div>
            <span className="font-display font-semibold text-forest-900">HEROBANO</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">Log in</Link>
            <Link to="/register" className="btn-primary">Get started</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-teal-700 font-medium text-sm mb-3">Volunteer &amp; Donor Management System</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-forest-900 leading-tight">
            Run your community programs from one calm, organized dashboard.
          </h1>
          <p className="mt-4 text-forest-600 text-lg max-w-lg">
            Greenhands replaces spreadsheets and paper registers with a single system for volunteers,
            donors, donations and events — built for NGOs that need to move fast without losing track of anyone.
          </p>
          <div className="mt-7 flex gap-3">
            <Link to="/register" className="btn-primary px-6 py-3 text-base">Create an account</Link>
            <Link to="/login" className="btn-secondary px-6 py-3 text-base">I already have one</Link>
          </div>
        </div>
        <div className="card">
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl bg-forest-50 p-4">
                <p className="text-2xl font-display font-bold text-forest-800">{s.value}</p>
                <p className="text-xs text-forest-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="font-display text-2xl font-semibold text-forest-900 mb-6">Everything your team needs</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {MODULES.map((m) => (
            <div key={m.title} className="card flex gap-4">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl">{m.icon}</div>
              <div>
                <h3 className="font-semibold text-forest-900">{m.title}</h3>
                <p className="text-sm text-forest-600 mt-1">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-forest-100 py-6 text-center text-sm text-forest-500">
        Greenhands Community Foundation — Volunteer &amp; Donor Management System
      </footer>
    </div>
  );
}
