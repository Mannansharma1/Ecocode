import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';
import { Zap, Droplets, AlertTriangle, TrendingUp, CloudSun } from 'lucide-react';
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
    renewablePercent: 32,
    peakLoad: 7200,
    waterTankLevel: 68,
  });
  const [energyView, setEnergyView] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setLiveMetrics((prev) => ({
        ...prev,
        energyDemand: prev.energyDemand + Math.floor(Math.random() * 200 - 100),
        waterFlow: prev.waterFlow + Math.floor(Math.random() * 50 - 25),
        anomalies: Math.floor(Math.random() * 3),
        renewablePercent: Math.min(100, Math.max(10, prev.renewablePercent + Math.floor(Math.random() * 3 - 1))),
        peakLoad: prev.peakLoad + Math.floor(Math.random() * 50 - 25),
        waterTankLevel: Math.min(100, Math.max(30, prev.waterTankLevel + Math.floor(Math.random() * 5 - 2))),
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const criticalZones = zonesData.filter(z => z.status === 'critical' || z.status === 'warning');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#C7E8CA] pt-24 pb-12">
      {/* Delhi skyline background */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=1800&q=60')",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-[#326B5D] mb-2">System Dashboard</h1>
          <p className="text-gray-600">
            Real-time monitoring and AI predictions - Last updated: {currentTime.toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Alerts */}
        {criticalZones.length > 0 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Alert variant={criticalZones.some(z => z.status === 'critical') ? 'error' : 'warning'}>
              <strong>{criticalZones.length} zone(s) require attention.</strong> Check Zone Insights for details.
            </Alert>
          </motion.div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Total Energy Demand" value={`${liveMetrics.energyDemand.toLocaleString()} MW`} badge={<Badge variant="success"><TrendingUp className="w-3 h-3 mr-1" /> +12% predicted</Badge>} icon={Zap} />
          <MetricCard title="Water Flow Rate" value={`${liveMetrics.waterFlow.toLocaleString()} L/s`} badge={<Badge variant="info">Normal</Badge>} icon={Droplets} />
          <MetricCard title="Anomalies" value={liveMetrics.anomalies} badge={<Badge variant={liveMetrics.anomalies>0?'warning':'success'}>{liveMetrics.anomalies>0?'Under Investigation':'All Clear'}</Badge>} icon={AlertTriangle} />
          <MetricCard title="Renewable Energy %" value={`${liveMetrics.renewablePercent}%`} badge={<Badge variant="info">Grid Contribution</Badge>} icon={CloudSun} />
        </div>

        {/* Charts with toggle */}
        <div className="flex gap-3 mb-4">
          <Button size="sm" variant={energyView==='daily'?'primary':'outline'} onClick={()=>setEnergyView('daily')}>Daily</Button>
          <Button size="sm" variant={energyView==='weekly'?'primary':'outline'} onClick={()=>setEnergyView('weekly')}>Weekly</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-semibold text-[#326B5D] mb-4">Energy Demand Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                <XAxis dataKey="timestamp" stroke="#666"/>
                <YAxis stroke="#666"/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="demand" stroke="#326B5D" strokeWidth={2} name="Current Demand"/>
                <Line type="monotone" dataKey="prediction" stroke="#7FC8A9" strokeWidth={2} strokeDasharray="5 5" name="AI Prediction"/>
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-[#326B5D] mb-4">Water Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                <XAxis dataKey="timestamp" stroke="#666"/>
                <YAxis stroke="#666"/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="flow" stroke="#7FC8A9" strokeWidth={2} name="Flow Rate (L/s)"/>
                <Line type="monotone" dataKey="pressure" stroke="#326B5D" strokeWidth={2} name="Pressure (PSI)"/>
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Zone Map */}
        <Card>
          <h3 className="text-xl font-semibold text-[#326B5D] mb-4">Delhi Zones Status</h3>
          <div className="h-96">
            <MapContainer center={[28.6139,77.209]} zoom={11} scrollWheelZoom style={{height:'100%', width:'100%'}}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              {zonesData.map((zone,i)=>(
                <Circle
                  key={i}
                  center={[zone.lat,zone.lng]}
                  radius={500}
                  color={zone.status==='critical'?'red':zone.status==='warning'?'orange':'green'}
                >
                  <Popup>
                    <strong>{zone.name}</strong><br/>
                    Energy: {zone.energy} MW<br/>
                    Water Flow: {zone.waterFlow} L/s<br/>
                    Status: {zone.status}
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>
        </Card>
      </div>
      <footer className="mt-10 text-center text-gray-600 text-sm">
          <p>© 2025 CityShield | Built by Team Maverick</p>
        </footer>
    </div>
  );
};

/* Metric Card Subcomponent */
function MetricCard({title,value,badge,icon:Icon}:{title:string,value:any,badge:JSX.Element,icon:any}){
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
      <Card hover>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-[#326B5D]">{value}</h3>
            <div className="mt-2">{badge}</div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#326B5D]" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
