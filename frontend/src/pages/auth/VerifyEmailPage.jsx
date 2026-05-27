import React, { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../utils/api';
import { HiMail, HiArrowRight } from 'react-icons/hi';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const email = location.state?.email || '';

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      refs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length < 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-email', { email, otp: otpStr });
      login(res.data.token, res.data.role, res.data.user);
      toast.success('Email verified! Welcome to CampusHub 🎉');
      navigate('/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
      setOtp(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } finally { setLoading(false); }
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-navy-950 pt-24 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-accent-cyan/6 rounded-full blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-royal-400 to-accent-purple rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold">CC</span>
            </div>
            <span className="font-display font-bold text-xl text-white">Campus<span className="text-gradient-blue">Hub</span></span>
          </Link>
          <div className="w-16 h-16 bg-royal-500/20 border border-royal-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HiMail className="text-royal-400" size={32} />
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Verify Your Email</h1>
          <p className="text-slate-400 text-sm">We sent a 6-digit OTP to</p>
          <p className="text-royal-300 font-mono text-sm font-semibold mt-1">{email}</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit}>
            <label className="label text-center block mb-4">Enter OTP</label>
            <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => refs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={`w-12 h-14 text-center text-xl font-mono font-bold rounded-xl border transition-all duration-200 outline-none bg-navy-700/50 text-white ${digit ? 'border-royal-400 shadow-glow-blue' : 'border-white/10 focus:border-royal-400/60'}`}
                />
              ))}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50">
              {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</> : <><HiArrowRight size={18} /> Verify & Continue</>}
            </button>
          </form>
          <p className="text-center text-slate-500 text-xs mt-6">Didn't get the OTP? Check your spam folder or <Link to="/register" className="text-royal-400 hover:text-royal-300">register again</Link>.</p>
        </div>
      </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default VerifyEmailPage;
