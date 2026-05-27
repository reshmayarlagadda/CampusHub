import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { PageLoader } from '../../components/common/Spinner';
import { HiPlus, HiTrash, HiX, HiCheckCircle, HiXCircle, HiUserGroup } from 'react-icons/hi';

const AdminOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', clubId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/organizers'), api.get('/clubs')])
      .then(([orgRes, clubRes]) => { setOrganizers(orgRes.data.organizers || []); setClubs(clubRes.data.clubs || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api.post('/organizers/create', form);
      toast.success('Organizer created!');
      setOrganizers(prev => [...prev, { ...r.data, name: form.name, email: form.email, clubId: clubs.find(c => c._id === form.clubId) }]);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', clubId: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this organizer?')) return;
    try { await api.delete(`/organizers/${id}`); setOrganizers(prev => prev.filter(o => o._id !== id)); toast.success('Removed'); }
    catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (id) => {
    try {
      const r = await api.patch(`/organizers/${id}/toggle`);
      setOrganizers(prev => prev.map(o => o._id === id ? { ...o, isActive: r.data.organizer.isActive } : o));
      toast.success(r.data.message);
    } catch { toast.error('Failed'); }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title mb-1">Manage <span className="text-gradient-blue">Organizers</span></h1>
          <p className="text-slate-400">{organizers.length} organizers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><HiPlus size={18} /> Add Organizer</button>
      </div>

      {organizers.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <HiUserGroup className="text-slate-600 mx-auto mb-4" size={48} />
          <p className="text-slate-400">No organizers yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                {['Organizer', 'Club', 'Status', 'Actions'].map(h => <th key={h} className="table-header px-4 pt-4">{h}</th>)}
              </tr></thead>
              <tbody>
                {organizers.map((org, i) => (
                  <motion.tr key={org._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="table-row">
                    <td className="table-cell px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan/30 to-royal-500/30 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">{org.name?.charAt(0)}</div>
                        <div><p className="text-white text-sm font-medium">{org.name}</p><p className="text-slate-500 text-xs">{org.email}</p></div>
                      </div>
                    </td>
                    <td className="table-cell px-4 text-sm text-slate-400">{org.clubId?.clubName || '—'}</td>
                    <td className="table-cell px-4">
                      {org.isActive !== false
                        ? <span className="badge-green flex items-center gap-1 w-fit"><HiCheckCircle size={11} /> Active</span>
                        : <span className="badge-red flex items-center gap-1 w-fit"><HiXCircle size={11} /> Inactive</span>}
                    </td>
                    <td className="table-cell px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggle(org._id)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${org.isActive !== false ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-300 border-green-500/30 hover:bg-green-500/20'}`}>
                          {org.isActive !== false ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleDelete(org._id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all">
                          <HiTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="glass-card w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title">Create Organizer</h2>
                  <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400"><HiX size={18} /></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div><label className="label">Full Name *</label><input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="Organizer name" required /></div>
                  <div><label className="label">Email *</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field" placeholder="organizer@college.edu" required /></div>
                  <div><label className="label">Password *</label><input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="input-field" placeholder="Minimum 6 characters" required minLength={6} /></div>
                  <div><label className="label">Assign Club</label>
                    <select value={form.clubId} onChange={e => setForm(p => ({ ...p, clubId: e.target.value }))} className="input-field appearance-none cursor-pointer">
                      <option value="">-- No Club --</option>
                      {clubs.map(c => <option key={c._id} value={c._id}>{c.clubName}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                    <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                      {saving ? 'Creating...' : 'Create Organizer'}
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

export default AdminOrganizers;
