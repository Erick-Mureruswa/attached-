import { useState, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import gsap from '../lib/gsap';

const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Sales', 'Other'];
const TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', salary: '', location: '', category: '', type: 'Full-time' });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current.children, {
        y: 25, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', form);
      toast.success('Job posted successfully!');
      navigate('/employer');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to post job';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const Label = ({ children }) => (
    <label className="block text-[11px] font-medium text-[#555] mb-1.5 uppercase tracking-widest">{children}</label>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div ref={containerRef}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Post a New Job</h1>
          <p className="text-sm text-[#555] mt-1">Fill in the details to attract the right candidates.</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Job Title <span className="text-red-400">*</span></Label>
              <input required value={form.title} onChange={set('title')} className="input" placeholder="e.g. Senior React Developer" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Location <span className="text-red-400">*</span></Label>
                <input required value={form.location} onChange={set('location')} className="input" placeholder="e.g. Harare, Zimbabwe" />
              </div>
              <div>
                <Label>Salary <span className="text-[#444]">(optional)</span></Label>
                <input value={form.salary} onChange={set('salary')} className="input" placeholder="e.g. $500/month" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <select value={form.category} onChange={set('category')} className="input">
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label>Job Type</Label>
                <select value={form.type} onChange={set('type')} className="input">
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label>Description <span className="text-red-400">*</span></Label>
              <textarea required value={form.description} onChange={set('description')} rows={8}
                className="input resize-none"
                placeholder="Describe the role, responsibilities, requirements, and benefits…" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Posting…' : 'Post Job'}
              </button>
              <button type="button" onClick={() => navigate('/employer')} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
