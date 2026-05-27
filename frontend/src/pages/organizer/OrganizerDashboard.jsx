import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { HiCalendar, HiUserGroup, HiAcademicCap, HiArrowRight, HiPlus } from 'react-icons/hi';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events/my-events')
      .then(r => setEvents(r.data.events || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = events.filter(e => new Date(e.date) >= new Date());
  const past = events.filter(e => new Date(e.date) < new Date());

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-royal-500/5" />
        <div className="relative z-10">
          <p className="text-accent-cyan text-sm font-mono font-semibold mb-2">Organizer Dashboard</p>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">Welcome, {user?.name} 👋</h1>
          <p className="text-slate-400">Manage your events, registrations, and certificates.</p>
          {user?.club && <div className="mt-3"><span className="badge-cyan">{user.club.clubName}</span></div>}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: HiCalendar, label: 'Total Events', value: events.length, color: 'text-royal-400', delay: 0.1 },
          { icon: HiCalendar, label: 'Upcoming Events', value: upcoming.length, color: 'text-accent-cyan', delay: 0.15 },
          { icon: HiCalendar, label: 'Past Events', value: past.length, color: 'text-accent-purple', delay: 0.2 },
        ].map(({ icon: Icon, label, value, color, delay }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="stat-card">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${color}`}><Icon size={22} /></div>
            <div><p className="font-display font-bold text-2xl text-white">{value}</p><p className="text-slate-400 text-sm">{label}</p></div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="section-title mb-5">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { to: '/organizer/events', icon: HiPlus, label: 'Create Event', desc: 'Add a new event for your club', color: 'from-royal-500/20 to-royal-600/10 border-royal-500/20' },
            { to: '/organizer/events', icon: HiCalendar, label: 'Manage Events', desc: 'Edit, delete, and view events', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20' },
            { to: '/organizer/certificates', icon: HiAcademicCap, label: 'Upload Certificates', desc: 'Issue certificates to students', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20' },
          ].map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={label} to={to}>
              <motion.div whileHover={{ y: -3 }} className={`glass-card p-5 bg-gradient-to-br ${color} border hover:shadow-glow-blue transition-all duration-200 cursor-pointer`}>
                <Icon className="text-white mb-3" size={24} />
                <p className="font-display font-semibold text-white text-sm">{label}</p>
                <p className="text-slate-400 text-xs mt-1">{desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Your Events</h2>
          <Link to="/organizer/events" className="text-royal-400 hover:text-royal-300 text-sm flex items-center gap-1 transition-colors">
            Manage <HiArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="glass-card h-16 animate-pulse" />)}</div>
        ) : events.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-slate-400">No events yet. Create your first event!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 5).map((event, i) => (
              <motion.div key={event._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="glass-card p-4 flex items-center justify-between gap-4 hover:border-royal-400/20 transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500/20 to-accent-cyan/20 border border-royal-500/20 flex items-center justify-center flex-shrink-0">
                    <HiCalendar className="text-royal-400" size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-white text-sm truncate">{event.title}</p>
                    <p className="text-slate-500 text-xs">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {new Date(event.date) >= new Date() ? <span className="badge-green">Upcoming</span> : <span className="badge-red">Past</span>}
                  <Link to={`/organizer/registrations/${event._id}`} className="text-royal-400 hover:text-white text-xs flex items-center gap-1 transition-colors">
                    <HiUserGroup size={14} /> Registrations
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
