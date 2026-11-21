const MAP = {
  Approved: 'badge-green',
  Completed: 'badge-green',
  Active: 'badge-green',
  Pending: 'badge-amber',
  Applied: 'badge-amber',
  Ongoing: 'badge-teal',
  Upcoming: 'badge-teal',
  Rejected: 'badge-red',
  Cancelled: 'badge-red',
  Inactive: 'badge-gray'
};

export default function StatusBadge({ status }) {
  return <span className={MAP[status] || 'badge-gray'}>{status}</span>;
}
