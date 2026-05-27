import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { HiX, HiCheck } from 'react-icons/hi';
import api from '../../utils/api';

const EventRegisterModal = ({ eventTitle, open, onClose, onSubmit, eventId }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!open) return null;

  const validate = () => {
    const nextErrors = {};
    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.rollNumber.trim()) nextErrors.rollNumber = 'Roll number is required.';
    if (!formData.department.trim()) nextErrors.department = 'Please select your department.';
    return nextErrors;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      setSubmitError('');
      if (onSubmit) {
        await onSubmit(eventId, formData);
      } else if (eventId) {
        await api.post('/registrations/register', { eventId });
      }
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit registration.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2">
      <div className="relative w-full max-w-lg rounded-[24px] border border-white/10 bg-[#0B1446] shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <HiX size={22} className="text-gray-400" />
        </button>

        <div className="px-6 py-5 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white tracking-tight">Register for Event</h2>
        </div>

        <div className="px-6 py-5">
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Fill in your details to register for{' '}
            <span className="text-white font-semibold">{eventTitle}</span>
          </p>

          {success ? (
            <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-5 text-center">
              <HiCheck size={32} className="mx-auto mb-3 text-green-400" />
              <h3 className="text-xl font-semibold text-white mb-1">Successfully Submitted</h3>
              <p className="text-slate-300 text-sm mb-4">Your event registration has been received.</p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 text-white font-semibold hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="block text-gray-300 text-sm font-bold uppercase tracking-wide mb-3">Full Name</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                className="w-full h-12 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-500 text-base outline-none focus:border-blue-500 transition"
                  placeholder="Your full name"
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-400">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold uppercase tracking-wide mb-3">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-500 text-base outline-none focus:border-blue-500 transition"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold uppercase tracking-wide mb-3">Roll Number</label>
                <input
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-500 text-base outline-none focus:border-blue-500 transition"
                  placeholder="e.g. CS21B001"
                />
                {errors.rollNumber && <p className="mt-2 text-sm text-red-400">{errors.rollNumber}</p>}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold uppercase tracking-wide mb-3">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-base outline-none focus:border-blue-500 transition"
                >
                  <option value="" className="bg-[#0B1446] text-gray-400">Select Department</option>
                  <option value="CSE" className="bg-[#0B1446]">Computer Science</option>
                  <option value="ECE" className="bg-[#0B1446]">Electronics</option>
                  <option value="EEE" className="bg-[#0B1446]">Electrical</option>
                  <option value="MECH" className="bg-[#0B1446]">Mechanical</option>
                </select>
                {errors.department && <p className="mt-2 text-sm text-red-400">{errors.department}</p>}
              </div>

              {submitError && <p className="text-sm text-red-400">{submitError}</p>}

              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:scale-[1.01] transition-all duration-300 text-white text-base font-semibold flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(37,99,235,0.45)] disabled:opacity-60"
                >
                  <HiCheck size={24} />
                  {loading ? 'Submitting...' : 'Confirm Registration'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full md:w-36 h-12 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-base font-medium hover:bg-white/[0.09] transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EventRegisterModal;
