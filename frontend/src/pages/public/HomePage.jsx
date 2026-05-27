import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import EventCard from '../../components/common/EventCard';
import LiveFeedSection from '../../components/common/LiveFeedSection';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { HiArrowRight, HiShieldCheck, HiBell, HiAcademicCap, HiCalendar, HiUserGroup } from 'react-icons/hi';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' }
});

const features = [
  { icon: HiShieldCheck, title: 'Verified Access Only', desc: 'Only registered college students can access the platform, ensuring a secure environment.', color: 'text-royal-400' },
  { icon: HiBell, title: 'Real-time Notifications', desc: 'Get instant alerts for events, deadlines, and certificate updates right on your dashboard.', color: 'text-accent-cyan' },
  { icon: HiAcademicCap, title: 'Digital Certificates', desc: 'Download participation and achievement certificates directly from your student portal.', color: 'text-accent-purple' },
  { icon: HiCalendar, title: 'Event Management', desc: 'Discover workshops, hackathons, seminars, and club activities all in one centralized place.', color: 'text-green-400' },
];

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    api.get('/events?limit=6&upcoming=true')
      .then(r => setEvents(r.data.events || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      {/* Hero */}
      <section id="home" className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-grid-lines"></div>
        
        <motion.div {...fadeUp(0)} className="hero-badge">
          <div className="hero-badge-dot"></div>
          India's #1 Campus Platform
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} className="hero-title">
          Your Campus,<br /><span className="gradient-text">Fully Connected</span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="hero-subtitle">
          Never miss an event, deadline, or opportunity. CampusHub brings all your college activities into one beautiful, centralized hub.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="hero-cta">
          <Link to="/events" className="btn-primary">
            <HiCalendar size={18} /> Explore Events
          </Link>
          <Link to="/clubs" className="btn-secondary">
            <HiUserGroup size={18} /> View Clubs
          </Link>
        </motion.div>

        <motion.div {...fadeUp(0.4)} className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Events Monthly</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">30+</div>
            <div className="stat-label">Active Clubs</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5k+</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">200+</div>
            <div className="stat-label">Certificates</div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl text-white mb-4">Everything You Need</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">A complete ecosystem designed for college students and event organizers.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-display font-bold text-4xl text-white mb-2">Upcoming Events</h2>
              <p className="text-slate-400">Don't miss out on these exciting opportunities</p>
            </motion.div>
            <Link to="/events" className="btn-secondary flex items-center gap-2 hidden sm:flex">
              View All <HiArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card h-64 animate-pulse" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event, i) => (
                <motion.div key={event._id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <EventCard event={event} showActions={true} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-16 text-center">
              <p className="text-slate-400 text-lg">No upcoming events right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA / Live Feed */}
      {isAuthenticated ? (
        <LiveFeedSection />
      ) : (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative glass-card p-12 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-royal-500/10 to-accent-purple/10" />
              <div className="relative z-10">
                <HiUserGroup className="text-royal-400 mx-auto mb-4" size={48} />
                <h2 className="font-display font-bold text-4xl text-white mb-4">Ready to Get Started?</h2>
                <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                  Join your college community on CampusHub. Register with your college credentials and start exploring.
                </p>
                <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
                  Create Your Account <HiArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      <Footer/>
    </div>
  );
};

export default HomePage;
