import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { PageLoader } from '../../components/common/Spinner';
import { HiSearch, HiTrash, HiCalendar, HiLocationMarker } from 'react-icons/hi';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);
      const r = await api.get(`/events?${params}`);
      setEvents(r.data.events || []);
      setTotal(r.data.total || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, [search, category]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this event? This will remove it permanently.')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
      toast.success('Event deleted');
    } catch { toast.error('Delete failed'); }
  };

  const categories = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title mb-1">All <span className="text-gradient-blue">Events</span></h1>
        <p className="text-slate-400">{total} events on platform</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input-field appearance-none cursor-pointer min-w-[160px]">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? <PageLoader /> : events.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <HiCalendar className="text-slate-600 mx-auto mb-4" size={48} />
          <p className="text-slate-400">No events found.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                {['Event', 'Category', 'Date & Venue', 'Organizer', 'Status', 'Actions'].map(h => <th key={h} className="table-header px-4 pt-4">{h}</th>)}
              </tr></thead>
              <tbody>
                {events.map((ev, i) => (
                  <motion.tr key={ev._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="table-row">
                    <td className="table-cell px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded-lg overflow-hidden bg-navy-700 flex-shrink-0">
                          {ev.bannerImage ? <img src={ev.bannerImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">🎓</div>}
                        </div>
                        <p className="text-white text-sm font-medium truncate max-w-[180px]">{ev.title}</p>
                      </div>
                    </td>
                    <td className="table-cell px-4"><span className="badge-blue">{ev.category}</span></td>
                    <td className="table-cell px-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1 mb-1"><HiCalendar size={11} className="text-royal-400" />{new Date(ev.date).toLocaleDateString('en-IN')}</div>
                      <div className="flex items-center gap-1"><HiLocationMarker size={11} className="text-accent-cyan" />{ev.venue}</div>
                    </td>
                    <td className="table-cell px-4 text-sm text-slate-400">{ev.organizerId?.name || '—'}</td>
                    <td className="table-cell px-4">{new Date(ev.date) >= new Date() ? <span className="badge-green">Upcoming</span> : <span className="badge-red">Past</span>}</td>
                    <td className="table-cell px-4">
                      <button onClick={() => handleDelete(ev._id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all">
                        <HiTrash size={13} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
