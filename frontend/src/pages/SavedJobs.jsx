import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import gsap from '../lib/gsap';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const fetchSaved = () =>
    api.get('/saved-jobs').then(({ data }) => setJobs(data)).finally(() => setLoading(false));

  useEffect(() => { fetchSaved(); }, []);

  useLayoutEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'expo.out' });
    }
  }, []);

  useEffect(() => {
    if (!jobs.length || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.saved-card');
    gsap.fromTo(cards,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power3.out', clearProps: 'all' },
    );
  }, [jobs]);

  const handleUnsave = async (id) => {
    try {
      await api.post(`/save-job/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success('Job removed from saved');
    } catch { toast.error('Failed to unsave'); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div ref={headerRef} className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <BookmarkIcon className="w-4 h-4 text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Saved Jobs</h1>
          <p className="text-xs text-[#555]">{jobs.length} saved</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : jobs.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <BookmarkIcon className="w-10 h-10 text-[#2a2a2a] mx-auto mb-4" />
          <p className="text-white font-medium">No saved jobs yet</p>
          <p className="text-sm text-[#555] mt-1">Bookmark jobs while browsing to save them here.</p>
          <Link to="/" className="btn-primary mt-6 inline-flex">Browse Jobs</Link>
        </div>
      ) : (
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="saved-card">
              <JobCard job={job} saved onSave={handleUnsave} showSave />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
