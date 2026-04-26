import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPinIcon, CurrencyDollarIcon, CalendarIcon, BuildingOfficeIcon,
  ArrowLeftIcon, BookmarkIcon, PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import gsap from '../lib/gsap';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [myApp, setMyApp] = useState(null);
  const [cv, setCv] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({ data }) => setJob(data)).catch(() => navigate('/')).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.role === 'job_seeker') {
      api.get('/saved-jobs').then(({ data }) => setSaved(data.some((j) => j.id === parseInt(id)))).catch(() => {});
      api.get('/applications').then(({ data }) => setMyApp(data.find((a) => a.job_id === parseInt(id)) || null)).catch(() => {});
    }
  }, [user, id]);

  useLayoutEffect(() => {
    if (!job || !cardRef.current) return;
    gsap.from(cardRef.current, { y: 30, opacity: 0, duration: 0.6, ease: 'expo.out' });
  }, [job]);

  const handleSave = async () => {
    if (!user) { toast.error('Sign in to save jobs'); return; }
    try {
      const { data } = await api.post(`/save-job/${id}`);
      setSaved(data.saved);
      toast.success(data.message);
    } catch { toast.error('Failed to save'); }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!cv) { toast.error('Please upload your CV'); return; }
    setApplying(true);
    try {
      const fd = new FormData();
      fd.append('cv', cv);
      fd.append('cover_letter', coverLetter);
      await api.post(`/jobs/${id}/apply`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted!');
      setShowForm(false);
      api.get('/applications').then(({ data }) => setMyApp(data.find((a) => a.job_id === parseInt(id)) || null));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center py-32"><Spinner size="lg" /></div>;
  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors mb-8"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Back
      </button>

      <div ref={cardRef} className="glass-card p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                {job.type}
              </span>
              {job.category && (
                <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: '#666', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {job.category}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{job.title}</h1>
            <div className="flex items-center gap-1.5 mt-1.5 text-[#555]">
              <BuildingOfficeIcon className="w-4 h-4" />
              <span className="text-sm">{job.employer_name}</span>
            </div>
          </div>
          {user?.role === 'job_seeker' && (
            <button onClick={handleSave} className="btn-secondary text-sm py-2 flex items-center gap-2">
              {saved ? <BookmarkSolid className="w-4 h-4 text-brand-400" /> : <BookmarkIcon className="w-4 h-4" />}
              {saved ? 'Saved' : 'Save Job'}
            </button>
          )}
        </div>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#555] pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {job.location && (
            <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4 text-[#444]" />{job.location}</span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1.5"><CurrencyDollarIcon className="w-4 h-4 text-[#444]" />{job.salary}</span>
          )}
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-[#444]" />
            {new Date(job.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-[#444]">{job.application_count} applicant{job.application_count !== 1 ? 's' : ''}</span>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-white mb-4">Job Description</h2>
          <div className="text-sm text-[#666] whitespace-pre-line leading-relaxed">{job.description}</div>
        </div>

        {/* CTA */}
        <div className="mt-10 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {!user && (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-primary">Sign in to Apply</Link>
              <span className="text-sm text-[#555]">
                or <Link to="/register" className="text-brand-400 hover:text-brand-300 transition-colors">create an account</Link>
              </span>
            </div>
          )}
          {user?.role === 'job_seeker' && (
            myApp ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#555]">Your application:</span>
                <StatusBadge status={myApp.status} />
              </div>
            ) : (
              <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                <PaperAirplaneIcon className="w-4 h-4" />
                {showForm ? 'Cancel' : 'Apply Now'}
              </button>
            )
          )}
          {user?.role === 'employer' && job.user_id === user.id && (
            <div className="flex gap-3">
              <Link to={`/edit-job/${job.id}`} className="btn-secondary">Edit Job</Link>
              <Link to={`/employer?job=${job.id}`} className="btn-primary">View Applicants</Link>
            </div>
          )}
        </div>

        {/* Apply form */}
        {showForm && (
          <form onSubmit={handleApply} className="mt-6 pt-6 space-y-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="font-semibold text-white">Submit your application</h3>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1.5 uppercase tracking-widest">
                CV / Resume <span className="text-red-400">*</span>
              </label>
              <input
                type="file" accept=".pdf,.doc,.docx" required
                onChange={(e) => setCv(e.target.files[0])}
                className="block w-full text-sm text-[#666] cursor-pointer
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                  file:bg-brand-500/10 file:text-brand-400 file:text-xs file:font-medium
                  hover:file:bg-brand-500/20 transition-all"
              />
              <p className="text-xs text-[#444] mt-1">PDF, DOC or DOCX · max 5 MB</p>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1.5 uppercase tracking-widest">
                Cover Letter <span className="text-[#444]">(optional)</span>
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                className="input resize-none"
                placeholder="Tell the employer why you're a great fit…"
              />
            </div>
            <button type="submit" disabled={applying} className="btn-primary">
              {applying ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
