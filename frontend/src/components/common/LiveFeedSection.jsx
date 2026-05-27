import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const LiveFeedSection = () => {
  const [liveEvents, setLiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        const response = await api.get('/events?limit=100');
        const allEvents = response.data.events || [];
        const now = new Date();
        
        // Filter only events happening right now
        const ongoingEvents = allEvents.filter(event => {
          const eventStart = new Date(event.startTime || event.date);
          const eventEnd = new Date(event.endTime || new Date(eventStart.getTime() + 2 * 60 * 60 * 1000)); // default 2-hour duration
          return now >= eventStart && now <= eventEnd;
        });

        // Format events for display
        const formattedEvents = ongoingEvents.slice(0, 3).map((event, index) => {
          const statusColors = ['green', 'blue', 'pink'];
          const buttonColors = ['cyan', 'purple', 'pink'];
          const hoverBorders = ['hover:border-cyan-400/40', 'hover:border-purple-400/40', 'hover:border-pink-400/40'];
          
          return {
            id: event._id,
            status: 'LIVE NOW',
            statusColor: statusColors[index % 3],
            title: event.title,
            venue: event.venue,
            desc: event.description,
            buttonColor: buttonColors[index % 3],
            hoverBorder: hoverBorders[index % 3]
          };
        });
        
        setLiveEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching live events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveEvents();
    // Refresh every 30 seconds to check for new live events
    const interval = setInterval(fetchLiveEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: 'easeOut' }
  });

  const getStatusBgColor = (color) => {
    const colors = {
      green: 'bg-green-500/20 text-green-400',
      blue: 'bg-blue-500/20 text-blue-400',
      pink: 'bg-pink-500/20 text-pink-400'
    };
    return colors[color] || colors.green;
  };

  const getButtonColor = (color) => {
    const colors = {
      cyan: 'text-cyan-400 hover:text-cyan-300',
      purple: 'text-purple-400 hover:text-purple-300',
      pink: 'text-pink-400 hover:text-pink-300'
    };
    return colors[color] || colors.cyan;
  };

  return (
    <section className="py-20 border-t border-white/10 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-semibold border border-green-500/20">
            Live Events
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-white mt-5">
            Events Happening Now
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Join ongoing events and activities happening across campus right now.
          </p>
        </motion.div>

        {/* Live Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-4 w-20"></div>
                <div className="h-6 bg-white/10 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-2/3 mb-5"></div>
              </div>
            ))
          ) : liveEvents.length > 0 ? (
            liveEvents.map((event, index) => (
              <motion.div
                key={event.id}
                {...fadeUp(0.1 + index * 0.1)}
                className={`bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg ${event.hoverBorder} transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs ${getStatusBgColor(event.statusColor)} px-3 py-1 rounded-full`}>
                    {event.status}
                  </span>

                  {event.venue && (
                    <span className="text-gray-400 text-sm">
                      📍 {event.venue}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {event.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {event.desc}
                </p>

                <button className={`mt-5 ${getButtonColor(event.buttonColor)} font-medium text-sm transition-colors`}>
                  Register Now →
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No events happening right now. Check back soon!</p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default LiveFeedSection;
