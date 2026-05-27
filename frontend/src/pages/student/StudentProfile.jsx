import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiIdentification, HiPhone, HiAcademicCap, HiCheckCircle } from 'react-icons/hi';

const Field = ({ icon: Icon, label, value, color = 'text-royal-400' }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/2 border border-white/5">
    <div className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={16} />
    </div>
    <div>
      <p className="text-slate-500 text-xs font-mono mb-0.5">{label}</p>
      <p className="text-white font-body font-medium">{value || '—'}</p>
    </div>
  </div>
);

const StudentProfile = () => {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', branch: '', year: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/students/profile')
      .then(r => setProfile(r.data.student))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        branch: profile.branch || '',
        year: profile.year || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await api.put('/students/profile', formData);
      const updated = r.data.student || { ...profile, ...formData };
      setProfile(updated);
      setUser?.(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setEditMode(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handleCancel = () => {
    setFormData({ name: profile.name || '', phone: profile.phone || '', branch: profile.branch || '', year: profile.year || '' });
    setEditMode(false);
  };

  if (loading) return <PageLoader />;
  if (!profile) return <div className="glass-card p-10 text-center text-slate-400">Could not load profile.</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title mb-1">My <span className="text-gradient-blue">Profile</span></h1>
        <p className="text-slate-400">Your college account information</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        {/* Avatar & header */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-royal-500 to-accent-purple flex items-center justify-center text-3xl font-display font-bold text-white shadow-glow-blue">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                {editMode ? (
                  <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="input-field" />
                ) : (
                  <h2 className="font-display font-bold text-xl text-white">{profile.name}</h2>
                )}
                <p className="text-slate-400 text-sm">{profile.email}</p>
              </div>
              <div className="flex-shrink-0">
                {editMode ? (
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                    <button type="button" onClick={handleCancel} className="btn-ghost">Cancel</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setEditMode(true)} className="btn-primary">Edit Profile</button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {profile.isVerified
                ? <span className="badge-green flex items-center gap-1"><HiCheckCircle size={12} /> Verified</span>
                : <span className="badge-red">Unverified</span>}
              <span className="badge-blue">Student</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field icon={HiIdentification} label="Registration Number" value={profile.regNo} color="text-royal-400" />
          <Field icon={HiMail} label="Email Address" value={profile.email} color="text-accent-cyan" />
          {editMode ? (
            <div className="sm:col-span-1">
              <label className="label">Phone Number</label>
              <input className="input-field" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
            </div>
          ) : (
            <Field icon={HiPhone} label="Phone Number" value={profile.phone} color="text-accent-purple" />
          )}

          {editMode ? (
            <div>
              <label className="label">Branch</label>
              <input className="input-field" value={formData.branch} onChange={e => setFormData(p => ({ ...p, branch: e.target.value }))} />
            </div>
          ) : (
            <Field icon={HiAcademicCap} label="Branch" value={profile.branch} color="text-green-400" />
          )}

          {editMode ? (
            <div>
              <label className="label">Year</label>
              <input type="number" min={1} max={10} className="input-field" value={formData.year} onChange={e => setFormData(p => ({ ...p, year: e.target.value }))} />
            </div>
          ) : (
            <Field icon={HiUser} label="Year" value={profile.year ? `Year ${profile.year}` : null} color="text-yellow-400" />
          )}

          <Field icon={HiUser} label="Account Status" value={profile.hasRegistered ? 'Active' : 'Pending'} color="text-green-400" />
        </div>

        <p className="text-slate-600 text-xs font-mono mt-6 pt-4 border-t border-white/5">
          Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
