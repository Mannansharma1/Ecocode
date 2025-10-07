import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, Mail, MessageSquare, Send } from 'lucide-react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const teamMembers = [
    {
      name: 'Aryan Wadhwa',
      role: 'Project Lead',
      description: 'Leading the vision and strategy for EcoGrid AI smart city solutions',
      initials: 'AW',
      color: 'from-[#7FC8A9] to-[#326B5D]',
    },
    {
      name: 'Sarthak Bagasi',
      role: 'AI Engineer',
      description: 'Developing and training machine learning models for predictions',
      initials: 'SB',
      color: 'from-[#326B5D] to-[#7FC8A9]',
    },
    {
      name: 'Mannan Sharma',
      role: 'Frontend Developer',
      description: 'Building beautiful and responsive user interfaces',
      initials: 'MS',
      color: 'from-[#7FC8A9] to-[#326B5D]',
    },
    {
      name: 'Dipesh Gupta',
      role: 'Data & Infrastructure Specialist',
      description: 'Managing data pipelines and cloud infrastructure',
      initials: 'DG',
      color: 'from-[#326B5D] to-[#7FC8A9]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#C7E8CA] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-[#326B5D] mb-2">Meet Our Team</h1>
          <p className="text-gray-600">The innovators behind EcoGrid AI</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card hover className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-24 h-24 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <span className="text-3xl font-bold text-white">{member.initials}</span>
                </motion.div>
                <h3 className="text-xl font-semibold text-[#326B5D] mb-1">{member.name}</h3>
                <p className="text-sm font-medium text-[#7FC8A9] mb-3">{member.role}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#7FC8A9] to-[#326B5D] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[#326B5D] mb-2">Get In Touch</h2>
              <p className="text-gray-600">Have questions or feedback? We'd love to hear from you!</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#326B5D] mb-2">Thank You!</h3>
                <p className="text-gray-600">Your message has been sent successfully. We'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#326B5D] mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8A9] focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#326B5D] mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8A9] focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#326B5D] mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8A9] focus:border-transparent resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            )}
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <Card className="bg-gradient-to-r from-[#7FC8A9] to-[#326B5D] text-white">
              <h3 className="text-xl font-semibold mb-2">Ready to Transform Your City?</h3>
              <p className="text-white/90 mb-4">
                Join us in building smarter, more sustainable urban infrastructure.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-white/80">Email</p>
                  <p className="font-medium">contact@ecogrid.ai</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/80">Phone</p>
                  <p className="font-medium">+91 XXX XXX XXXX</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
