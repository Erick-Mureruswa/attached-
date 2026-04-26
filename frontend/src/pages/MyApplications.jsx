import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import gsap from '../lib/gsap';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    api.get('/applications').then(({ data }) => setApps(data)).finally(() => setLoading(false));
  }, []);

  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'expo.out' });
    }
  }, []);

  useEffect(() => {
    if (!apps.length || !listRef.current) return;
    const items = listRef.current.querySelectorAll('.app-item');
    gsap.fromTo(items,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out', clearProps: 'all' },
    );
  }, [apps]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div ref={headerRef} className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <DocumentTextIcon className="w-4 h-4 text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">My Applications</h1>
          <p className="text-xs text-[#555]">{apps.length} total</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : apps.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <DocumentTextIcon className="w-10 h-10 text-[#2a2a2a] mx-auto mb-4" />
          <p className="text-white font-medium">No applications yet</p>
          <p className="text-sm text-[#555] mt-1">Start applying to jobs to see them here.</p>
          <Link to="/" className="btn-primary mt-6 inline-flex">Browse Jobs</Link>
        </div>
      ) : (
        <div ref={listRef} className="space-y-3">
          {apps.map((app) => (
            <div key={app.id} className="app-item glass-card p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/jobs/${app.job_id}`}
                  className="font-semibold text-white hover:text-brand-400 transition-colors flex items-center gap-1.5 text-sm"
                >
                  {app.job_title}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3 text-[#444]" />
                </Link>
                <p className="text-xs text-[#555] mt-0.5">{app.employer_name}{app.location ? ` · ${app.location}` : ''}</p>
                <p className="text-xs text-[#444] mt-1">
                  Applied {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {app.cv_path && (
                  <a href={`/${app.cv_path}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    View CV
                  </a>
                )}
                <StatusBadge status={app.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
