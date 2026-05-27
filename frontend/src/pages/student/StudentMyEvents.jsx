import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { PageLoader } from '../../components/common/Spinner';
import { HiCalendar, HiLocationMarker, HiCheckCircle, HiClock, HiTrash } from 'react-icons/hi';

const StudentMyEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/registrations/my-events')
      .then(r => setRegistrations(r.data.registrations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUnregister = async (eventId) => {
    if (!confirm('Unregister from this event?')) return;
    try {
      await api.delete(`/registrations/unregister/${eventId}`);
      setRegistrations(prev => prev.filter(r => r.eventId?._id !== eventId));
      toast.success('Unregistered successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unregister');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title mb-1">My <span className="text-gradient-blue">Events</span></h1>
        <p className="text-slate-400">{registrations.length} event{registrations.length !== 1 ? 's' : ''} registered</p>
      </motion.div>

      {registrations.length === 0 ? (
        <div className="glass-card p-20 text-center">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-slate-300 text-lg font-display font-semibold mb-2">No Events Yet</p>
          <p className="text-slate-500">You haven't registered for any events. Browse and register!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg, i) => {
            const event = reg.eventId;
            if (!event) return null;
            const isPast = new Date(event.date) < new Date();
            return (
              <motion.div key={reg._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-royal-400/20 transition-all">
                {/* Banner thumbnail */}
                <div className="w-full sm:w-20 h-16 sm:h-14 rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 flex-shrink-0 overflow-hidden">
                  {event.bannerImage
                    ? <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🎓</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-white truncate">{event.title}</h3>
                    {reg.attendanceStatus
                      ? <span className="badge bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1"><HiCheckCircle size={12} /> Attended</span>
                      : isPast
                        ? <span className="badge-red">Ended</span>
                        : <span className="badge-blue flex items-center gap-1"><HiClock size={12} /> Upcoming</span>}
                  </div>
                  <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                    <span className="flex items-center gap-1"><HiCalendar size={14} className="text-royal-400" />{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><HiLocationMarker size={14} className="text-accent-cyan" />{event.venue}</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1 font-mono">Registered {new Date(reg.registeredAt).toLocaleDateString('en-IN')}</p>
                </div>
                {!isPast && (
                  <button onClick={() => handleUnregister(event._id)} className="btn-danger flex items-center gap-2 flex-shrink-0 text-sm">
                    <HiTrash size={14} /> Unregister
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentMyEvents;
