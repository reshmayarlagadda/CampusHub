import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { HiMail, HiArrowLeft, HiCheckCircle } from 'react-icons/hi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Password reset link sent to your email');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to send reset link';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-navy-950 pt-24 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-royal-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/6 rounded-full blur-3xl" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          {/* Back to login */}
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
            <HiArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>

          {submitted ? (
            // Success message
            <div className="glass-card p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                    <HiCheckCircle size={32} className="text-white" />
                  </div>
                </div>
              </motion.div>
              <h1 className="font-display font-bold text-2xl text-white mb-2">Check your email</h1>
              <p className="text-slate-400 text-sm mb-6">We've sent a password reset link to <span className="text-white font-medium">{email}</span></p>
              <p className="text-slate-500 text-xs">The link will expire in 24 hours. If you don't see it, check your spam folder.</p>
            </div>
          ) : (
            // Form
            <div className="glass-card p-8">
              <div className="mb-8">
                <h1 className="font-display font-bold text-2xl text-white">Forgot Password?</h1>
                <p className="text-slate-400 text-sm mt-2">Enter your email and we'll send you a link to reset your password</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="email"
                      placeholder="your@college.edu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-field pl-11"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-display font-semibold text-white bg-gradient-to-r from-royal-500 to-royal-600 transition-all duration-200 hover:opacity-90 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <HiMail size={18} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
