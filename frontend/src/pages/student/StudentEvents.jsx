import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import EventCard from '../../components/common/EventCard';
import { PageLoader } from '../../components/common/Spinner';
import { HiSearch, HiFilter } from 'react-icons/hi';

const categories = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'];

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [registeringIds, setRegisteringIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);
      const [evRes, regRes] = await Promise.all([
        api.get(`/events?${params}`),
        api.get('/registrations/my-events'),
      ]);
      setEvents(evRes.data.events || []);
      setRegisteredIds((regRes.data.registrations || []).map(r => r.eventId?._id));
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [search, category]);

  const handleRegister = async (eventId, formData) => {
    try {
      setRegisteringIds(prev => [...prev, eventId]);
      const payload = { eventId, ...(formData || {}) };
      await api.post('/registrations/register', payload);
      // refresh user's registrations to keep list accurate
      const regRes = await api.get('/registrations/my-events');
      setRegisteredIds((regRes.data.registrations || []).map(r => r.eventId?._id));
      toast.success('Registered successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setRegisteringIds(prev => prev.filter(id => id !== eventId));
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title mb-1">Browse <span className="text-gradient-blue">Events</span></h1>
        <p className="text-slate-400">Discover and register for college events</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
        </div>
        <div className="relative">
          <HiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-field pl-10 min-w-[160px] appearance-none cursor-pointer">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${category === c ? 'bg-royal-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'}`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : events.length > 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <EventCard event={event} onRegister={handleRegister} isRegistered={registeredIds.includes(event._id)} loading={registeringIds.includes(event._id)} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-20 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-slate-400 text-lg">No events found. Try a different filter.</p>
        </div>
      )}
    </div>
  );
};

export default StudentEvents;
