export default function KpiCard({ label, value, icon, accent = 'forest' }) {
  const accents = {
    forest: 'bg-forest-100 text-forest-700',
    teal: 'bg-teal-100 text-teal-700',
    amber: 'bg-amber-100 text-amber-700'
  };
  return (
    <div className="card flex items-center gap-4">
      <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center text-lg ${accents[accent]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-forest-500 truncate">{label}</p>
        <p className="text-2xl font-display font-bold text-forest-900 truncate">{value}</p>
      </div>
    </div>
  );
}
