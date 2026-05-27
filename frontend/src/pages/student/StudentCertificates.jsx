import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { PageLoader } from '../../components/common/Spinner';
import { HiAcademicCap, HiDownload, HiCalendar, HiExternalLink } from 'react-icons/hi';

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/my-certificates')
      .then(r => setCertificates(r.data.certificates || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const getViewUrl = (url) => {
    try {
      const resolved = new URL(url, window.location.href);
      if (resolved.origin === window.location.origin) return resolved.href;
      return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(resolved.href)}`;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title mb-1">My <span className="text-gradient-blue">Certificates</span></h1>
        <p className="text-slate-400">{certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned</p>
      </motion.div>

      {certificates.length === 0 ? (
        <div className="glass-card p-20 text-center">
          <HiAcademicCap className="text-slate-600 mx-auto mb-4" size={56} />
          <p className="text-slate-300 text-lg font-display font-semibold mb-2">No Certificates Yet</p>
          <p className="text-slate-500">Participate in events to earn certificates. They'll appear here once uploaded by the organizer.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert, i) => {
            const event = cert.eventId;
            return (
              <motion.div key={cert._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass-card p-6 flex flex-col hover:border-accent-purple/30 transition-all duration-200">
                {/* Certificate icon */}
                <div className="w-full h-28 bg-gradient-to-br from-accent-purple/20 to-royal-500/20 rounded-xl flex items-center justify-center mb-5 border border-accent-purple/20">
                  <div className="text-center">
                    <HiAcademicCap className="text-accent-purple mx-auto mb-1" size={40} />
                    <p className="text-accent-purple text-xs font-mono font-semibold">CERTIFICATE</p>
                  </div>
                </div>

                <h3 className="font-display font-semibold text-white mb-1 line-clamp-2">{event?.title || 'Event'}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {event?.category && <span className="badge-purple">{event.category}</span>}
                </div>
                {event?.date && (
                  <p className="text-slate-500 text-xs flex items-center gap-1 mb-1">
                    <HiCalendar size={12} className="text-royal-400" />
                    {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
                <p className="text-slate-600 text-xs font-mono mb-5">Issued {new Date(cert.uploadedAt).toLocaleDateString('en-IN')}</p>

                <div className="mt-auto flex gap-2">
                  <a href={getViewUrl(cert.certificateUrl)} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-purple/10 hover:bg-accent-purple/20 border border-accent-purple/30 text-accent-purple text-sm font-display font-semibold transition-all duration-200">
                    <HiExternalLink size={15} /> View
                  </a>
                  <a href={cert.certificateUrl} download
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl btn-primary text-sm">
                    <HiDownload size={15} /> Download
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;
