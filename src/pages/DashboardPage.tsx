import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';
import { Zap, Droplets, AlertTriangle, TrendingUp } from 'lucide-react';
import energyData from '../data/mockEnergy.json';
import waterData from '../data/mockWater.json';
import zonesData from '../data/mockZones.json';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveMetrics, setLiveMetrics] = useState({
    energyDemand: 6800,
    waterFlow: 1250,
    anomalies: 2,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setLiveMetrics((prev) => ({
        energyDemand: prev.energyDemand + Math.floor(Math.random() * 200 - 100),
        waterFlow: prev.waterFlow + Math.floor(Math.random() * 50 - 25),
        anomalies: Math.floor(Math.random() * 3),
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const criticalZones = zonesData.filter((zone) => zone.status === 'critical' || zone.status === 'warning');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#C7E8CA] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#326B5D] mb-2">System Dashboard</h1>
          <p className="text-gray-600">
            Real-time monitoring and AI predictions - Last updated: {currentTime.toLocaleTimeString()}
          </p>
        </motion.div>

        {criticalZones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Alert variant={criticalZones.some((z) => z.status === 'critical') ? 'error' : 'warning'}>
              <strong>{criticalZones.length} zone(s) require attention.</strong> Check Zone Insights for details.
            </Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Energy Demand</p>
                  <h3 className="text-3xl font-bold text-[#326B5D]">
                    {liveMetrics.energyDemand.toLocaleString()} <span className="text-lg">MW</span>
                  </h3>
                  <Badge variant="success" className="mt-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% predicted tomorrow
                  </Badge>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#326B5D]" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Water Flow Rate</p>
                  <h3 className="text-3xl font-bold text-[#326B5D]">
                    {liveMetrics.waterFlow.toLocaleString()} <span className="text-lg">L/s</span>
                  </h3>
                  <Badge variant="info" className="mt-2">
                    Normal Range
                  </Badge>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-xl flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-[#326B5D]" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Detected Anomalies</p>
                  <h3 className="text-3xl font-bold text-[#326B5D]">{liveMetrics.anomalies}</h3>
                  <Badge variant={liveMetrics.anomalies > 0 ? 'warning' : 'success'} className="mt-2">
                    {liveMetrics.anomalies > 0 ? 'Under Investigation' : 'All Clear'}
                  </Badge>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-[#326B5D]" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <h3 className="text-xl font-semibold text-[#326B5D] mb-4">Energy Demand Forecast</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="timestamp" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="demand" stroke="#326B5D" strokeWidth={2} name="Current Demand" />
                  <Line type="monotone" dataKey="prediction" stroke="#7FC8A9" strokeWidth={2} strokeDasharray="5 5" name="AI Prediction" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <h3 className="text-xl font-semibold text-[#326B5D] mb-4">Water Distribution Metrics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={waterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="timestamp" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="flow" stroke="#7FC8A9" strokeWidth={2} name="Flow Rate (L/s)" />
                  <Line type="monotone" dataKey="pressure" stroke="#326B5D" strokeWidth={2} name="Pressure (PSI)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-[#326B5D] mb-4">AI Insights Summary</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#C7E8CA] to-[#F8F9FA] rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#326B5D] mt-0.5" />
                <div>
                  <p className="font-medium text-[#326B5D]">Energy Load Prediction</p>
                  <p className="text-sm text-gray-600">Expected 12% increase tomorrow due to high temperatures. Consider load balancing.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#C7E8CA] to-[#F8F9FA] rounded-lg">
                <Droplets className="w-5 h-5 text-[#326B5D] mt-0.5" />
                <div>
                  <p className="font-medium text-[#326B5D]">Water Quality Alert</p>
                  <p className="text-sm text-gray-600">Minor pressure drop detected in Central Delhi. Maintenance recommended.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button onClick={() => navigate('/zones')}>View Zone Insights</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
