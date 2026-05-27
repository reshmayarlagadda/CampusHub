import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';

import { HiIdentification, HiMail, HiLockClosed, HiArrowRight, HiInformationCircle } from 'react-icons/hi';

const RegisterPage = () => {
  const [form, setForm] = useState({ regNo: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', { regNo: form.regNo, email: form.email, password: form.password });
      toast.success('OTP sent to your email!');
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-navy-950 pt-24 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-accent-cyan/6 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-royal-500/8 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-royal-400 to-accent-purple rounded-xl flex items-center justify-center group-hover:shadow-glow-blue transition-all">
              <span className="text-white font-display font-bold">CC</span>
            </div>
            <span className="font-display font-bold text-xl text-white">Campus<span className="text-gradient-blue">Hub</span></span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Register with your college credentials</p>
        </div>

        <div className="glass-card p-8">
          {/* Info box */}
          <div className="flex gap-3 p-4 rounded-xl bg-royal-500/10 border border-royal-500/20 mb-6">
            <HiInformationCircle className="text-royal-400 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-slate-400 text-xs leading-relaxed">
              Only students pre-registered in the college database can create an account. Use your official college registration number and email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Registration Number</label>
              <div className="relative">
                <HiIdentification className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="text" placeholder="e.g. 21CS001" value={form.regNo} onChange={e => setForm(p => ({ ...p, regNo: e.target.value }))} className="input-field pl-11" required />
              </div>
            </div>
            <div>
              <label className="label">College Email</label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="email" placeholder="student@college.edu" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field pl-11" required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="input-field pl-11" required />
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} className="input-field pl-11" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50">
              {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending OTP...</> : <><HiArrowRight size={18} /> Register & Get OTP</>}
            </button>
          </form>
          <p className="text-center text-slate-500 text-sm mt-6">
            Already registered?{' '}<Link to="/login" className="text-royal-400 hover:text-royal-300 font-medium transition-colors">Sign In</Link>
          </p>
        </div>
      </motion.div>
      </div>
      <Footer />
    </>
  );
};
export default RegisterPage;
