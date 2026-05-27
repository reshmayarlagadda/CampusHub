import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import ClubDetailModal from "../../components/common/ClubDetailModal";
import api from "../../utils/api";
import { PageLoader } from "../../components/common/Spinner";

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get('/clubs')
      .then((res) => {
        if (!mounted) return;
        setClubs(res.data.clubs || []);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const refreshMembersCount = async (clubId) => {
      if (!clubId) return;
      try {
        const res = await api.get(`/clubs/${clubId}/members`);
        const membersCount = (res.data.members || []).length;
        setClubs(prev => prev.map(c => c._id === clubId ? { ...c, members: membersCount } : c));
      } catch {
        // ignore failures for count refresh
      }
    };

    const handler = (e) => {
      const d = e?.detail || {};
      if (d.type === 'created' && d.club) setClubs(prev => [...prev, d.club]);
      if (d.type === 'deleted' && d.id) setClubs(prev => prev.filter(c => c._id !== d.id));
      if ((d.type === 'club:membership-changed' || e.type === 'club:membership-changed') && d.clubId) refreshMembersCount(d.clubId);
    };

    window.addEventListener('clubs:changed', handler);
    window.addEventListener('events:changed', handler);
    window.addEventListener('club:membership-changed', handler);
    return () => {
      window.removeEventListener('clubs:changed', handler);
      window.removeEventListener('events:changed', handler);
      window.removeEventListener('club:membership-changed', handler);
    };
  }, []);

  // Keep selectedClub reference in sync when clubs list updates
  useEffect(() => {
    if (!selectedClub) return;
    const updated = clubs.find(c => c._id === selectedClub._id);
    if (updated) setSelectedClub(updated);
  }, [clubs]);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="pt-[90px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="my-12 text-center">
            <div className="inline-block mb-3 px-4 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-sm font-medium">
              Community
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-2">College Clubs</h1>

            <p className="text-slate-400 text-[0.95rem] max-w-[460px] mx-auto">
              Discover, join, and participate in the college's vibrant club
              ecosystem
            </p>
          </div>

          {clubs.length === 0 ? (
            <div className="py-20 text-center col-span-full">
              <p className="text-slate-400 text-lg">No clubs are available right now. Check back later or create a club from the admin dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {clubs.map((club, index) => (
                <div
                  key={club._id || index}
                  onClick={() => {
                    setSelectedClub(club);
                    setModalOpen(true);
                  }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-7 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                >
                  <div className="w-[70px] h-[70px] rounded-[18px] flex items-center justify-center text-[1.8rem] mx-auto mb-4 bg-white/5">
                    {club.clubImage ? (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img src={club.clubImage} alt={club.clubName || 'club image'} className="w-full h-full rounded-[18px] object-cover" />
                    ) : (
                      '🏛️'
                    )}
                  </div>

                  <h3 className="text-[1rem] font-bold mb-2">{club.clubName || club.name}</h3>

                  <p className="text-slate-400 text-[0.82rem] leading-6 mb-4">{club.description || club.desc}</p>

                  <div className="flex justify-center pt-4 border-t border-white/10">
                    <div className="text-center w-full">
                      <strong className="block text-cyan-300 text-[1rem] font-bold">{Array.isArray(club.members) ? club.members.length : club.members || 0}</strong>
                      <span className="text-[0.72rem] text-slate-400">Members</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <ClubDetailModal 
        club={selectedClub} 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
};

export default ClubsPage;