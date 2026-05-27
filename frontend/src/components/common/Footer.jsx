import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white/[0.02] border-t border-white/10 px-[5%] pt-[60px] pb-[30px] mt-20 relative z-[1]">
      
      {/* Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-[50px]">

        {/* Brand Section */}
        <div>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-0">
            <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-xl">
              🎓
            </div>

            <span className="text-xl font-bold text-white">
              CampusHub
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-[0.875rem] leading-7 mt-[14px] mb-5 max-w-[280px]">
            The all-in-one platform for college event discovery,
            registration, and certificate management. Built with ❤️ by
            students, for students.
          </p>

          {/* Social Links */}
          <div className="flex gap-3">

            <a
              href="/"
              className="w-[38px] h-[38px] rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 text-sm transition-all duration-300 hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-400/30"
            >
              <FaInstagram />
            </a>

            <a
              href="/"
              className="w-[38px] h-[38px] rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 text-sm transition-all duration-300 hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-400/30"
            >
              <FaTwitter />
            </a>

            <a
              href="/"
              className="w-[38px] h-[38px] rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 text-sm transition-all duration-300 hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-400/30"
            >
              <FaLinkedin />
            </a>

            <a
              href="/"
              className="w-[38px] h-[38px] rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 text-sm transition-all duration-300 hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-400/30"
            >
              <FaGithub />
            </a>

          </div>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-slate-500 mb-4">
            Platform
          </h4>

          <div className="space-y-2.5">
            <a className="block text-slate-400 text-[0.875rem] cursor-pointer transition-all duration-300 hover:text-cyan-300">
              Events
            </a>

            <a className="block text-slate-400 text-[0.875rem] cursor-pointer transition-all duration-300 hover:text-cyan-300">
              Clubs
            </a>

            <a className="block text-slate-400 text-[0.875rem] cursor-pointer transition-all duration-300 hover:text-cyan-300">
              Announcements
            </a>

            <a className="block text-slate-400 text-[0.875rem] cursor-pointer transition-all duration-300 hover:text-cyan-300">
              Dashboard
            </a>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-slate-500 mb-4">
            Company
          </h4>

          <div className="space-y-2.5">
            <a className="block text-slate-400 text-[0.875rem] cursor-pointer transition-all duration-300 hover:text-cyan-300">
              About Us
            </a>

            <a className="block text-slate-400 text-[0.875rem] cursor-pointer transition-all duration-300 hover:text-cyan-300">
              Contact
            </a>

            <span className="block text-slate-400 text-[0.875rem]">
              Privacy Policy
            </span>

            <span className="block text-slate-400 text-[0.875rem]">
              Terms of Use
            </span>
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-slate-500 mb-4">
            Support
          </h4>

          <div className="space-y-2.5">
            <span className="block text-slate-400 text-[0.875rem]">
              Help Center
            </span>

            <span className="block text-slate-400 text-[0.875rem]">
              FAQs
            </span>

            <span className="block text-slate-400 text-[0.875rem]">
              Student Guide
            </span>

            <span className="block text-slate-400 text-[0.875rem]">
              Club Onboarding
            </span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-[30px] border-t border-white/10 text-[0.82rem] text-slate-400">

        <span>© 2025 CampusHub. All rights reserved.</span>

        <div className="flex gap-5">
          <a className="text-slate-400 cursor-pointer transition-all duration-300 hover:text-cyan-300">
            Privacy
          </a>

          <a className="text-slate-400 cursor-pointer transition-all duration-300 hover:text-cyan-300">
            Terms
          </a>

          <a className="text-slate-400 cursor-pointer transition-all duration-300 hover:text-cyan-300">
            Cookies
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;