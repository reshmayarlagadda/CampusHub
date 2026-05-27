import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { HiUsers, HiCalendar, HiClipboardList, HiAcademicCap, HiUserGroup, HiOfficeBuilding, HiShieldCheck, HiTrendingUp } from 'react-icons/hi';

const StatCard = ({ icon: Icon, label, value, color, gradient, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className={`glass-card p-5 relative overflow-hidden border hover:shadow-glow-blue transition-all duration-300 ${gradient}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm mb-2">{label}</p>
        <p className={`font-display font-bold text-3xl ${color}`}>{value ?? '—'}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => setStats(r.data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statItems = stats ? [
    { icon: HiUsers, label: 'Total Students', value: stats.totalStudents, color: 'text-royal-400', gradient: 'border-royal-500/20', delay: 0.05 },
    { icon: HiTrendingUp, label: 'Verified Students', value: stats.verifiedStudents, color: 'text-green-400', gradient: 'border-green-500/20', delay: 0.1 },
    { icon: HiCalendar, label: 'Total Events', value: stats.totalEvents, color: 'text-accent-cyan', gradient: 'border-cyan-500/20', delay: 0.15 },
    { icon: HiCalendar, label: 'Upcoming Events', value: stats.upcomingEvents, color: 'text-yellow-400', gradient: 'border-yellow-500/20', delay: 0.2 },
    { icon: HiClipboardList, label: 'Total Registrations', value: stats.totalRegistrations, color: 'text-accent-purple', gradient: 'border-purple-500/20', delay: 0.25 },
    { icon: HiAcademicCap, label: 'Certificates Issued', value: stats.totalCertificates, color: 'text-pink-400', gradient: 'border-pink-500/20', delay: 0.3 },
    { icon: HiUserGroup, label: 'Organizers', value: stats.totalOrganizers, color: 'text-orange-400', gradient: 'border-orange-500/20', delay: 0.35 },
    { icon: HiOfficeBuilding, label: 'Clubs', value: stats.totalClubs, color: 'text-teal-400', gradient: 'border-teal-500/20', delay: 0.4 },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-royal-500/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <HiShieldCheck className="text-accent-purple" size={18} />
            <span className="text-accent-purple text-sm font-mono font-semibold">Super Admin</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">Welcome, {user?.name} 👋</h1>
          <p className="text-slate-400">Platform overview and management dashboard.</p>
        </div>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="glass-card h-24 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
