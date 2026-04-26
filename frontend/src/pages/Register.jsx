import { useState, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import gsap from '../lib/gsap';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'job_seeker' });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current.children, {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
      <div ref={containerRef} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <BriefcaseIcon className="w-6 h-6 text-brand-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="mt-1.5 text-sm text-[#555]">Join thousands of professionals</p>
        </div>

        <div className="glass-card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1.5 uppercase tracking-widest">Full name</label>
              <input type="text" required value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1.5 uppercase tracking-widest">Email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1.5 uppercase tracking-widest">Password</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input" placeholder="At least 6 characters" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-2 uppercase tracking-widest">I am a…</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'job_seeker', label: 'Job Seeker', sub: 'Looking for work' },
                  { value: 'employer', label: 'Employer', sub: 'Hiring talent' },
                ].map(({ value, label, sub }) => (
                  <button
                    key={value} type="button"
                    onClick={() => setForm((f) => ({ ...f, role: value }))}
                    className="p-3 rounded-xl text-left transition-all"
                    style={{
                      border: `1px solid ${form.role === value ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)'}`,
                      background: form.role === value ? 'rgba(99,102,241,0.08)' : 'transparent',
                      boxShadow: form.role === value ? '0 0 12px rgba(99,102,241,0.15)' : 'none',
                    }}
                  >
                    <div className="text-sm font-medium text-white">{label}</div>
                    <div className="text-xs text-[#555] mt-0.5">{sub}</div>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#444] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
