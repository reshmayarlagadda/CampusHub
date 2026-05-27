import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../utils/api';

import {
  HiMail,
  HiLockClosed,
  HiArrowRight,
  HiShieldCheck,
  HiCheck,
  HiExclamationCircle
} from 'react-icons/hi';

const roles = [
  {
    key: 'student',
    label: 'Student',
    color: 'from-royal-500 to-royal-600',
    endpoint: '/auth/login/student'
  },
  {
    key: 'organizer',
    label: 'Organizer',
    color: 'from-accent-cyan to-royal-500',
    endpoint: '/auth/login/organizer'
  },
  {
    key: 'admin',
    label: 'Admin',
    color: 'from-accent-purple to-royal-500',
    endpoint: '/auth/login/admin'
  },
];

const LoginPage = () => {

  const [selectedRole, setSelectedRole] = useState('student');

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, googleLogin } = useAuth();

  const navigate = useNavigate();

  const currentRole = roles.find(
    role => role.key === selectedRole
  );

  // ================= LOAD SAVED EMAIL =================

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setForm(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // ================= LOGIN =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {
      let res;
      try {
        res = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
          role: currentRole.key
        });
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 405) {
          res = await api.post(currentRole.endpoint, {
            email: form.email,
            password: form.password
          });
        } else {
          throw err;
        }
      }

      const roleFromServer = String(
        res.data.role || currentRole.key
      ).toLowerCase();

      // Save email if Remember Me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', form.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      login(
        res.data.token,
        roleFromServer,
        res.data.user
      );

      toast.success(
        `Welcome back, ${res.data.user.name}!`
      );

      if (roleFromServer === 'student') {
        navigate('/student');
      }
      else if (roleFromServer === 'organizer') {
        navigate('/organizer');
      }
      else {
        navigate('/admin');
      }

    }
    catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed';

      toast.error(message);
    }
    finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================

  const handleGoogleSuccess = async (credentialResponse) => {

    setGoogleLoading(true);

    try {

      const res = await api.post(
        '/auth/google-login',
        {
          token: credentialResponse.credential,
          role: selectedRole
        }
      );

      const roleFromServer = String(
        res.data.role || selectedRole
      ).toLowerCase();

      googleLogin(
        res.data.token,
        roleFromServer,
        res.data.user
      );

      toast.success(
        `Welcome back, ${res.data.user.name}!`
      );

      if (roleFromServer === 'student') {
        navigate('/student');
      }
      else if (roleFromServer === 'organizer') {
        navigate('/organizer');
      }
      else {
        navigate('/admin');
      }

    }
    catch (err) {

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Google login failed';

      toast.error(message);

    }
    finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-navy-950 pt-24 pb-20 flex items-center justify-center px-4 relative overflow-hidden">

        {/* Background */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-royal-500/8 rounded-full blur-3xl" />

        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/6 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >

          {/* Logo */}
          <div className="text-center mb-8">

            <Link
              to="/"
              className="inline-flex items-center gap-2 group mb-6"
            >

              <div className="w-10 h-10 bg-gradient-to-br from-royal-400 to-accent-purple rounded-xl flex items-center justify-center">

                <span className="text-white font-bold">
                  CC
                </span>

              </div>

              <span className="text-xl font-bold text-white">
                Campus
                <span className="text-gradient-blue">
                  Hub
                </span>
              </span>

            </Link>

            <h1 className="text-2xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Sign in to your portal
            </p>

          </div>

          {/* Card */}
          <div className="glass-card p-8">

            {/* Roles */}
            <div className="grid grid-cols-3 gap-2 mb-8 p-1 bg-navy-900/60 rounded-xl border border-white/5">

              {roles.map(role => (

                <button
                  key={role.key}
                  onClick={() => setSelectedRole(role.key)}
                  className={`py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    selectedRole === role.key
                      ? `bg-gradient-to-r ${role.color} text-white`
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {role.label}
                </button>

              ))}

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label className="label">
                  Email Address
                </label>

                <div className="relative">

                  <HiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />

                  <input
                    type="email"
                    placeholder="your@college.edu"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value
                      })
                    }
                    className="input-field pl-11"
                    required
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="label">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-royal-400 hover:text-royal-300 transition-colors flex items-center gap-1"
                  >
                    <HiExclamationCircle size={14} />
                    Reset Password
                  </Link>

                </div>

                <div className="relative">

                  <HiLockClosed
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value
                      })
                    }
                    className="input-field pl-11"
                    required
                  />

                </div>

              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3">

                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    rememberMe
                      ? 'bg-gradient-to-r from-royal-500 to-royal-600 border-royal-400'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {rememberMe && <HiCheck size={14} className="text-white" />}
                </button>

                <label
                  className="text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  Remember me 
                </label>

              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r ${currentRole.color}`}
              >

                {loading ? (
                  'Signing in...'
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <HiArrowRight size={18} />
                    Sign In as {currentRole.label}
                  </div>
                )}

              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">

              <div className="flex-1 h-px bg-slate-700" />

              <span className="text-xs text-slate-500">
                OR
              </span>

              <div className="flex-1 h-px bg-slate-700" />

            </div>

            {/* Google Login */}
            <div className="flex justify-center">

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error('Google login failed');
                  setGoogleLoading(false);
                }}
                text="signin_with"
                size="large"
                theme="dark"
              />

            </div>

            {/* Register */}
            {selectedRole === 'student' && (

              <p className="text-center text-slate-500 text-sm mt-6">

                New student?{' '}

                <Link
                  to="/register"
                  className="text-royal-400"
                >
                  Create account
                </Link>

              </p>

            )}

          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-6 text-slate-600 text-xs">

            <HiShieldCheck size={14} />

            <span>
              Secure login powered by JWT
            </span>

          </div>

        </motion.div>

      </div>

      <Footer />
    </>
  );
};

export default LoginPage;