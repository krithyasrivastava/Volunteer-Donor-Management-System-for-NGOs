export default function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-forest-900/40 p-4 pt-16">
      <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-2xl bg-white shadow-card border border-forest-100`}>
        <div className="flex items-center justify-between border-b border-forest-100 px-5 py-4">
          <h3 className="font-display font-semibold text-forest-900">{title}</h3>
          <button onClick={onClose} className="text-forest-400 hover:text-forest-700 text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
