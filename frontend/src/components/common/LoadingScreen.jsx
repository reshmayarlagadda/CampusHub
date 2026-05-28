import React, { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-[#071120] flex flex-col items-center justify-center z-[9999] transition-opacity duration-500">

      {/* Logo */}
      <div className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-3xl mb-5
      bg-gradient-to-br from-blue-500 to-cyan-400 animate-pulse shadow-[0_0_40px_rgba(0,212,255,0.4)]">
        🎓
      </div>

      {/* Title */}
      <h1 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
        CampusHub
      </h1>

      {/* Loading Bar */}
      <div className="w-[220px] h-[4px] bg-white/10 rounded-full overflow-hidden mt-4">
        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-loadingBar rounded-full"></div>
      </div>

      {/* Text */}
      <p className="mt-4 text-gray-400 uppercase tracking-[0.2em] text-xs font-semibold">
        Initializing Platform
      </p>

      {/* Tailwind Custom Animation */}
      <style>
        {`
          @keyframes loadingBar {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          .animate-loadingBar {
            animation: loadingBar 1.2s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;
