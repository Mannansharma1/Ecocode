import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Zap, Droplets, TrendingUp, Shield, CloudSun, Network, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'AI Energy Forecasting',
      description: '48-hour zonal demand forecasts (LSTM/Prophet) to prevent grid overload and inform load balancing.',
    },
    {
      icon: Droplets,
      title: 'Intelligent Water Network',
      description: 'Real-time pressure & flow monitoring using IoT sensors with anomaly detection for fast leak localization.',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Maintenance',
      description: 'Autoencoders detect abnormal behavior early; GNNs model cascading impact to prioritize fixes.',
    },
    {
      icon: Shield,
      title: 'Sustainability Impact',
      description: 'Reduce water & power wastage and allow proactive responses that protect vulnerable communities.',
    },
  ];

  // Mock time-series data
  const now = new Date();
  const energySeries = Array.from({ length: 24 }).map((_, i) => {
    const t = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    return { time: `${t.getHours()}:00`, value: Math.round(4200 + Math.sin(i / 3) * 220 + (Math.random() * 80 - 40)) };
  });
  const aqiSeries = Array.from({ length: 24 }).map((_, i) => {
    const t = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    return { time: `${t.getHours()}:00`, value: Math.round(80 + Math.cos(i / 4) * 10 + (Math.random() * 8 - 4)) };
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F8F9FA] via-[#C7E8CA] to-[#7FC8A9]">
      {/* Delhi skyline background */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=1800&q=60')",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-28 pb-20">
        {/* HERO */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#164E43] mb-4 leading-tight drop-shadow-sm">
            AI for a Smarter & Greener Delhi
          </h1>
          <p className="text-xl md:text-2xl text-[#28594D] font-medium mb-6 max-w-3xl mx-auto">
            Predicting energy demand, detecting water leaks, and reducing smog, a unified AI platform
            that helps city authorities act before crises happen.
          </p>
          <div className="flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }}>
              <Button onClick={() => navigate('/dashboard')} size="lg">Explore Dashboard</Button>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => window.scrollTo({ top: 760, behavior: 'smooth' })}
              className="px-4 py-3 rounded-lg border border-[#DDEEE2] bg-white text-[#164E43] hover:bg-[#F6FFF7] transition"
            >
              How it works
            </motion.button>
          </div>
        </motion.section>

        {/* FEATURES GRID */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -8, boxShadow: '0 18px 30px rgba(15,23,42,0.08)' }} className="bg-white/95 rounded-2xl p-6 border border-[#E6F4EA]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#DFF6EA] to-[#AEE9C6]">
                  <f.icon className="w-6 h-6 text-[#145643]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#114f43]">{f.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{f.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CITY DASHBOARD: Charts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E8F6EE]">
            <h4 className="text-lg font-semibold text-[#164E43] mb-3">Energy Load (MW)</h4>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef7f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2F6D5F" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md border border-[#E8F6EE]">
            <h4 className="text-lg font-semibold text-[#164E43] mb-3">Air Quality Index (AQI)</h4>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aqiSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fffaf0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ff8c42" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* DELHI MAP */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-white rounded-3xl p-6 shadow-lg border border-[#E8F6EE] mb-12">
          <h4 className="text-lg font-semibold text-[#164E43] mb-4">Delhi Interactive Map</h4>
          <div className="h-96">
            <MapContainer center={[28.6139, 77.209]} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Sample markers */}
              <Marker position={[28.6139, 77.209]}>
                <Popup>AI Energy Hub</Popup>
              </Marker>
              <Marker position={[28.645, 77.219]}>
                <Popup>Water Leak Detected</Popup>
              </Marker>
              <Marker position={[28.625, 77.25]}>
                <Popup>Smog Alert Zone</Popup>
              </Marker>
            </MapContainer>
          </div>
        </motion.div>

        {/* FLOW / HOW IT WORKS */}
        <div className="mb-12">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-[#164E43] mb-6">
            How CityShield Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FlowCard title="Collect" desc="Weather, satellite, grid logs, and IoT sensors across the city." icon={CloudSun} />
            <FlowCard title="Fuse" desc="Clean, align, and validate all spatial & temporal data." icon={Network} />
            <FlowCard title="Predict" desc="LSTM/Prophet for energy, Autoencoders for leaks, GNN for cascades." icon={TrendingUp} />
            <FlowCard title="Act" desc="Real-time alerts, dashboards, and operator recommendations." icon={Shield} />
          </div>
        </div>

        {/* PARTNERS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-12 bg-white rounded-3xl p-6 shadow-md border border-[#eaf6ef]">
          <h4 className="text-lg font-semibold text-[#164E43] mb-3">Trusted Partners & Data Sources</h4>
          <div className="flex flex-wrap gap-8 text-sm text-gray-700">
            <div><strong>BSES</strong> — Energy distribution</div>
            <div><strong>IMD</strong> — Weather forecasts</div>
            <div><strong>Delhi Jal Board</strong> — Water telemetry</div>
            <div><strong>CPCB</strong> — Pollution monitoring</div>
          </div>
        </motion.div>

        <footer className="mt-10 text-center text-gray-600 text-sm">
          <p>© 2025 CityShield | Built by Team Maverick</p>
        </footer>
      </div>
    </div>
  );
};

/* Subcomponents */
function FlowCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="p-4 bg-white rounded-xl shadow-sm border border-[#eef9f0] text-center">
      <div className="mx-auto mb-2 p-2 w-10 h-10 rounded-lg bg-gradient-to-br from-[#E9FBF1] to-[#DFF6EA]">
        <Icon className="w-5 h-5 text-[#14614f] mx-auto" />
      </div>
      <div className="font-semibold text-[#114f43] mb-1">{title}</div>
      <div className="text-xs text-gray-600">{desc}</div>
    </motion.div>
  );
}
