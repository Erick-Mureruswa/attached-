import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, CurrencyDollarIcon, ClockIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import gsap from '../lib/gsap';
import { use3DTilt } from '../hooks/use3DTilt';

const typeColors = {
  'Full-time':  { bg: 'rgba(34,197,94,0.1)',  text: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  'Part-time':  { bg: 'rgba(234,179,8,0.1)',   text: '#facc15', border: 'rgba(234,179,8,0.2)' },
  'Contract':   { bg: 'rgba(249,115,22,0.1)',  text: '#fb923c', border: 'rgba(249,115,22,0.2)' },
  'Remote':     { bg: 'rgba(59,130,246,0.1)',  text: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  'Internship': { bg: 'rgba(167,139,250,0.1)', text: '#c4b5fd', border: 'rgba(167,139,250,0.2)' },
};

export default function JobCard({ job, saved, onSave, showSave = false }) {
  const tiltRef = use3DTilt(8);
  const glowRef = useRef(null);

  const ago = (date) => {
    const d = Math.floor((Date.now() - new Date(date)) / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    return `${d}d ago`;
  };

  const typeStyle = typeColors[job.type] || { bg: 'rgba(255,255,255,0.05)', text: '#888', border: 'rgba(255,255,255,0.1)' };

  const handleMouseMove = (e) => {
    if (!glowRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(glowRef.current, {
      x: x - 80, y: y - 80,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
  };

  const handleClick = (e) => {
    const btn = e.currentTarget;
    gsap.fromTo(btn, { scale: 0.96 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.5)' });
  };

  return (
    <div
      ref={tiltRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative p-5 flex flex-col gap-4 cursor-default overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '18px',
        backdropFilter: 'blur(10px)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Cursor glow */}
      <div ref={glowRef} className="pointer-events-none absolute w-40 h-40 rounded-full opacity-0"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(2px)' }} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="badge text-[11px]" style={{ background: typeStyle.bg, color: typeStyle.text, border: `1px solid ${typeStyle.border}` }}>
              {job.type}
            </span>
            {job.category && (
              <span className="badge text-[11px]" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                {job.category}
              </span>
            )}
          </div>
          <Link to={`/jobs/${job.id}`} onClick={handleClick}>
            <h3 className="text-sm font-semibold text-white hover:text-brand-400 transition-colors line-clamp-1 leading-snug">
              {job.title}
            </h3>
          </Link>
          <p className="text-[12px] text-[#555] mt-0.5 font-medium">{job.employer_name}</p>
        </div>
        {showSave && (
          <button onClick={() => onSave(job.id)} title={saved ? 'Unsave' : 'Save'}
            className="flex-shrink-0 p-1.5 rounded-lg text-[#333] hover:text-brand-400 transition-all hover:bg-brand-500/10">
            {saved ? <BookmarkSolid className="w-4 h-4 text-brand-400" /> : <BookmarkIcon className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-[#555] line-clamp-2 leading-relaxed relative z-10">{job.description}</p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[11px] text-[#444] flex-wrap relative z-10">
        {job.location && <span className="flex items-center gap-1"><MapPinIcon className="w-3 h-3" />{job.location}</span>}
        {job.salary && <span className="flex items-center gap-1"><CurrencyDollarIcon className="w-3 h-3" />{job.salary}</span>}
        <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" />{ago(job.created_at)}</span>
        {job.application_count !== undefined && (
          <span className="ml-auto">{job.application_count} applied</span>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Link to={`/jobs/${job.id}`}
          className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1 group"
          onClick={handleClick}>
          View details
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}
