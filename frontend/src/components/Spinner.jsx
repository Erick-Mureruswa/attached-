export default function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className={`${s} rounded-full animate-spin`}
      style={{
        border: '2px solid rgba(99,102,241,0.15)',
        borderTopColor: '#6366f1',
        boxShadow: '0 0 12px rgba(99,102,241,0.2)',
      }} />
  );
}
