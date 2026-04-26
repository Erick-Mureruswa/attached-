import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, FunnelIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import gsap from '../lib/gsap';
import { ScrollTrigger } from '../lib/gsap';

const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Sales', 'Other'];

const STATS = [
  { label: 'Jobs Posted', value: '10K+' },
  { label: 'Companies', value: '2K+' },
  { label: 'Candidates', value: '50K+' },
  { label: 'Placements', value: '8K+' },
];

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());
  const [filters, setFilters] = useState({ search: '', location: '', category: '' });

  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const h1Ref = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const statsRef = useRef(null);
  const gridRef = useRef(null);

  // Hero entrance — runs once on mount
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(badgeRef.current, { y: 20, opacity: 0, duration: 0.6 })
        .from(h1Ref.current, { y: 40, opacity: 0, duration: 0.7 }, '-=0.3')
        .from(subtitleRef.current, { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
        .from(formRef.current, { y: 25, opacity: 0, duration: 0.6 }, '-=0.3')
        .from(statsRef.current?.children ? Array.from(statsRef.current.children) : [], {
          y: 20, opacity: 0, duration: 0.5, stagger: 0.08,
        }, '-=0.3');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Animate job cards whenever jobs load
  useEffect(() => {
    if (!jobs.length || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.job-card-item');
    if (!cards.length) return;
    gsap.fromTo(cards,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out', clearProps: 'all' },
    );
  }, [jobs]);

  // ScrollTrigger for listings section
  useEffect(() => {
    const section = gridRef.current;
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      onEnter: () => {
        gsap.from(section.querySelector('.filter-bar'), {
          y: 15, opacity: 0, duration: 0.5, ease: 'power3.out',
        });
      },
      once: true,
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const fetchJobs = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/jobs', { params: { ...filters, page: pg, limit: 9 } });
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
      setPage(pg);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(1); }, [fetchJobs]);

  useEffect(() => {
    if (user?.role === 'job_seeker') {
      api.get('/saved-jobs').then(({ data }) => setSavedIds(new Set(data.map((j) => j.id)))).catch(() => {});
    }
  }, [user]);

  const handleSave = async (id) => {
    if (!user) { toast.error('Sign in to save jobs'); return; }
    try {
      const { data } = await api.post(`/save-job/${id}`);
      setSavedIds((prev) => {
        const next = new Set(prev);
        data.saved ? next.add(id) : next.delete(id);
        return next;
      });
      toast.success(data.message);
    } catch {
      toast.error('Failed to save job');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="relative px-4 pt-28 pb-24 overflow-hidden"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="hero-glow" />

        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-brand-400" />
            {total > 0 ? `${total} jobs available right now` : 'New jobs added daily'}
          </div>

          <h1 ref={h1Ref} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            Find work that<br />
            <span className="gradient-text">matters to you</span>
          </h1>

          <p ref={subtitleRef} className="mt-5 text-[#666] text-lg max-w-xl mx-auto leading-relaxed">
            Connect with top companies and land your next role. Thousands of opportunities across every industry.
          </p>

          <form ref={formRef} onSubmit={handleSearch}
            className="mt-10 flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '6px' }}>
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="Job title or keyword..."
                className="w-full bg-transparent border-0 pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none"
              />
            </div>
            <div className="relative sm:w-44" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                value={filters.location}
                onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                placeholder="Location..."
                className="w-full bg-transparent border-0 pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary rounded-[10px] px-6 ml-1 flex-shrink-0">
              Search <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="relative mt-16 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-px"
          style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', overflow: 'hidden' }}>
          {STATS.map(({ label, value }) => (
            <div key={label} className="px-6 py-5 text-center" style={{ background: '#0d0d0d' }}>
              <p className="text-2xl font-bold gradient-text">{value}</p>
              <p className="text-xs text-[#555] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Listings */}
      <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter bar */}
        <div className="filter-bar flex flex-wrap items-center gap-3 mb-8">
          <FunnelIcon className="w-4 h-4 text-[#444]" />
          <select
            value={filters.category}
            onChange={(e) => { setFilters((f) => ({ ...f, category: e.target.value })); }}
            className="input w-auto text-sm py-2"
            style={{ width: 'auto' }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-sm text-[#444] ml-auto">
            {loading ? '…' : `${total} job${total !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg font-medium text-[#555]">No jobs found</p>
            <p className="mt-1 text-sm text-[#444]">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="job-card-item">
                  <JobCard
                    job={job}
                    saved={savedIds.has(job.id)}
                    onSave={handleSave}
                    showSave={user?.role === 'job_seeker'}
                  />
                </div>
              ))}
            </div>

            {pages > 1 && (
              <div className="flex justify-center gap-1.5 mt-12">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchJobs(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      p === page
                        ? 'text-white'
                        : 'text-[#555] hover:text-white hover:bg-white/5'
                    }`}
                    style={p === page
                      ? { background: '#6366f1', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }
                      : { border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
