const map = {
  Pending:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  Reviewed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Accepted: 'bg-green-500/10 text-green-400 border border-green-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${map[status] || 'bg-white/5 text-gray-400 border border-white/10'}`}>
      {status}
    </span>
  );
}
