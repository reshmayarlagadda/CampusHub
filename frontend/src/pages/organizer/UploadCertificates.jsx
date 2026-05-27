import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { PageLoader } from '../../components/common/Spinner';
import { HiAcademicCap, HiUpload, HiTrash } from 'react-icons/hi';

const UploadCertificates = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ regNo: '', eventId: '', certificateType: 'participation' });
  const [certFile, setCertFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(false);

  const certificateTypes = [
    { value: 'participation', label: 'Participation Certificate' },
    { value: 'runner', label: 'Runner Certificate' },
    { value: 'winner', label: 'Winner Certificate' }
  ];

  useEffect(() => {
    api.get('/events/my-events').then(r => setEvents(r.data.events || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.eventId) return;
    setLoadingCerts(true);
    api.get(`/certificates/event/${form.eventId}`)
      .then(r => setCertificates(r.data.certificates || []))
      .catch(() => {})
      .finally(() => setLoadingCerts(false));
  }, [form.eventId]);

  const getViewUrl = (url) => {
    try {
      const resolved = new URL(url, window.location.href);
      if (resolved.origin === window.location.origin) return resolved.href;
      return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(resolved.href)}`;
    } catch {
      return url;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!certFile) { toast.error('Select a certificate PDF'); return; }
    if (!form.regNo || !form.eventId || !form.certificateType) { toast.error('Fill all fields'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('certificate', certFile);
      fd.append('regNo', form.regNo);
      fd.append('eventId', form.eventId);
      fd.append('certificateType', form.certificateType);
      await api.post('/certificates/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Certificate uploaded!');
      setForm(p => ({ ...p, regNo: '' }));
      setCertFile(null);
      // Refresh list
      const r = await api.get(`/certificates/event/${form.eventId}`);
      setCertificates(r.data.certificates || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      await api.delete(`/certificates/${id}`);
      setCertificates(prev => prev.filter(c => c._id !== id));
      toast.success('Certificate deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title mb-1">Upload <span className="text-gradient-blue">Certificates</span></h1>
        <p className="text-slate-400">Issue participation, runner, and winner certificates to students</p>
      </motion.div>

      {/* Upload form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h2 className="section-title mb-5 flex items-center gap-2"><HiUpload className="text-royal-400" size={20} /> Upload Certificate</h2>
        <form onSubmit={handleUpload} className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Select Event *</label>
            <select value={form.eventId} onChange={e => setForm(p => ({ ...p, eventId: e.target.value }))} className="input-field appearance-none cursor-pointer" required>
              <option value="">-- Choose Event --</option>
              {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Certificate Type *</label>
            <select value={form.certificateType} onChange={e => setForm(p => ({ ...p, certificateType: e.target.value }))} className="input-field appearance-none cursor-pointer" required>
              {certificateTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Student Registration Number *</label>
            <input type="text" value={form.regNo} onChange={e => setForm(p => ({ ...p, regNo: e.target.value }))} className="input-field" placeholder="e.g. 21CS001" required />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Certificate PDF *</label>
            <input type="file" accept="application/pdf" onChange={e => setCertFile(e.target.files[0])}
              className="w-full bg-navy-700/50 border border-white/10 text-slate-400 rounded-xl px-4 py-3 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-royal-500/20 file:text-royal-300 file:text-sm file:font-medium cursor-pointer" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              {uploading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</> : <><HiUpload size={18} /> Upload Certificate</>}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Issued certificates */}
      {form.eventId && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="section-title mb-5 flex items-center gap-2"><HiAcademicCap className="text-accent-purple" size={20} /> Issued Certificates ({certificates.length})</h2>
          {loadingCerts ? <PageLoader /> : certificates.length === 0 ? (
            <p className="text-slate-500 text-sm">No certificates uploaded for this event yet.</p>
          ) : (
            <div className="space-y-3">
              {certificates.map(cert => (
                <div key={cert._id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/2 border border-white/5">
                  <div className="flex items-center gap-3 flex-1">
                    <HiAcademicCap className="text-accent-purple flex-shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-display font-semibold">{cert.studentId?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-500 text-xs font-mono">{cert.studentId?.regNo}</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                          cert.certificateType === 'winner' ? 'bg-yellow-500/20 text-yellow-400' :
                          cert.certificateType === 'runner' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {cert.certificateType === 'winner' ? '🏆 Winner' :
                           cert.certificateType === 'runner' ? '🥈 Runner' :
                           '📜 Participation'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={getViewUrl(cert.certificateUrl)} target="_blank" rel="noopener noreferrer" className="text-royal-400 hover:text-royal-300 text-xs transition-colors">View PDF</a>
                    <button onClick={() => handleDelete(cert._id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all">
                      <HiTrash size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default UploadCertificates;
