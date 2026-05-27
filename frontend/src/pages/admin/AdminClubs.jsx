import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { PageLoader } from '../../components/common/Spinner';
import { HiPlus, HiTrash, HiX, HiOfficeBuilding } from 'react-icons/hi';

const clubCategories = ['Technical', 'Cultural', 'Sports', 'Literary', 'Social', 'Other'];

const AdminClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ clubName: '', description: '', facultyCoordinator: '', category: 'Technical' });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/clubs').then(r => setClubs(r.data.clubs || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (imageFile) fd.append('clubImage', imageFile);
      const r = await api.post('/clubs/create', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setClubs(prev => [...prev, r.data.club]);
      // notify other parts of the app a club was added
      try { window.dispatchEvent(new CustomEvent('clubs:changed', { detail: { type: 'created', club: r.data.club } })); } catch (e) {}
      toast.success('Club created!');
      setShowModal(false);
      setForm({ clubName: '', description: '', facultyCoordinator: '', category: 'Technical' });
      setImageFile(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this club?')) return;
    try { await api.delete(`/clubs/${id}`); setClubs(prev => prev.filter(c => c._id !== id));
      try { window.dispatchEvent(new CustomEvent('clubs:changed', { detail: { type: 'deleted', id } })); } catch(e) {}
      toast.success('Club deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const categoryBadgeColors = { Technical: 'badge-blue', Cultural: 'badge-purple', Sports: 'badge-green', Literary: 'badge-yellow', Social: 'badge-cyan', Other: 'badge-cyan' };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title mb-1">Manage <span className="text-gradient-blue">Clubs</span></h1>
          <p className="text-slate-400">{clubs.length} clubs</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><HiPlus size={18} /> Add Club</button>
      </div>

      {clubs.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <HiOfficeBuilding className="text-slate-600 mx-auto mb-4" size={48} />
          <p className="text-slate-400">No clubs yet. Create your first club.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club, i) => (
            <motion.div key={club._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass-card p-5 hover:border-royal-400/20 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-500/20 to-accent-purple/20 border border-royal-500/20 flex items-center justify-center text-xl">
                  {club.clubImage ? <img src={club.clubImage} alt={club.clubName} className="w-full h-full rounded-xl object-cover" /> : '🏛️'}
                </div>
                <button onClick={() => handleDelete(club._id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all">
                  <HiTrash size={13} />
                </button>
              </div>
              <h3 className="font-display font-semibold text-white mb-1">{club.clubName}</h3>
              <span className={`${categoryBadgeColors[club.category] || 'badge-cyan'} mb-3 inline-block`}>{club.category}</span>
              {club.description && <p className="text-slate-400 text-xs leading-relaxed mb-2 line-clamp-2">{club.description}</p>}
              {club.facultyCoordinator && <p className="text-slate-500 text-xs">Coordinator: <span className="text-slate-400">{club.facultyCoordinator}</span></p>}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="glass-card w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title">Create Club</h2>
                  <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400"><HiX size={18} /></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div><label className="label">Club Name *</label><input type="text" value={form.clubName} onChange={e => setForm(p => ({ ...p, clubName: e.target.value }))} className="input-field" placeholder="e.g. CodeCraft Club" required /></div>
                  <div><label className="label">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-field resize-none" rows={3} placeholder="Club description..." /></div>
                  <div><label className="label">Faculty Coordinator</label><input type="text" value={form.facultyCoordinator} onChange={e => setForm(p => ({ ...p, facultyCoordinator: e.target.value }))} className="input-field" placeholder="Prof. Name" /></div>
                  <div><label className="label">Category *</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field appearance-none cursor-pointer">
                      {clubCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="label">Club Image</label>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                      className="w-full bg-navy-700/50 border border-white/10 text-slate-400 rounded-xl px-4 py-3 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-royal-500/20 file:text-royal-300 file:text-sm file:font-medium cursor-pointer" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                    <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? 'Creating...' : 'Create Club'}</button>
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

export default AdminClubs;
