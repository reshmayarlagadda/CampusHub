import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import EventCard from '../../components/common/EventCard';
import { PageLoader } from '../../components/common/Spinner';
import api from '../../utils/api';
import { HiSearch, HiFilter } from 'react-icons/hi';

const categories = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'];

const EventsPublicPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [total, setTotal] = useState(0);
  const [registeringIds, setRegisteringIds] = useState([]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 24 });
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);
      const res = await api.get(`/events?${params}`);
      setEvents(res.data.events || []);
      setTotal(res.data.total || 0);
    } catch {
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, [search, category]);

  const handleRegister = async (eventId, formData) => {
    try {
      setRegisteringIds(prev => [...prev, eventId]);
      const payload = { eventId, ...(formData || {}) };
      await api.post('/registrations/register', payload);
      toast.success('Registered successfully!');
      // Refresh events list to update registration status if needed
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setRegisteringIds(prev => prev.filter(id => id !== eventId));
    }
  };

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="page-title mb-2">College <span className="text-gradient-blue">Events</span></h1>
          <p className="text-slate-400">{total} events available across all categories</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
          </div>
          <div className="relative">
            <HiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-field pl-10 pr-8 appearance-none cursor-pointer min-w-[160px]">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${category === c ? 'bg-royal-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'}`}>
              {c}
            </button>
          ))}
        </div>

        {loading ? <PageLoader /> : events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event, i) => (
              <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <EventCard event={event} showActions={true} onRegister={handleRegister} loading={registeringIds.includes(event._id)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-20 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-slate-400 text-lg">No events found. Try a different search or category.</p>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default EventsPublicPage;
