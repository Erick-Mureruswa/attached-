import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import gsap from '../lib/gsap';

const CATEGORIES = ['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Engineering', 'Sales', 'Other'];
const TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({ data }) =>
      setForm({ title: data.title, description: data.description, salary: data.salary || '', location: data.location, category: data.category || '', type: data.type })
    ).catch(() => navigate('/employer'));
  }, [id]);

  useLayoutEffect(() => {
    if (!form || !containerRef.current) return;
    gsap.from(containerRef.current.children, {
      y: 25, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out',
    });
  }, [!!form]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/jobs/${id}`, form);
      toast.success('Job updated successfully!');
      navigate('/employer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const Label = ({ children }) => (
    <label className="block text-[11px] font-medium text-[#555] mb-1.5 uppercase tracking-widest">{children}</label>
  );

  if (!form) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div ref={containerRef}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Edit Job</h1>
          <p className="text-sm text-[#555] mt-1">Update the listing details.</p>
        </div>
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Job Title <span className="text-red-400">*</span></Label>
              <input required value={form.title} onChange={set('title')} className="input" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Location <span className="text-red-400">*</span></Label>
                <input required value={form.location} onChange={set('location')} className="input" />
              </div>
              <div>
                <Label>Salary</Label>
                <input value={form.salary} onChange={set('salary')} className="input" />
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
              <textarea required value={form.description} onChange={set('description')} rows={8} className="input resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => navigate('/employer')} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
