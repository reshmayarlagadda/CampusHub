import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { HiAcademicCap, HiShieldCheck, HiBell, HiCalendar, HiUserGroup, HiArrowRight } from 'react-icons/hi';

const AboutPage = () => (
  <div className="min-h-screen bg-navy-950">
    <Navbar />
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
        <h1 className="page-title mb-4">About <span className="text-gradient-blue">CampusHub</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          CampusHub is a centralized college event and certificate management platform built for modern universities. It eliminates the chaos of scattered announcements and brings everything under one secure, verified roof.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {[
          { icon: HiShieldCheck, color: 'text-royal-400', title: 'Verified Students Only', desc: 'Only students in the college database can register, ensuring a secure and trusted community.' },
          { icon: HiBell, color: 'text-accent-cyan', title: 'Stay Updated', desc: 'Receive OTP-verified email notifications for event reminders and certificate uploads.' },
          { icon: HiCalendar, color: 'text-accent-purple', title: 'Centralized Events', desc: 'Workshops, hackathons, seminars, sports — all college events in one searchable portal.' },
          { icon: HiAcademicCap, color: 'text-green-400', title: 'Digital Certificates', desc: 'Organizers upload certificates and students can download them any time from their dashboard.' },
        ].map(({ icon: Icon, color, title, desc }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 flex gap-4">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 ${color}`}><Icon size={24} /></div>
            <div>
              <h3 className="font-display font-semibold text-white mb-1">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass-card p-10 text-center">
        <HiUserGroup className="text-royal-400 mx-auto mb-4" size={40} />
        <h2 className="font-display font-bold text-2xl text-white mb-3">Join Your Campus Community</h2>
        <p className="text-slate-400 mb-6">Register with your college credentials and never miss an event again.</p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2">Get Started <HiArrowRight size={16} /></Link>
      </motion.div>
    </div>
    <Footer/>
  </div>
);

export default AboutPage;
