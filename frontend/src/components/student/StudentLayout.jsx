import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome, HiCalendar, HiClipboardList, HiAcademicCap, HiUser, HiLogout, HiMenu, HiX
} from 'react-icons/hi';

const navItems = [
  { to: '/student', label: 'Dashboard', icon: HiHome, end: true },
  { to: '/student/events', label: 'Browse Events', icon: HiCalendar },
  { to: '/student/my-events', label: 'My Events', icon: HiClipboardList },
  { to: '/student/certificates', label: 'Certificates', icon: HiAcademicCap },
  { to: '/student/profile', label: 'Profile', icon: HiUser },
];

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-4' : 'p-6'}`}>

      {/* User */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-royal-500 to-accent-purple flex items-center justify-center font-display font-bold text-white">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-white text-sm truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || user?.regNo}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 min-h-0 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} className="sidebar-link text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-auto">
        <HiLogout size={18} />
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <div className="pt-[70px] flex min-h-[calc(100vh-70px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-70px)] sticky top-[70px] bg-navy-900/80 backdrop-blur-xl border-r border-white/5 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar Overlay */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <React.Fragment key="sidebar">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-navy-900 border-r border-white/5 z-50 flex flex-col h-full overflow-hidden"
            >
              <div className="flex justify-end p-4">
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                  <HiX size={22} />
                </button>
              </div>
              <Sidebar mobile />
            </motion.aside>
          </React.Fragment>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-navy-900/80 border-b border-white/5">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white">
            <HiMenu size={22} />
          </button>
          <span className="font-display font-bold text-white text-sm">Campus<span className="text-gradient-blue">Hub</span></span>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal-500 to-accent-purple flex items-center justify-center font-display font-bold text-white text-xs">
            {user?.name?.charAt(0)}
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-mesh">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  </div>
  );
};

export default StudentLayout;
