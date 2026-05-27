import React, { useEffect, useState } from 'react';
import { HiX, HiUserGroup, HiCalendar, HiExternalLink, HiCheck } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ClubDetailModal = ({ club, open, onClose }) => {
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinForm, setJoinForm] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    department: '',
    year: '',
    message: '',
  });
  const [joinErrors, setJoinErrors] = useState({});
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    if (!open) {
      setShowJoinForm(false);
      setJoinForm({
        fullName: '',
        email: '',
        rollNumber: '',
        department: '',
        year: '',
        message: '',
      });
      setJoinErrors({});
      setJoinLoading(false);
      setJoinSuccess(false);
      setJoinError('');
    }

    if (open && club?._id) {
      setLoading(true);
      const fetchDetails = async () => {
        try {
          const [membersRes, eventsRes, statusRes] = await Promise.all([
            api.get(`/clubs/${club._id}/members`).catch(() => ({ data: { members: [] } })),
            api.get(`/clubs/${club._id}/events`).catch(() => ({ data: { events: [] } })),
            api.get(`/clubs/${club._id}/membership-status`).catch(() => ({ data: { isMember: false } }))
          ]);
          setMembers(membersRes.data.members || []);
          setEvents(eventsRes.data.events || []);
          setIsMember(statusRes.data.isMember || false);
        } catch (error) {
          console.error('Error fetching club details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [open, club]);

  // Refresh events when an event for this club is created/updated/deleted elsewhere
  useEffect(() => {
    if (!club?._id) return;
    const handler = (e) => {
      const d = e?.detail || {};
      const clubId = d.clubId || d.id || null;
      if (!clubId) return;
      if (clubId.toString() !== club._id.toString()) return;

      // refetch events for this club
      setLoading(true);
      api.get(`/clubs/${club._id}/events`)
        .then((res) => setEvents(res.data.events || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    };

    window.addEventListener('events:changed', handler);
    window.addEventListener('clubs:changed', handler);
    return () => {
      window.removeEventListener('events:changed', handler);
      window.removeEventListener('clubs:changed', handler);
    };
  }, [club]);
  const openJoinForm = () => {
    setShowJoinForm(true);
    setJoinError('');
  };

  const validateJoinForm = () => {
    const errors = {};
    if (!joinForm.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!joinForm.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(joinForm.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!joinForm.rollNumber.trim()) errors.rollNumber = 'Roll number is required.';
    if (!joinForm.department.trim()) errors.department = 'Department is required.';
    if (!joinForm.year.trim()) errors.year = 'Year is required.';
    return errors;
  };

  const handleJoinFormChange = (e) => {
    const { name, value } = e.target;
    setJoinForm((prev) => ({ ...prev, [name]: value }));
    setJoinErrors((prev) => ({ ...prev, [name]: '' }));
    setJoinError('');
  };

  const handleSubmitJoinForm = async (e) => {
    e.preventDefault();
    const errors = validateJoinForm();
    if (Object.keys(errors).length > 0) {
      setJoinErrors(errors);
      return;
    }

    try {
      setJoinLoading(true);
      setJoinError('');
      const response = await api.post(`/clubs/${club._id}/join`, joinForm);
      setJoinSuccess(true);
      setIsMember(true);
      toast.success(response.data.message || 'You have joined the club.');
      const membersRes = await api.get(`/clubs/${club._id}/members`).catch(() => null);
      if (membersRes?.data?.members) {
        setMembers(membersRes.data.members);
      }
      window.dispatchEvent(new CustomEvent('club:membership-changed', { detail: { clubId: club._id, type: 'club:membership-changed' } }));
    } catch (error) {
      setJoinError(error.response?.data?.message || 'Failed to join the club. Please try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  if (!open || !club) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#0B1446] rounded-[32px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-[#0B1446] to-[#0B1446]/80 backdrop-blur-md p-6 border-b border-white/10 flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex-shrink-0 flex items-center justify-center text-3xl border border-white/10">
              {club.clubImage ? (
                <img src={club.clubImage} alt={club.clubName} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                '🏛️'
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{club.clubName || club.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{club.description || club.desc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
          >
            <HiX size={22} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Members Section */}
          <div>
            <div className="flex items-center gap-4 mb-4 p-4 rounded-3xl border border-white/10 bg-white/5">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Members</p>
                <p className="text-3xl font-semibold text-white">{members.length}</p>
              </div>
            </div>
          </div>

          

          

          {showJoinForm && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2">
              <div className="relative w-full max-w-lg rounded-[24px] border border-white/10 bg-[#0B1446] shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden">
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowJoinForm(false)}
                  className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <HiX size={22} className="text-gray-400" />
                </button>

                {/* Header */}
                <div className="px-6 py-5 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Join Club
                  </h2>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Fill in your details to join{" "}
                    <span className="text-white font-semibold">
                      {club.clubName || club.name}
                    </span>
                  </p>

                  {joinSuccess ? (
                    <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-5 text-center">
                      <HiCheck size={32} className="mx-auto mb-3 text-green-400" />

                      <h3 className="text-xl font-semibold text-white mb-1">
                        Successfully Joined
                      </h3>

                      <p className="text-slate-300 text-sm mb-4">
                        You are now a member of this club.
                      </p>

                      <button
                        type="button"
                        onClick={() => setShowJoinForm(false)}
                        className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 text-white font-semibold hover:opacity-90 transition"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmitJoinForm}
                      className="space-y-7"
                    >
                      {/* Full Name */}
                      <div>
                        <label className="block text-gray-300 text-sm font-bold uppercase tracking-wide mb-3">
                          Full Name
                        </label>

                        <input
                          name="fullName"
                          value={joinForm.fullName}
                          onChange={handleJoinFormChange}
                          className="w-full h-12 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-500 text-base outline-none focus:border-blue-500 transition"
                          placeholder="Your full name"
                        />

                        {joinErrors.fullName && (
                          <p className="mt-2 text-sm text-red-400">
                            {joinErrors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-gray-300 text-sm font-bold uppercase tracking-wide mb-3">
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={joinForm.email}
                          onChange={handleJoinFormChange}
                          className="w-full h-12 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-500 text-base outline-none focus:border-blue-500 transition"
                          placeholder="your@email.com"
                        />

                        {joinErrors.email && (
                          <p className="mt-2 text-sm text-red-400">
                            {joinErrors.email}
                          </p>
                        )}
                      </div>

                      {/* Roll Number */}
                      <div>
                        <label className="block text-gray-300 text-sm font-bold uppercase tracking-wide mb-3">
                          Roll Number
                        </label>

                        <input
                          name="rollNumber"
                          value={joinForm.rollNumber}
                          onChange={handleJoinFormChange}
                          className="w-full h-12 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder:text-gray-500 text-base outline-none focus:border-blue-500 transition"
                          placeholder="e.g. CS21B001"
                        />

                        {joinErrors.rollNumber && (
                          <p className="mt-2 text-sm text-red-400">
                            {joinErrors.rollNumber}
                          </p>
                        )}
                      </div>

                      {/* Department */}
                      <div>
                        <label className="block text-gray-300 text-sm font-bold uppercase tracking-wide mb-3">
                          Department
                        </label>

                        <select
                          name="department"
                          value={joinForm.department}
                          onChange={handleJoinFormChange}
                          className="w-full h-12 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-base outline-none focus:border-blue-500 transition"
                        >
                          <option value="" className="bg-[#0B1446] text-gray-400">
                            Select Department
                          </option>

                          <option value="CSE" className="bg-[#0B1446]">
                            Computer Science
                          </option>

                          <option value="ECE" className="bg-[#0B1446]">
                            Electronics
                          </option>

                          <option value="EEE" className="bg-[#0B1446]">
                            Electrical
                          </option>

                          <option value="MECH" className="bg-[#0B1446]">
                            Mechanical
                          </option>
                        </select>

                        {joinErrors.department && (
                          <p className="mt-2 text-sm text-red-400">
                            {joinErrors.department}
                          </p>
                        )}
                      </div>

                      {/* Year */}
                      <div>
                        <label className="block text-gray-300 text-sm font-bold uppercase tracking-wide mb-3">
                          Year
                        </label>

                        <select
                          name="year"
                          value={joinForm.year}
                          onChange={handleJoinFormChange}
                          className="w-full h-12 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-base outline-none focus:border-blue-500 transition"
                        >
                          <option value="" className="bg-[#0B1446] text-gray-400">
                            Select Year
                          </option>
                          <option value="First Year" className="bg-[#0B1446]">First Year</option>
                          <option value="Second Year" className="bg-[#0B1446]">Second Year</option>
                          <option value="Third Year" className="bg-[#0B1446]">Third Year</option>
                          <option value="Final Year" className="bg-[#0B1446]">Final Year</option>
                        </select>

                        {joinErrors.year && (
                          <p className="mt-2 text-sm text-red-400">
                            {joinErrors.year}
                          </p>
                        )}
                      </div>

                      {joinError && (
                        <p className="text-sm text-red-400">
                          {joinError}
                        </p>
                      )}

                      {/* Buttons */}
                      <div className="flex flex-col md:flex-row gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={joinLoading}
                          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:scale-[1.01] transition-all duration-300 text-white text-base font-semibold flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(37,99,235,0.45)] disabled:opacity-60"
                        >
                          <HiCheck size={24} />

                          {joinLoading ? "Submitting..." : "Submit"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowJoinForm(false)}
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
          )}

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-[#0B1446] to-[#0B1446]/80 p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl bg-white/5 text-white font-semibold hover:bg-white/10 transition"
          >
            Close
          </button>
          {isMember ? (
            <button disabled className="flex-1 px-6 py-3 rounded-2xl bg-green-500/20 text-green-400 font-semibold border border-green-500/30 flex items-center justify-center gap-2">
              <HiCheck size={18} />
              Member
            </button>
          ) : showJoinForm ? (
            <button
              disabled
              className="flex-1 px-6 py-3 rounded-2xl bg-white/5 text-white font-semibold border border-white/10 flex items-center justify-center"
            >
              Complete the join form in the popup
            </button>
          ) : (
            <button
              onClick={openJoinForm}
              className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90 transition"
            >
              Join Club
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ClubDetailModal;
