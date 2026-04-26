import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BriefcaseIcon, Bars3Icon, XMarkIcon,
  ChevronDownIcon, UserCircleIcon,
} from '@heroicons/react/24/outline';
import gsap from '../lib/gsap';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -80, opacity: 0, duration: 0.8, ease: 'expo.out', delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const addRipple = (e) => {
    const btn = e.currentTarget;
    const r = document.createElement('span');
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();
    r.className = 'ripple';
    Object.assign(r.style, {
      width: d + 'px', height: d + 'px',
      left: e.clientX - rect.left - d / 2 + 'px',
      top: e.clientY - rect.top - d / 2 + 'px',
    });
    btn.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  };

  const navLinkCls = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 relative group ${isActive ? 'text-white' : 'text-[#666] hover:text-white'}`;

  return (
    <header ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(8,8,8,0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <BriefcaseIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">Attached</span>
            <span className="hidden sm:block text-[10px] font-medium px-1.5 py-0.5 rounded-full text-[#818cf8]"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
              ZW
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={navLinkCls}>
              {({ isActive }) => (
                <>Browse Jobs
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-brand-400 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </>
              )}
            </NavLink>
            {user?.role === 'employer' && (
              <NavLink to="/employer" className={navLinkCls}>
                {({ isActive }) => (
                  <>My Postings
                    <span className={`absolute -bottom-0.5 left-0 h-px bg-brand-400 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </>
                )}
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkCls}>
                {({ isActive }) => (
                  <>Admin
                    <span className={`absolute -bottom-0.5 left-0 h-px bg-brand-400 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </>
                )}
              </NavLink>
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[#bbb] hover:text-white transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.06)', background: dropOpen ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)' }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-300 ${dropOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl py-2 z-50"
                    style={{ background: 'rgba(14,14,14,0.95)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                    <div className="px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-[#555] capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                    {[
                      { to: '/dashboard', label: 'Dashboard' },
                      ...(user.role === 'job_seeker' ? [
                        { to: '/my-applications', label: 'My Applications' },
                        { to: '/saved-jobs', label: 'Saved Jobs' },
                      ] : []),
                      ...(user.role === 'employer' ? [{ to: '/post-job', label: 'Post a Job' }] : []),
                    ].map(({ to, label }) => (
                      <Link key={to} to={to}
                        className="block px-4 py-2 text-sm text-[#999] hover:text-white hover:bg-white/5 transition-colors">
                        {label}
                      </Link>
                    ))}
                    <div className="border-t mt-1 pt-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign in</Link>
                <Link to="/register" className="btn-primary ripple-btn text-sm py-2 px-4" onClick={addRipple}>
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-[#666] hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mx-4 mb-3 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(12,12,12,0.98)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          <div className="p-3 space-y-0.5">
            {[
              { to: '/', label: 'Browse Jobs', end: true },
              ...(user ? [
                { to: '/dashboard', label: 'Dashboard' },
                ...(user.role === 'job_seeker' ? [
                  { to: '/my-applications', label: 'My Applications' },
                  { to: '/saved-jobs', label: 'Saved Jobs' },
                ] : []),
                ...(user.role === 'employer' ? [
                  { to: '/employer', label: 'My Postings' },
                  { to: '/post-job', label: 'Post a Job' },
                ] : []),
                ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
              ] : []),
            ].map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'text-white bg-white/5' : 'text-[#777] hover:text-white hover:bg-white/5'}`}>
                {label}
              </NavLink>
            ))}

            {user ? (
              <button onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/5 transition-colors">
                Sign out
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="btn-secondary flex-1 justify-center py-2.5 text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary flex-1 justify-center py-2.5 text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
