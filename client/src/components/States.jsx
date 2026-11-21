export function EmptyState({ title = 'Nothing here yet', subtitle, icon = '🌱' }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="h-12 w-12 rounded-full bg-forest-100 flex items-center justify-center text-2xl mb-3">{icon}</div>
      <p className="font-medium text-forest-800">{title}</p>
      {subtitle && <p className="text-sm text-forest-500 mt-1 max-w-sm">{subtitle}</p>}
    </div>
  );
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-14 text-forest-500">
      <span className="h-5 w-5 rounded-full border-2 border-forest-200 border-t-forest-600 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
      {message}
    </div>
  );
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-card border border-forest-100 p-5">
        <h3 className="font-display font-semibold text-forest-900 mb-1">{title}</h3>
        <p className="text-sm text-forest-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
