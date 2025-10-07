import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Zap, Droplets, TrendingUp, Shield } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'Energy Forecasting',
      description: 'AI-powered 48-hour energy demand predictions using LSTM & Prophet models',
    },
    {
      icon: Droplets,
      title: 'Water Management',
      description: 'Real-time monitoring of water flow, pressure, and quality across networks',
    },
    {
      icon: TrendingUp,
      title: 'Anomaly Detection',
      description: 'Advanced ML algorithms identify patterns and prevent system failures',
    },
    {
      icon: Shield,
      title: 'Sustainable Cities',
      description: 'Reduce waste by 15% and optimize resource distribution intelligently',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-[#C7E8CA] to-[#7FC8A9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#7FC8A9] to-[#326B5D] rounded-3xl flex items-center justify-center shadow-2xl">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-[#326B5D] mb-6 leading-tight">
            AI for Sustainable Cities
          </h1>
          <p className="text-2xl md:text-3xl text-[#326B5D] font-medium mb-4">
            Smarter Energy & Water Management
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-10">
            EcoGrid AI leverages cutting-edge artificial intelligence to predict energy demand,
            optimize water distribution, and build resilient smart city infrastructure. Our
            platform helps municipalities reduce waste, prevent outages, and create sustainable
            urban environments.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              Explore Dashboard
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#326B5D]" />
              </div>
              <h3 className="text-lg font-semibold text-[#326B5D] mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="bg-white rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-[#326B5D] mb-6 text-center">
            Trusted Partners
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">BSES</p>
              <p className="text-sm text-gray-500">Energy Distribution</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">IMD</p>
              <p className="text-sm text-gray-500">Weather Forecasting</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">Delhi Jal Board</p>
              <p className="text-sm text-gray-500">Water Supply</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-12 flex items-center justify-center gap-4 flex-wrap"
        >
          {[Zap, Droplets, TrendingUp].map((Icon, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <Icon className="w-6 h-6 text-[#7FC8A9]" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
