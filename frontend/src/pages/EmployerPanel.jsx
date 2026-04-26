import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  PlusCircleIcon, PencilSquareIcon, TrashIcon,
  ChevronDownIcon, ChevronUpIcon, UserIcon,
} from '@heroicons/react/24/outline';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import gsap from '../lib/gsap';

const STATUSES = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];

export default function EmployerPanel() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [loadingApps, setLoadingApps] = useState({});
  const headerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    api.get('/jobs/my').then(({ data }) => {
      setJobs(data);
      const focusId = searchParams.get('job');
      if (focusId) setExpanded(parseInt(focusId));
    }).finally(() => setLoading(false));
  }, []);

  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'expo.out' });
    }
  }, []);

  useEffect(() => {
    if (!jobs.length || !listRef.current) return;
    const items = listRef.current.querySelectorAll('.job-item');
    gsap.fromTo(items,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power3.out', clearProps: 'all' },
    );
  }, [jobs]);

  const toggleApplicants = async (jobId) => {
    if (expanded === jobId) { setExpanded(null); return; }
    setExpanded(jobId);
    if (applicants[jobId]) return;
    setLoadingApps((p) => ({ ...p, [jobId]: true }));
    try {
      const { data } = await api.get(`/jobs/${jobId}/applications`);
      setApplicants((p) => ({ ...p, [jobId]: data }));
    } catch { toast.error('Failed to load applicants'); }
    finally { setLoadingApps((p) => ({ ...p, [jobId]: false })); }
  };

  const updateStatus = async (appId, jobId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      setApplicants((prev) => ({
        ...prev,
        [jobId]: prev[jobId].map((a) => a.id === appId ? { ...a, status } : a),
      }));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job? This will also remove all applications.')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div ref={headerRef} className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Job Postings</h1>
          <p className="text-sm text-[#555] mt-1">{jobs.length} active listing{jobs.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/post-job" className="btn-primary">
          <PlusCircleIcon className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : jobs.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <p className="text-[#555]">You haven't posted any jobs yet.</p>
          <Link to="/post-job" className="btn-primary mt-5 inline-flex">
            <PlusCircleIcon className="w-4 h-4" /> Post Your First Job
          </Link>
        </div>
      ) : (
        <div ref={listRef} className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="job-item glass-card overflow-hidden">
              {/* Job row */}
              <div className="p-5 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">{job.title}</h3>
                  <p className="text-xs text-[#555] mt-0.5">{job.location} · {job.type}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-[#444]">
                    <span className="font-semibold text-white">{job.application_count}</span> applicant{job.application_count !== 1 ? 's' : ''}
                  </span>
                  <Link to={`/edit-job/${job.id}`}
                    className="p-2 text-[#333] hover:text-brand-400 transition-colors rounded-lg hover:bg-brand-500/5" title="Edit">
                    <PencilSquareIcon className="w-4 h-4" />
                  </Link>
                  <button onClick={() => deleteJob(job.id)}
                    className="p-2 text-[#333] hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5" title="Delete">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleApplicants(job.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors px-3 py-1.5 rounded-lg"
                    style={{ border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)' }}
                  >
                    Applicants
                    {expanded === job.id ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Applicants panel */}
              {expanded === job.id && (
                <div className="p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
                  {loadingApps[job.id] ? (
                    <div className="flex justify-center py-6"><Spinner /></div>
                  ) : !applicants[job.id]?.length ? (
                    <p className="text-sm text-[#444] text-center py-4">No applicants yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {applicants[job.id].map((app) => (
                        <div key={app.id} className="glass-card p-4 flex items-center gap-4 flex-wrap">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                            <UserIcon className="w-3.5 h-3.5 text-brand-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-white">{app.applicant_name}</p>
                            <p className="text-xs text-[#555]">{app.applicant_email}</p>
                            {app.cover_letter && (
                              <p className="text-xs text-[#444] mt-1 line-clamp-1 italic">"{app.cover_letter}"</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {app.cv_path && (
                              <a href={`/${app.cv_path}`} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                                View CV
                              </a>
                            )}
                            <select
                              value={app.status}
                              onChange={(e) => updateStatus(app.id, job.id, e.target.value)}
                              className="text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', color: '#ccc' }}
                            >
                              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
