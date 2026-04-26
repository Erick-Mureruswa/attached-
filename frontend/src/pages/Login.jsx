import { useState, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import gsap from '../lib/gsap';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
          <h1 className="text-2xl font-bold text-white">Sign in</h1>
          <p className="mt-1.5 text-sm text-[#555]">Welcome back to Attached</p>
        </div>

        <div className="glass-card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1.5 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1.5 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password" required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#444] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
