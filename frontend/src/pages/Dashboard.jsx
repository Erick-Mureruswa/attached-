import { useLayoutEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon, BookmarkIcon, DocumentTextIcon,
  PlusCircleIcon, UsersIcon, ChartBarIcon,
} from '@heroicons/react/24/outline';
import gsap from '../lib/gsap';
import { use3DTilt } from '../hooks/use3DTilt';

const TiltCard = ({ to, icon: Icon, title, desc, accent, delay }) => {
  const tiltRef = use3DTilt(6);
  return (
    <Link ref={tiltRef} to={to}
      className="dash-card p-6 flex flex-col gap-5 cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '18px',
        backdropFilter: 'blur(10px)',
        transformStyle: 'preserve-3d',
        opacity: 0,
      }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}1a`, border: `1px solid ${accent}30` }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div>
        <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">{title}</h3>
        <p className="text-sm text-[#555] mt-1">{desc}</p>
      </div>
      <span className="text-xs text-brand-400 mt-auto inline-flex items-center gap-1 group">
        Open <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const cards = {
    job_seeker: [
      { to: '/', icon: BriefcaseIcon, title: 'Browse Jobs', desc: 'Discover opportunities from top employers', accent: '#6366f1' },
      { to: '/my-applications', icon: DocumentTextIcon, title: 'My Applications', desc: 'Track the status of your submissions', accent: '#22c55e' },
      { to: '/saved-jobs', icon: BookmarkIcon, title: 'Saved Jobs', desc: 'Revisit jobs you bookmarked', accent: '#eab308' },
    ],
    employer: [
      { to: '/post-job', icon: PlusCircleIcon, title: 'Post a Job', desc: 'Reach thousands of qualified candidates', accent: '#6366f1' },
      { to: '/employer', icon: BriefcaseIcon, title: 'My Postings', desc: 'Manage your active job listings', accent: '#22c55e' },
      { to: '/employer', icon: UsersIcon, title: 'Applicants', desc: 'Review and manage candidates', accent: '#a855f7' },
    ],
    admin: [
      { to: '/admin', icon: ChartBarIcon, title: 'Platform Stats', desc: 'Monitor users, jobs, and activity', accent: '#6366f1' },
      { to: '/admin', icon: UsersIcon, title: 'Manage Users', desc: 'View and moderate all registered users', accent: '#f97316' },
      { to: '/admin', icon: BriefcaseIcon, title: 'Manage Jobs', desc: 'Review and remove job postings', accent: '#ef4444' },
    ],
  };

  const roleLabel = { job_seeker: 'Job Seeker', employer: 'Employer', admin: 'Administrator' };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(headerRef.current, { y: 20, opacity: 0, duration: 0.6 })
        .to(gridRef.current.querySelectorAll('.dash-card'), {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          from: { y: 30, opacity: 0 },
        }, '-=0.2');
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <div ref={headerRef} className="mb-12">
        <p className="text-[11px] font-medium uppercase tracking-widest text-brand-400 mb-2">
          {roleLabel[user.role]}
        </p>
        <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}</h1>
        <p className="mt-2 text-[#555]">Here's your dashboard overview.</p>
      </div>

      <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(cards[user.role] || []).map((card, i) => (
          <TiltCard key={card.title} {...card} delay={i} />
        ))}
      </div>
    </div>
  );
}
