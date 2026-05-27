import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/common/Spinner';
import { HiPlus, HiPencil, HiTrash, HiUserGroup, HiCalendar, HiX, HiCheck } from 'react-icons/hi';

const categories = ['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'];

const defaultForm = { title: '', description: '', venue: '', date: '', registrationDeadline: '', category: 'Workshop', maxParticipants: '', tags: '' };

const ManageEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [bannerFile, setBannerFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try { const r = await api.get('/events/my-events'); setEvents(r.data.events || []); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => { setEditEvent(null); setForm(defaultForm); setBannerFile(null); setShowModal(true); };
  const openEdit = (ev) => {
    setEditEvent(ev);
    setForm({
      title: ev.title, description: ev.description, venue: ev.venue,
      date: ev.date?.slice(0, 16), registrationDeadline: ev.registrationDeadline?.slice(0, 16) || '',
      category: ev.category, maxParticipants: ev.maxParticipants || '', tags: ev.tags?.join(', ') || '',
    });
    setBannerFile(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (bannerFile) fd.append('banner', bannerFile);
      if (user?.club?._id) fd.append('clubId', user.club._id);
      if (editEvent) {
        const r = await api.put(`/events/${editEvent._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setEvents(prev => prev.map(e => e._id === editEvent._id ? r.data.event : e));
        window.dispatchEvent(new CustomEvent('events:changed', { detail: { type: 'updated', clubId: user?.club?._id } }));
        toast.success('Event updated!');
      } else {
        const r = await api.post('/events/create', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setEvents(prev => [r.data.event, ...prev]);
        window.dispatchEvent(new CustomEvent('events:changed', { detail: { type: 'created', clubId: user?.club?._id } }));
        toast.success('Event created!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
      window.dispatchEvent(new CustomEvent('events:changed', { detail: { type: 'deleted', clubId: user?.club?._id } }));
      toast.success('Event deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title mb-1">Manage <span className="text-gradient-blue">Events</span></h1>
          <p className="text-slate-400">{events.length} events created</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><HiPlus size={18} /> New Event</button>
      </div>

      {events.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <HiCalendar className="text-slate-600 mx-auto mb-4" size={48} />
          <p className="text-slate-300 font-display font-semibold text-lg mb-2">No events yet</p>
          <p className="text-slate-500 mb-4">Create your first event for your club.</p>
          <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2"><HiPlus size={16} /> Create Event</button>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev, i) => (
            <motion.div key={ev._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-royal-400/20 transition-all">
              <div className="w-16 h-12 rounded-xl overflow-hidden bg-navy-700 flex-shrink-0">
                {ev.bannerImage ? <img src={ev.bannerImage} alt={ev.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🎓</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-white truncate">{ev.title}</h3>
                  <span className={`badge ${new Date(ev.date) >= new Date() ? 'badge-green' : 'badge-red'}`}>{new Date(ev.date) >= new Date() ? 'Upcoming' : 'Past'}</span>
                  <span className="badge-blue">{ev.category}</span>
                </div>
                <p className="text-slate-500 text-xs">{new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {ev.venue}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to={`/organizer/registrations/${ev._id}`} className="btn-secondary text-xs flex items-center gap-1 py-2 px-3">
                  <HiUserGroup size={13} /> Registrations
                </Link>
                <Link to={`/organizer/attendance/${ev._id}`} className="btn-secondary text-xs flex items-center gap-1 py-2 px-3">
                  <HiCheck size={13} /> Attendance
                </Link>
                <button onClick={() => openEdit(ev)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <HiPencil size={15} />
                </button>
                <button onClick={() => handleDelete(ev._id)} className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all">
                  <HiTrash size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title">{editEvent ? 'Edit Event' : 'Create New Event'}</h2>
                  <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    <HiX size={18} />
                  </button>
                </div>
                <form onSubmit={handleSave} className="space-y-5">
                  <div><label className="label">Event Title *</label><input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="e.g. Web Dev Workshop 2025" required /></div>
                  <div><label className="label">Description *</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-field resize-none" rows={4} placeholder="Event description..." required /></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="label">Venue *</label><input type="text" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} className="input-field" placeholder="e.g. Seminar Hall A" required /></div>
                    <div><label className="label">Category *</label>
                      <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field appearance-none cursor-pointer">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><label className="label">Event Date & Time *</label><input type="datetime-local" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="input-field" required /></div>
                    <div><label className="label">Registration Deadline</label><input type="datetime-local" value={form.registrationDeadline} onChange={e => setForm(p => ({ ...p, registrationDeadline: e.target.value }))} className="input-field" /></div>
                    <div><label className="label">Max Participants</label><input type="number" value={form.maxParticipants} onChange={e => setForm(p => ({ ...p, maxParticipants: e.target.value }))} className="input-field" placeholder="Leave blank for unlimited" min={1} /></div>
                    <div><label className="label">Tags (comma separated)</label><input type="text" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="input-field" placeholder="react, web, frontend" /></div>
                  </div>
                  <div>
                    <label className="label">Banner Image</label>
                    <input type="file" accept="image/*" onChange={e => setBannerFile(e.target.files[0])}
                      className="w-full bg-navy-700/50 border border-white/10 text-slate-400 rounded-xl px-4 py-3 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-royal-500/20 file:text-royal-300 file:text-sm file:font-medium cursor-pointer" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                    <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                      {saving ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : editEvent ? 'Update Event' : 'Create Event'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageEvents;
