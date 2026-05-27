import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from '../../components/common/Footer';
import api from '../../utils/api';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaPaperPlane,
} from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    first: "",
    last: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendContact = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const { first, last, email, subject, message } = formData;

    if (!first || !email || !message) {
      alert("Please fill required fields.");
      return;
    }

    setIsSending(true);

    try {
      await api.post('/contact', {
        name: `${first} ${last}`.trim(),
        email,
        subject,
        message,
      });

      alert("✉️ Message Sent! We'll get back to you within 24 hours");
      setFormData({
        first: "",
        last: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error('Contact send failed:', error);
      alert(
        error?.response?.data?.message ||
          'Unable to send message right now. Please try again later.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Navbar */}
      <Navbar />

      <div className="pt-[90px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="my-12 text-center">
            <div className="inline-block mb-3 px-4 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-sm font-medium">
              Get In Touch
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Contact Us
            </h1>

            <p className="text-slate-400 text-[0.95rem]">
              Have questions? We're here to help
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 items-start">

            {/* Left Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

              <h3 className="text-[1.3rem] font-extrabold mb-2">
                Get in Touch
              </h3>

              <p className="text-slate-400 text-[0.9rem] mb-7 leading-7">
                Reach out to the CampusHub team for any queries,
                feedback, or partnership opportunities.
              </p>

              {/* Contact Items */}
              <div className="space-y-5">

                <div className="flex items-center gap-4">
                  <div className="w-[42px] h-[42px] rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 text-[0.95rem] flex-shrink-0">
                    <FaEnvelope />
                  </div>

                  <div>
                    <strong className="block text-[0.82rem] text-slate-400 font-medium">
                      Email
                    </strong>

                    <span className="text-[0.9rem] font-semibold">
                      hello@campushub.edu
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-[42px] h-[42px] rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 text-[0.95rem] flex-shrink-0">
                    <FaPhone />
                  </div>

                  <div>
                    <strong className="block text-[0.82rem] text-slate-400 font-medium">
                      Phone
                    </strong>

                    <span className="text-[0.9rem] font-semibold">
                      +91 98765 43210
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-[42px] h-[42px] rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 text-[0.95rem] flex-shrink-0">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <strong className="block text-[0.82rem] text-slate-400 font-medium">
                      Location
                    </strong>

                    <span className="text-[0.9rem] font-semibold">
                      Student Activity Center, Block A, Campus
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-[42px] h-[42px] rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 text-[0.95rem] flex-shrink-0">
                    <FaClock />
                  </div>

                  <div>
                    <strong className="block text-[0.82rem] text-slate-400 font-medium">
                      Office Hours
                    </strong>

                    <span className="text-[0.9rem] font-semibold">
                      Mon–Fri, 9 AM – 5 PM
                    </span>
                  </div>
                </div>

              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-6">

                <a
                  href="/"
                  className="w-[38px] h-[38px] rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <FaInstagram />
                </a>

                <a
                  href="/"
                  className="w-[38px] h-[38px] rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <FaTwitter />
                </a>

                <a
                  href="/"
                  className="w-[38px] h-[38px] rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <FaLinkedin />
                </a>

                <a
                  href="/"
                  className="w-[38px] h-[38px] rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-cyan-400/10 hover:text-cyan-300 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <FaGithub />
                </a>

              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

              <h3 className="text-[1.3rem] font-extrabold mb-6">
                Send a Message
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* First Name */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="first"
                    value={formData.first}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder:text-slate-500 focus:border-cyan-400/40"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="last"
                    value={formData.last}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder:text-slate-500 focus:border-cyan-400/40"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-300 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder:text-slate-500 focus:border-cyan-400/40"
                  />
                </div>

                {/* Subject */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-300 mb-2">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder:text-slate-500 focus:border-cyan-400/40"
                  />
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-300 mb-2">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows="6"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder:text-slate-500 resize-none focus:border-cyan-400/40"
                  ></textarea>
                </div>

              </div>

              {/* Button */}
              <div className="mt-6">
                <button
                  onClick={sendContact}
                  disabled={isSending}
                  className={`inline-flex items-center gap-2 ${isSending ? 'bg-slate-500' : 'bg-cyan-400 hover:scale-105'} text-black font-semibold px-6 py-3 rounded-xl transition-all duration-300`}
                >
                  <FaPaperPlane />
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ContactPage;