import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { User, Mail, MessageSquare, Send, CheckCircle2, X, Linkedin } from "lucide-react";

export const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setShowPopup(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
      setShowPopup(false);
    }, 3000);
  };

  const teamMembers = [
    {
      name: "Aryan Wadhwa",
      role: "Project Lead",
      description: "Driving vision, AI innovation, and strategy for sustainable smart cities.",
      initials: "AW",
      color: "from-[#7FC8A9] to-[#326B5D]",
      linkedin: "https://linkedin.com/in/aryanwadhwa14",
    },
    {
      name: "Sarthak Bagasi",
      role: "AI Engineer",
      description: "Designing robust models for energy, water, and pollution predictions.",
      initials: "SB",
      color: "from-[#326B5D] to-[#7FC8A9]",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Astitva Gaur",
      role: "Backend Developer",
      description: "Optimizing APIs, real-time data pipelines, and cloud infrastructure.",
      initials: "AG",
      color: "from-[#7FC8A9] to-[#326B5D]",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Dipesh Gupta",
      role: "UI/Infra Specialist",
      description: "Enhancing user experience and crafting seamless visual systems.",
      initials: "DG",
      color: "from-[#326B5D] to-[#7FC8A9]",
      linkedin: "https://linkedin.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#C7E8CA] pt-24 pb-16 relative overflow-hidden">
      {/* Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white border border-[#7FC8A9] shadow-lg rounded-lg px-5 py-3 flex items-center gap-3">
              <CheckCircle2 className="text-[#326B5D] w-6 h-6" />
              <span className="text-[#326B5D] font-medium">Message Sent Successfully!</span>
              <button onClick={() => setShowPopup(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl font-bold text-[#326B5D] mb-3">Meet Our Team</h1>
          <p className="text-gray-600">The innovators building the future of sustainable cities</p>
        </motion.div>

        {/* Team Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="p-6 text-center rounded-2xl shadow-sm bg-white group relative overflow-hidden hover:shadow-lg transition-all duration-300">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-md`}
                >
                  <span className="text-2xl font-bold text-white">{member.initials}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#326B5D]">{member.name}</h3>
                <p className="text-sm font-medium text-[#7FC8A9] mb-2">{member.role}</p>
                <p className="text-sm text-gray-600 leading-snug">{member.description}</p>

                {/* LinkedIn Hover Button */}
                <motion.a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-[#326B5D]/80 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <Linkedin className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Connect on LinkedIn</span>
                </motion.a>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-8 bg-white rounded-2xl shadow-sm">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[#7FC8A9] to-[#326B5D] rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[#326B5D]">Get In Touch</h2>
              <p className="text-gray-600 text-sm mt-1">
                Have questions or ideas? We’d love to collaborate.
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#326B5D] mb-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7FC8A9]"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#326B5D] mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7FC8A9]"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#326B5D] mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7FC8A9] resize-none"
                    placeholder="Write your message..."
                  />
                </div>

                <div className="text-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      className="px-6 py-2 text-sm bg-[#326B5D] text-white rounded-md hover:bg-[#2A594E] flex items-center justify-center mx-auto"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </motion.div>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-[#326B5D] mb-1">Thank You!</h3>
                <p className="text-gray-600 text-sm">We’ll get back to you shortly.</p>
              </div>
            )}
          </Card>

          {/* Footer Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <Card className="bg-gradient-to-r from-[#7FC8A9] to-[#326B5D] text-white py-8 rounded-2xl shadow-md">
              <h3 className="text-2xl font-semibold mb-2">Ready to Transform Your City?</h3>
              <p className="text-white/90 text-sm mb-5">
                Join us in making India Cleaner & Greener  
                Together, We build sustainable, smarter cities.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                <div>
                  <p className="text-sm text-white/80">Email</p>
                  <p className="font-medium">contact@cityshield.ai</p>
                </div>
                <div>
                  <p className="text-sm text-white/80">Phone</p>
                  <p className="font-medium">+91 8178156168</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
  