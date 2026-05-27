import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import EventCard from '../../components/common/EventCard';
import { HiCalendar, HiClipboardList, HiAcademicCap, HiArrowRight, HiSparkles } from 'react-icons/hi';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="stat-card">
    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="font-display font-bold text-2xl text-white">{value}</p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  </motion.div>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [registeringIds, setRegisteringIds] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, myRes, certRes] = await Promise.all([
          api.get('/events?limit=3&upcoming=true'),
          api.get('/registrations/my-events'),
          api.get('/certificates/my-certificates'),
        ]);
        setUpcomingEvents(evRes.data.events || []);
        setMyEvents(myRes.data.registrations || []);
        setCertificates(certRes.data.certificates || []);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const registeredIds = myEvents.map(r => r.eventId?._id);

  const handleRegister = async (eventId) => {
    try {
      setRegisteringIds(prev => [...prev, eventId]);
      await api.post('/registrations/register', { eventId });
      // refresh registrations from server to ensure consistency
      const myRes = await api.get('/registrations/my-events');
      setMyEvents(myRes.data.registrations || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegisteringIds(prev => prev.filter(id => id !== eventId));
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-500/10 to-accent-purple/5" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-royal-500/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <HiSparkles className="text-accent-cyan" size={18} />
            <span className="text-accent-cyan text-sm font-mono font-semibold">{greeting}</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">{user?.name} 👋</h1>
          <p className="text-slate-400">Welcome to your student dashboard. Here's an overview of your campus activity.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="badge-blue">{user?.regNo}</span>
            {user?.branch && <span className="badge-cyan">{user?.branch}</span>}
            {user?.year && <span className="badge-purple">Year {user?.year}</span>}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={HiCalendar} label="Upcoming Events" value={upcomingEvents.length} color="text-royal-400" delay={0.1} />
        <StatCard icon={HiClipboardList} label="Registered Events" value={myEvents.length} color="text-accent-cyan" delay={0.15} />
        <StatCard icon={HiAcademicCap} label="Certificates" value={certificates.length} color="text-accent-purple" delay={0.2} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="section-title mb-5">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { to: '/student/events', icon: HiCalendar, label: 'Browse Events', desc: 'Discover & register for events', color: 'from-royal-500/20 to-royal-600/10 border-royal-500/20' },
            { to: '/student/my-events', icon: HiClipboardList, label: 'My Events', desc: 'View your registered events', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20' },
            { to: '/student/certificates', icon: HiAcademicCap, label: 'Certificates', desc: 'Download your certificates', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20' },
          ].map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to}>
              <motion.div whileHover={{ y: -3 }} className={`glass-card p-5 bg-gradient-to-br ${color} border hover:shadow-glow-blue transition-all duration-200 cursor-pointer`}>
                <Icon className="text-white mb-3" size={24} />
                <p className="font-display font-semibold text-white text-sm">{label}</p>
                <p className="text-slate-400 text-xs mt-1">{desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Upcoming Events</h2>
          <Link to="/student/events" className="text-royal-400 hover:text-royal-300 text-sm font-medium flex items-center gap-1 transition-colors">
            View All <HiArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="glass-card h-56 animate-pulse" />)}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map(event => (
              <EventCard key={event._id} event={event} onRegister={handleRegister} isRegistered={registeredIds.includes(event._id)} loading={registeringIds.includes(event._id)} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 text-center">
            <p className="text-slate-400">No upcoming events right now. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
