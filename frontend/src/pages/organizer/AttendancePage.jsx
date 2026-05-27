import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { PageLoader } from '../../components/common/Spinner';
import { HiArrowLeft, HiCheck, HiX, HiSearch } from 'react-icons/hi';

const AttendancePage = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [regRes, evRes] = await Promise.all([
          api.get(`/registrations/event/${eventId}`),
          api.get(`/events/${eventId}`),
        ]);
        setRegistrations(regRes.data.registrations || []);
        setEventTitle(evRes.data.event?.title || 'Event');
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [eventId]);

  const toggleAttendance = async (regId, current) => {
    try {
      await api.put(`/registrations/attendance/${regId}`, { attendanceStatus: !current });
      setRegistrations(prev => prev.map(r => r._id === regId ? { ...r, attendanceStatus: !current } : r));
      toast.success(`Marked as ${!current ? 'present' : 'absent'}`);
    } catch { toast.error('Failed to update'); }
  };

  const markAll = async (status) => {
    try {
      await Promise.all(registrations.map(r => api.put(`/registrations/attendance/${r._id}`, { attendanceStatus: status })));
      setRegistrations(prev => prev.map(r => ({ ...r, attendanceStatus: status })));
      toast.success(`All marked as ${status ? 'present' : 'absent'}`);
    } catch { toast.error('Failed to update all'); }
  };

  const filtered = registrations.filter(r =>
    !search || r.studentId?.name?.toLowerCase().includes(search.toLowerCase()) || r.studentId?.regNo?.toLowerCase().includes(search.toLowerCase())
  );
  const attended = registrations.filter(r => r.attendanceStatus).length;

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/organizer/events" className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-2 transition-colors">
          <HiArrowLeft size={14} /> Back to Events
        </Link>
        <h1 className="page-title mb-1">Mark <span className="text-gradient-blue">Attendance</span></h1>
        <p className="text-slate-400 truncate">{eventTitle}</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 text-sm">
          <span className="badge-green">{attended} Present</span>
          <span className="badge-red">{registrations.length - attended} Absent</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => markAll(true)} className="btn-secondary text-sm flex items-center gap-1 py-2 px-3 text-green-400 border-green-500/30 hover:bg-green-500/10">
            <HiCheck size={14} /> Mark All Present
          </button>
          <button onClick={() => markAll(false)} className="btn-secondary text-sm flex items-center gap-1 py-2 px-3 text-red-400 border-red-500/30 hover:bg-red-500/10">
            <HiX size={14} /> Mark All Absent
          </button>
        </div>
      </div>

      <div className="relative">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input type="text" placeholder="Search by name or reg no..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-10 text-center text-slate-400">No registrations found.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((reg, i) => {
            const s = reg.studentId;
            return (
              <motion.div key={reg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`glass-card p-4 flex items-center justify-between gap-4 transition-all duration-200 border ${reg.attendanceStatus ? 'border-green-500/20 bg-green-500/5' : 'border-white/5'}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white flex-shrink-0 ${reg.attendanceStatus ? 'bg-green-500/30' : 'bg-white/5'}`}>
                    {s?.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-white text-sm truncate">{s?.name}</p>
                    <p className="text-slate-500 text-xs font-mono">{s?.regNo} {s?.branch && `• ${s.branch}`}</p>
                  </div>
                </div>
                <button onClick={() => toggleAttendance(reg._id, reg.attendanceStatus)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-semibold text-sm transition-all duration-200 flex-shrink-0 ${reg.attendanceStatus ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/30'}`}>
                  {reg.attendanceStatus ? <><HiCheck size={15} /> Present</> : <><HiX size={15} /> Absent</>}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
