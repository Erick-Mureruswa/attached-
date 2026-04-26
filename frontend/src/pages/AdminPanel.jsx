import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  UsersIcon, BriefcaseIcon, DocumentTextIcon, TrashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import gsap from '../lib/gsap';

const TABS = ['overview', 'users', 'jobs'];

export default function AdminPanel() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    if (tab === 'overview') {
      api.get('/admin/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
    } else if (tab === 'users') {
      api.get('/admin/users').then(({ data }) => setUsers(data.users)).finally(() => setLoading(false));
    } else {
      api.get('/admin/jobs').then(({ data }) => setJobs(data.jobs)).finally(() => setLoading(false));
    }
  }, [tab]);

  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'expo.out' });
    }
  }, []);

  useEffect(() => {
    if (loading || !contentRef.current) return;
    gsap.from(contentRef.current, { y: 15, opacity: 0, duration: 0.4, ease: 'power3.out' });
  }, [loading, tab]);

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((p) => p.filter((u) => u.id !== id));
      toast.success('User deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs((p) => p.filter((j) => j.id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Failed'); }
  };

  const StatCard = ({ icon: Icon, label, value, accent = '#6366f1' }) => (
    <div className="glass-card p-6 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}1a`, border: `1px solid ${accent}30` }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
        <p className="text-xs text-[#555] mt-0.5">{label}</p>
      </div>
    </div>
  );

  const roleColors = {
    employer: { bg: 'rgba(99,102,241,0.1)', color: '#818cf8', border: 'rgba(99,102,241,0.2)' },
    job_seeker: { bg: 'rgba(34,197,94,0.1)', color: '#4ade80', border: 'rgba(34,197,94,0.2)' },
    admin: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div ref={headerRef} className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <ChartBarIcon className="w-4 h-4 text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            style={tab === t
              ? { background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }
              : { color: '#555', border: '1px solid transparent' }
            }
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : (
        <div ref={contentRef}>
          {tab === 'overview' && stats && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon={UsersIcon} label="Total Users" value={stats.totalUsers} accent="#6366f1" />
              <StatCard icon={UsersIcon} label="Employers" value={stats.employers} accent="#a855f7" />
              <StatCard icon={UsersIcon} label="Job Seekers" value={stats.jobSeekers} accent="#22c55e" />
              <StatCard icon={BriefcaseIcon} label="Total Jobs" value={stats.totalJobs} accent="#f97316" />
              <StatCard icon={DocumentTextIcon} label="Total Applications" value={stats.totalApplications} accent="#eab308" />
            </div>
          )}

          {tab === 'users' && (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <tr>
                      {['Name', 'Email', 'Role', 'Joined', ''].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#444] uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const rc = roleColors[u.role] || { bg: 'rgba(255,255,255,0.04)', color: '#666', border: 'rgba(255,255,255,0.07)' };
                      return (
                        <tr key={u.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td className="px-5 py-3.5 font-medium text-white">{u.name}</td>
                          <td className="px-5 py-3.5 text-[#555]">{u.email}</td>
                          <td className="px-5 py-3.5">
                            <span className="badge" style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                              {u.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[#444]">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => deleteUser(u.id)}
                              className="text-[#2a2a2a] hover:text-red-400 transition-colors p-1 rounded">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {users.length === 0 && <p className="text-center py-8 text-[#444]">No users found.</p>}
              </div>
            </div>
          )}

          {tab === 'jobs' && (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <tr>
                      {['Title', 'Employer', 'Location', 'Type', 'Applicants', 'Posted', ''].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#444] uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <tr key={j.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td className="px-5 py-3.5 font-medium text-white max-w-xs truncate">{j.title}</td>
                        <td className="px-5 py-3.5 text-[#555]">{j.employer_name}</td>
                        <td className="px-5 py-3.5 text-[#555]">{j.location}</td>
                        <td className="px-5 py-3.5">
                          <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: '#555', border: '1px solid rgba(255,255,255,0.07)' }}>
                            {j.type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[#555]">{j.application_count}</td>
                        <td className="px-5 py-3.5 text-[#444]">{new Date(j.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => deleteJob(j.id)}
                            className="text-[#2a2a2a] hover:text-red-400 transition-colors p-1 rounded">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {jobs.length === 0 && <p className="text-center py-8 text-[#444]">No jobs found.</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
