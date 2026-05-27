import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EventRegisterModal from './EventRegisterModal';
import { HiCalendar, HiLocationMarker, HiUserGroup } from 'react-icons/hi';

const categoryColors = {
  Workshop: 'badge-blue',
  Hackathon: 'badge-purple',
  Seminar: 'badge-cyan',
  Cultural: 'badge-yellow',
  Sports: 'badge-green',
  Technical: 'badge-blue',
  Other: 'badge-cyan',
};

const EventCard = ({ event, onRegister, isRegistered, showActions = true, loading = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localRegistered, setLocalRegistered] = useState(!!isRegistered);
  const eventDate = new Date(event.date);
  const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
  const isPast = eventDate < new Date();
  const isRegistrationClosed = registrationDeadline ? new Date() > registrationDeadline : false;
  const registered = localRegistered || !!isRegistered;

  const handleRegisterClick = () => {
    if (!isRegistrationClosed && !isPast) {
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = async (eventId, formData) => {
    if (!onRegister) return;
    try {
      await onRegister(eventId, formData);
      setLocalRegistered(true);
      setIsModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card overflow-hidden group border border-white/5 hover:border-royal-400/20 transition-all duration-300"
    >
      {/* Banner */}
      <div className="relative h-44 bg-gradient-to-br from-navy-700 to-navy-800 overflow-hidden">
        {event.bannerImage ? (
          <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-royal-600/20 to-accent-purple/20">
            <div className="text-5xl opacity-30">🎓</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={categoryColors[event.category] || 'badge-cyan'}>
            {event.category}
          </span>
        </div>
        {isPast && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-slate-700/80 text-slate-300 border border-slate-600/50">Ended</span>
          </div>
        )}
        {registered && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-green-500/20 text-green-300 border border-green-500/30">✓ Registered</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-white text-lg leading-tight mb-3 line-clamp-2 group-hover:text-royal-300 transition-colors">{event.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <HiCalendar className="text-royal-400 flex-shrink-0" size={15} />
            <span>{eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <HiLocationMarker className="text-accent-cyan flex-shrink-0" size={15} />
            <span className="truncate">{event.venue}</span>
          </div>
          {event.organizerId?.name && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <HiUserGroup className="text-accent-purple flex-shrink-0" size={15} />
              <span className="truncate">{event.organizerId.name}</span>
            </div>
          )}
        </div>

        {showActions && (
          registered ? (
            <div className="w-full py-2.5 rounded-xl font-display font-semibold text-sm text-center bg-green-500/10 text-green-400 border border-green-500/30">✓ Registered</div>
          ) : isPast ? (
            <div className="w-full py-2.5 rounded-xl font-display font-semibold text-sm text-center bg-white/5 text-slate-500 border border-white/5">Event Ended</div>
          ) : isRegistrationClosed ? (
            <div className="w-full py-2.5 rounded-xl font-display font-semibold text-sm text-center bg-red-500/10 text-red-300 border border-red-500/20">Registration Closed</div>
          ) : loading ? (
            <div className="w-full py-2.5 rounded-xl font-display font-semibold text-sm text-center bg-royal-500/70 text-white">Registering...</div>
          ) : (
            <button
              type="button"
              onClick={handleRegisterClick}
              className="w-full py-2.5 rounded-xl font-display font-semibold text-sm btn-primary"
            >
              Register Now
            </button>
          )
        )}
        {isModalOpen && (
          <EventRegisterModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            eventTitle={event.title}
            eventId={event._id}
            onSubmit={handleModalSubmit}
          />
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
