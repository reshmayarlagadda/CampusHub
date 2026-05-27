import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { PageLoader } from '../../components/common/Spinner';
import { HiArrowLeft, HiCheck, HiX, HiUserGroup, HiDownload } from 'react-icons/hi';

const EventRegistrations = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [eventId]);

  const toggleAttendance = async (regId, current) => {
    try {
      const res = await api.put(`/registrations/attendance/${regId}`, { attendanceStatus: !current });
      setRegistrations(prev => prev.map(r => r._id === regId ? { ...r, attendanceStatus: !current } : r));
      toast.success(`Attendance ${!current ? 'marked' : 'unmarked'}`);
    } catch { toast.error('Failed to update attendance'); }
  };

  const exportCSV = () => {
    const rows = [['Name', 'Reg No', 'Email', 'Branch', 'Year', 'Registered At', 'Attended']];
    registrations.forEach(r => {
      const s = r.studentId;
      rows.push([s?.name, s?.regNo, s?.email, s?.branch, s?.year, new Date(r.registeredAt).toLocaleDateString(), r.attendanceStatus ? 'Yes' : 'No']);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `${eventTitle.replace(/\s+/g, '_')}_registrations.csv`;
    a.click();
  };

  if (loading) return <PageLoader />;

  const attended = registrations.filter(r => r.attendanceStatus).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link to="/organizer/events" className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-2 transition-colors">
            <HiArrowLeft size={14} /> Back to Events
          </Link>
          <h1 className="page-title mb-1">Registrations</h1>
          <p className="text-slate-400 truncate max-w-lg">{eventTitle}</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
          <HiDownload size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Registered', value: registrations.length, color: 'text-royal-400' },
          { label: 'Attended', value: attended, color: 'text-green-400' },
          { label: 'Absent', value: registrations.length - attended, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className={`font-display font-bold text-2xl ${color}`}>{value}</p>
            <p className="text-slate-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {registrations.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <HiUserGroup className="text-slate-600 mx-auto mb-4" size={48} />
          <p className="text-slate-400">No registrations yet for this event.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <HiUserGroup className="text-royal-400" size={18} />
            <span className="font-display font-semibold text-white text-sm">{registrations.length} Students</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="table-header px-4 pt-4">Student</th>
                  <th className="table-header px-4 pt-4">Reg No</th>
                  <th className="table-header px-4 pt-4">Branch/Year</th>
                  <th className="table-header px-4 pt-4">Registered</th>
                  <th className="table-header px-4 pt-4">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, i) => {
                  const s = reg.studentId;
                  return (
                    <motion.tr key={reg._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="table-row">
                      <td className="table-cell px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal-500/30 to-accent-purple/30 flex items-center justify-center text-sm font-display font-bold text-white flex-shrink-0">
                            {s?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{s?.name}</p>
                            <p className="text-slate-500 text-xs">{s?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell px-4"><span className="font-mono text-xs text-slate-300">{s?.regNo}</span></td>
                      <td className="table-cell px-4"><span className="text-sm text-slate-400">{s?.branch} {s?.year && `/ Yr ${s.year}`}</span></td>
                      <td className="table-cell px-4 text-xs text-slate-500">{new Date(reg.registeredAt).toLocaleDateString('en-IN')}</td>
                      <td className="table-cell px-4">
                        <button onClick={() => toggleAttendance(reg._id, reg.attendanceStatus)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${reg.attendanceStatus ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
                          {reg.attendanceStatus ? <><HiCheck size={12} /> Present</> : <><HiX size={12} /> Absent</>}
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistrations;
