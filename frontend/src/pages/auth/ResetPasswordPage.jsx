import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { HiLockClosed, HiArrowRight, HiExclamationCircle } from 'react-icons/hi';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get(`/auth/reset-password/verify/${token}`);
        setTokenValid(true);
        setVerifying(false);
      } catch (err) {
        const message = err.response?.data?.message || 'Password reset link is invalid or has expired';
        setError(message);
        setVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        password: form.password,
      });
      toast.success('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-navy-950 pt-24 pb-20 flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-royal-500/20 border-t-royal-500 rounded-full animate-spin" />
            <p className="text-slate-400">Verifying reset link...</p>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (!tokenValid) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-navy-950 pt-24 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
          {/* Background blobs */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-royal-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/6 rounded-full blur-3xl" />

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
            <div className="glass-card p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
                  <HiExclamationCircle size={32} className="text-white" />
                </div>
              </div>
              <h1 className="font-display font-bold text-2xl text-white mb-2">Link Expired</h1>
              <p className="text-slate-400 text-sm mb-6">{error}</p>
              <Link to="/forgot-password" className="w-full py-3.5 rounded-xl font-display font-semibold text-white bg-gradient-to-r from-royal-500 to-royal-600 transition-all duration-200 hover:opacity-90 active:scale-98 flex items-center justify-center gap-2 inline-block">
                Request New Link
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-navy-950 pt-24 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-royal-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/6 rounded-full blur-3xl" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="glass-card p-8">
            <div className="mb-8">
              <h1 className="font-display font-bold text-2xl text-white">Reset Password</h1>
              <p className="text-slate-400 text-sm mt-2">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-slate-400 text-sm cursor-pointer hover:text-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={e => setShowPassword(e.target.checked)}
                  className="rounded border border-slate-600 bg-slate-900 cursor-pointer"
                />
                Show password
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-display font-semibold text-white bg-gradient-to-r from-royal-500 to-royal-600 transition-all duration-200 hover:opacity-90 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <HiArrowRight size={18} />
                    Reset Password
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              Remember your password?{' '}
              <Link to="/login" className="text-royal-400 hover:text-royal-300 font-medium transition-colors">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPasswordPage;
