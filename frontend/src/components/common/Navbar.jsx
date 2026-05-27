import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const getDashboardLink = () => {
    if (role === 'student') return '/student';
    if (role === 'organizer') return '/organizer';
    if (role === 'admin') return '/admin';
    return '/login';
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Events', to: '/events' },
    { label: 'Clubs', to: '/clubs' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const roleNav = {
    student: [
      { label: 'Dashboard', to: '/student' },
      { label: 'Browse Events', to: '/student/events' },
      { label: 'My Events', to: '/student/my-events' },
      { label: 'Certificates', to: '/student/certificates' },
      { label: 'Profile', to: '/student/profile' },
    ],
    organizer: [
      { label: 'Dashboard', to: '/organizer' },
      { label: 'Manage Events', to: '/organizer/events' },
      { label: 'Upload Certificates', to: '/organizer/certificates' },
    ],
    admin: [
      { label: 'Dashboard', to: '/admin' },
      { label: 'Students', to: '/admin/students' },
      { label: 'Organizers', to: '/admin/organizers' },
      { label: 'Clubs', to: '/admin/clubs' },
      { label: 'Events', to: '/admin/events' },
    ],
  };

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleDocClick = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  return (
    <>
      <motion.nav
        id="navbar"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
      >
        <Link to="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
          <div className="nav-logo-icon">🎓</div>
          <span className="nav-logo-text">CampusHub</span>
        </Link>

        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={isActive(link.to) ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions relative">
          {!user ? (
            <>
              <Link to="/login" className="btn-nav btn-outline-nav" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn-nav btn-primary-nav btn-register" onClick={() => setMobileOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3" ref={profileRef}>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(p => !p)}
                  onMouseEnter={() => setProfileOpen(true)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-royal-400 to-accent-purple flex items-center justify-center text-white font-display font-bold"
                  title={user?.name}
                >
                  {user?.name?.charAt(0) || 'U'}
                </button>

                {profileOpen && (
                  <div onMouseLeave={() => setProfileOpen(false)} onMouseEnter={() => setProfileOpen(true)} className="absolute right-0 mt-2 w-56 bg-navy-900/95 border border-white/5 rounded-xl shadow-lg z-50 py-2">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{role || 'Member'}</p>
                    </div>
                    <nav className="py-2 flex flex-col">
                      {(roleNav[role] || roleNav['student']).map(item => (
                        <Link key={item.to} to={item.to} onClick={() => { setProfileOpen(false); setMobileOpen(false); }}
                          className={`px-4 py-2 text-sm ${location.pathname === item.to || location.pathname.startsWith(item.to + '/') ? 'text-royal-300 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                          {item.label}
                        </Link>
                      ))}
                      <button onClick={() => { handleLogout(); setProfileOpen(false); }} className="text-left px-4 py-2 text-sm text-red-400 hover:text-red-300">Logout</button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="hamburger"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
              >
                {link.label === 'Home' ? '🏠 Home' : link.label === 'Events' ? '📅 Events' : link.label === 'Clubs' ? '🎯 Clubs' : link.label === 'Announcements' ? '📢 Announcements' : link.label === 'About' ? 'ℹ️ About' : '✉️ Contact'}
              </Link>
            ))}

            <div className="mobile-menu-actions">
              {!user ? (
                <>
                  <Link to="/login" className="btn-nav btn-outline-nav" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-nav btn-primary-nav btn-register" onClick={() => setMobileOpen(false)}>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <button className="btn-nav btn-outline-nav" onClick={handleLogout}>
                    Logout
                  </button>
                  <Link to={getDashboardLink()} className="btn-nav btn-primary-nav" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
