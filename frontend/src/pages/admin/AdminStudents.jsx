import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { PageLoader } from '../../components/common/Spinner';
import { HiUpload, HiSearch, HiTrash, HiCheckCircle, HiXCircle, HiDownload } from 'react-icons/hi';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [page, setPage] = useState(1);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      const r = await api.get(`/students?${params}`);
      setStudents(r.data.students || []);
      setTotal(r.data.total || 0);
    } catch {}
    setLoading(false);
  }, [search, page]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) { toast.error('Select a CSV file'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', csvFile);
      const r = await api.post('/students/upload-csv', fd);
      setUploadResult(r.data);
      toast.success(r.data.message);
      setCsvFile(null);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this student from the database?')) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
      toast.success('Student removed');
    } catch { toast.error('Delete failed'); }
  };

  const downloadTemplate = () => {
    const csv = 'RegNo,Name,Email,Phone,Branch,Year\n21CS001,John Doe,john@college.edu,9876543210,CSE,2\n21EC002,Jane Smith,jane@college.edu,9876543211,ECE,3';
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'student_template.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title mb-1">Manage <span className="text-gradient-blue">Students</span></h1>
        <p className="text-slate-400">{total} students in database</p>
      </motion.div>

      {/* CSV Upload */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2"><HiUpload className="text-royal-400" size={20} /> Upload Student CSV</h2>
          <button onClick={downloadTemplate} className="btn-secondary text-xs flex items-center gap-1 py-2 px-3">
            <HiDownload size={13} /> Download Template
          </button>
        </div>
        <p className="text-slate-500 text-xs mb-4">CSV columns: <span className="font-mono text-slate-400">RegNo, Name, Email, Phone, Branch, Year</span></p>
        <form onSubmit={handleCSVUpload} className="flex flex-col sm:flex-row gap-4">
          <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])}
            className="flex-1 bg-navy-700/50 border border-white/10 text-slate-400 rounded-xl px-4 py-3 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-royal-500/20 file:text-royal-300 file:text-sm file:font-medium cursor-pointer" />
          <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50">
            {uploading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</> : <><HiUpload size={16} /> Upload CSV</>}
          </button>
        </form>
        {uploadResult && (
          <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <p className="text-green-300 text-sm">{uploadResult.message}</p>
          </div>
        )}
      </motion.div>

      {/* Students Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="Search by name, reg no, email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10 text-sm py-2.5" />
          </div>
        </div>
        {loading ? <PageLoader /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Student', 'Reg No', 'Branch/Year', 'Status', 'Actions'].map(h => (
                      <th key={h} className="table-header px-4 pt-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="table-row">
                      <td className="table-cell px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal-500/30 to-accent-purple/30 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{s.name?.charAt(0)}</div>
                          <div>
                            <p className="text-white font-medium text-sm">{s.name}</p>
                            <p className="text-slate-500 text-xs">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell px-4"><span className="font-mono text-xs text-slate-300">{s.regNo}</span></td>
                      <td className="table-cell px-4 text-sm text-slate-400">{s.branch}{s.year ? ` / Yr ${s.year}` : ''}</td>
                      <td className="table-cell px-4">
                        {s.isVerified
                          ? <span className="badge-green flex items-center gap-1 w-fit"><HiCheckCircle size={11} /> Verified</span>
                          : <span className="badge-red flex items-center gap-1 w-fit"><HiXCircle size={11} /> Pending</span>}
                      </td>
                      <td className="table-cell px-4">
                        <button onClick={() => handleDelete(s._id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all">
                          <HiTrash size={13} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {total > 20 && (
              <div className="p-4 flex items-center justify-between border-t border-white/5">
                <p className="text-slate-500 text-sm">Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40">Prev</button>
                  <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
